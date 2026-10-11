/**
 * ERB E41 – RESUMEN POR HORA Y CIERRE DE DÍA OPERATIVO (05:00 → 05:00)
 *
 * Va como archivo APARTE (p. ej. "Resumen.gs") en el proyecto de Apps Script de la hoja
 * "FORMATO PRUEBA E41". No modifica el doPost del ESP32 ni la hoja de datos: solo lee
 * las columnas A–D y escribe en dos pestañas nuevas, colocadas al final del libro.
 *
 *   RESUMEN_HORA  – una fila por hora con existencia y movimientos de cada tanque.
 *   CIERRE_0500   – una fila por día operativo (cierra a las 05:00, como el parte diario).
 *
 * INSTALACIÓN (una sola vez):
 *  1. Agregue este archivo al proyecto y guarde.
 *  2. Ejecute `actualizarResumen`. La primera vez procesa la historia en tandas de ~5 min;
 *     si el registro dice "continúa pendiente", ejecútela otra vez hasta que diga "al día".
 *  3. Ejecute `instalarActivador` para que corra sola cada hora.
 *
 * Los días se nombran por la fecha de cierre: "2026-10-10" = del 9/10 05:00 al 10/10 05:00.
 * "sube" y "baja" suman los movimientos de nivel mayores a la banda de ruido; en el total de
 * la estación los trasiegos entre tanques se cancelan, así que recibido/enviado son de la ERB.
 */

var E41 = {
  tanques: ["TV-601", "TV-602", "TV-741"],
  bblPorM: [1092.953, 1066.058202, 840.1914], // mismos factores que la app y Looker
  hojaResumen: "RESUMEN_HORA",
  hojaCierre: "CIERRE_0500",
  horaCierre: 5,
  // Movimiento mínimo para contar como subida/bajada (filtra el ruido del radar ±1 mm)
  bandaM: 0.005,
  bandaBbl: 5,
  nivelMaxM: 15, // lecturas mayores se descartan (999.999 = falla del radar)
  bloque: 40000, // filas leídas por lectura
  maxMs: 4.5 * 60 * 1000, // margen bajo el límite de 6 min de Apps Script
};

/* ── Utilidades ── */
function e41Props() {
  return PropertiesService.getScriptProperties();
}

function e41LeerJSON(k) {
  var v = e41Props().getProperty(k);
  return v ? JSON.parse(v) : null;
}

function e41GuardarJSON(k, obj) {
  e41Props().setProperty(k, JSON.stringify(obj));
}

function e41Redondear(n, d) {
  var f = Math.pow(10, d || 0);
  return Math.round(n * f) / f;
}

function e41Celda(n, d) {
  return n == null ? "" : e41Redondear(n, d);
}

/* La hoja de datos del ESP32 es la primera del libro (doPost usa getActiveSheet). */
function e41HojaDatos(ss) {
  return ss.getSheets()[0];
}

function e41Hoja(ss, nombre, encabezados) {
  var sh = ss.getSheetByName(nombre);
  if (!sh) {
    // Al final del libro para no cambiar cuál es la primera hoja
    sh = ss.insertSheet(nombre, ss.getNumSheets());
    sh.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

function e41EncabezadosHora() {
  var h = ["hora", "dia_operativo", "muestras"];
  E41.tanques.forEach(function (t) {
    h.push(t + " nivel_m", t + " existencia_bbl", t + " cambio_bbl", t + " sube_bbl", t + " baja_bbl");
  });
  return h.concat(["total_existencia_bbl", "total_cambio_bbl", "total_sube_bbl", "total_baja_bbl"]);
}

function e41EncabezadosCierre() {
  var h = ["fecha_cierre", "horas_con_datos"];
  E41.tanques.forEach(function (t) {
    h.push(t + " existencia_bbl", t + " cambio_bbl", t + " sube_bbl", t + " baja_bbl", t + " estado");
  });
  return h.concat(["total_existencia_bbl", "total_cambio_bbl", "recibido_bbl", "enviado_bbl"]);
}

/* Convierte la celda de fecha (Date, o texto d/m/aaaa h:m:s) a Date. */
function e41Fecha(v) {
  if (v instanceof Date) return v;
  var m = String(v).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (!m) return null;
  return new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0));
}

/* Lectura válida: número entre 0 y el máximo (0 exacto y 999.999 son fallas del radar). */
function e41Lectura(v) {
  if (v === "" || v == null) return null;
  var x = parseFloat(v);
  if (isNaN(x) || x <= 0 || x > E41.nivelMaxM) return null;
  return x;
}

/* Acumula subidas/bajadas con histéresis: solo cuenta cuando el nivel se aleja `banda` de la referencia. */
function e41Histeresis(ref, valor, banda, acc) {
  if (ref == null) return valor;
  var d = valor - ref;
  if (Math.abs(d) < banda) return ref;
  if (d > 0) acc.sube += d;
  else acc.baja -= d;
  return valor;
}

/* ── Proceso principal ── */
function actualizarResumen() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) {
    console.log("Ya hay una actualización en curso.");
    return;
  }
  try {
    e41Procesar();
  } finally {
    lock.releaseLock();
  }
}

function e41Procesar() {
  var t0 = Date.now();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tz = ss.getSpreadsheetTimeZone();
  var datos = e41HojaDatos(ss);
  var shHora = e41Hoja(ss, E41.hojaResumen, e41EncabezadosHora());
  var shCierre = e41Hoja(ss, E41.hojaCierre, e41EncabezadosCierre());
  var nT = E41.tanques.length;

  // Estado persistente entre ejecuciones
  var st = e41LeerJSON("E41_ESTADO") || {
    fila: 2, // siguiente fila de datos por leer
    hora: "", // última hora procesada (yyyy-MM-dd HH)
    ref: { t: [], s: null }, // referencias de histéresis por tanque y total
    ultimo: [], // última lectura válida de cada tanque (m)
    finPrev: [], // existencia al cierre de la hora anterior por tanque (bbl o null)
    dia: null, // acumulador del día operativo en curso
    cierrePrev: null, // existencias del último cierre por tanque (bbl o null)
  };

  var horaActual = Utilities.formatDate(new Date(), tz, "yyyy-MM-dd HH");
  var ultimaFila = datos.getLastRow();
  var filasHora = [];
  var filasCierre = [];
  var alDia = false;

  while (Date.now() - t0 < E41.maxMs) {
    if (st.fila > ultimaFila) {
      alDia = true;
      break;
    }
    var n = Math.min(E41.bloque, ultimaFila - st.fila + 1);
    var valores = datos.getRange(st.fila, 1, n, 1 + nT).getValues();
    var llegoAlFinal = st.fila + n - 1 >= ultimaFila;

    // Agrupar filas consecutivas por hora
    var grupos = [];
    for (var i = 0; i < valores.length; i++) {
      var f = e41Fecha(valores[i][0]);
      if (!f) continue;
      var clave = Utilities.formatDate(f, tz, "yyyy-MM-dd HH");
      var g = grupos[grupos.length - 1];
      if (!g || g.clave !== clave) {
        g = { clave: clave, fecha: f, idx: i, filas: [] };
        grupos.push(g);
      }
      g.filas.push(valores[i]);
    }

    var avanzar = n; // filas consumidas en este bloque
    for (var k = 0; k < grupos.length; k++) {
      var gr = grupos[k];
      var esUltimo = k === grupos.length - 1;
      var completa = !esUltimo || (llegoAlFinal && gr.clave < horaActual);
      if (!completa) {
        avanzar = gr.idx; // esta hora se vuelve a leer completa en el siguiente bloque
        break;
      }
      if (gr.clave <= st.hora) continue; // filas fuera de orden: hora ya procesada
      e41ProcesarHora(gr, st, tz, filasHora, filasCierre);
    }

    if (avanzar === 0 && !llegoAlFinal) {
      throw new Error("Una sola hora no cabe en el bloque (fila " + st.fila + ")");
    }
    st.fila += avanzar;
    if (llegoAlFinal) {
      alDia = true; // lo que queda es la hora en curso
      break;
    }
  }

  if (filasHora.length) {
    shHora
      .getRange(shHora.getLastRow() + 1, 1, filasHora.length, filasHora[0].length)
      .setValues(filasHora);
  }
  if (filasCierre.length) {
    shCierre
      .getRange(shCierre.getLastRow() + 1, 1, filasCierre.length, filasCierre[0].length)
      .setValues(filasCierre);
  }
  e41GuardarJSON("E41_ESTADO", st);

  console.log(
    "Horas nuevas: " + filasHora.length + " | Cierres nuevos: " + filasCierre.length +
      " | Fila " + st.fila + " de " + ultimaFila +
      (alDia ? " | al día" : " | continúa pendiente: ejecute otra vez"),
  );
}

function e41ProcesarHora(gr, st, tz, filasHora, filasCierre) {
  var nT = E41.tanques.length;
  var diaOp = Utilities.formatDate(
    new Date(gr.fecha.getTime() + (24 - E41.horaCierre) * 3600 * 1000),
    tz,
    "yyyy-MM-dd",
  );

  // Cambio de día operativo: cerrar el anterior
  if (st.dia && st.dia.fecha !== diaOp) {
    filasCierre.push(e41FilaCierre(st));
    st.dia = null;
  }
  if (!st.dia) {
    st.dia = { fecha: diaOp, horas: 0, t: [], s: { sube: 0, baja: 0 }, fin: [] };
    for (var j = 0; j < nT; j++)
      st.dia.t.push({ sube: 0, baja: 0, min: null, max: null, malas: 0, n: 0 });
  }

  var acc = [];
  for (var a = 0; a < nT; a++) acc.push({ sube: 0, baja: 0 });
  var accS = { sube: 0, baja: 0 };
  var finHora = []; // última lectura válida dentro de esta hora (m)

  gr.filas.forEach(function (r) {
    var total = 0;
    for (var t = 0; t < nT; t++) {
      var v = e41Lectura(r[1 + t]);
      var dt = st.dia.t[t];
      dt.n++;
      if (v == null) {
        dt.malas++;
      } else {
        st.ref.t[t] = e41Histeresis(st.ref.t[t], v, E41.bandaM, acc[t]);
        st.ultimo[t] = v;
        finHora[t] = v;
        dt.min = dt.min == null ? v : Math.min(dt.min, v);
        dt.max = dt.max == null ? v : Math.max(dt.max, v);
      }
      // El total usa la última lectura válida para que una falla no parezca bombeo
      if (st.ultimo[t] != null) total += st.ultimo[t] * E41.bblPorM[t];
    }
    st.ref.s = e41Histeresis(st.ref.s, total, E41.bandaBbl, accS);
  });

  var fila = [gr.clave + ":00", diaOp, gr.filas.length];
  var fin = [];
  var totalFin = 0;
  var totalCambio = 0;
  var hayCambio = false;
  for (var t2 = 0; t2 < nT; t2++) {
    var bbl = finHora[t2] != null ? finHora[t2] * E41.bblPorM[t2] : null;
    var subeBbl = acc[t2].sube * E41.bblPorM[t2];
    var bajaBbl = acc[t2].baja * E41.bblPorM[t2];
    var prev = st.finPrev[t2];
    var cambio = bbl != null && prev != null ? bbl - prev : null;
    fin.push(bbl);
    if (bbl != null) totalFin += bbl;
    if (cambio != null) {
      totalCambio += cambio;
      hayCambio = true;
    }
    st.dia.t[t2].sube += subeBbl;
    st.dia.t[t2].baja += bajaBbl;
    fila.push(
      e41Celda(finHora[t2], 3),
      e41Celda(bbl, 1),
      e41Celda(cambio, 1),
      e41Redondear(subeBbl, 1),
      e41Redondear(bajaBbl, 1),
    );
  }
  fila.push(
    e41Redondear(totalFin, 1),
    hayCambio ? e41Redondear(totalCambio, 1) : "",
    e41Redondear(accS.sube, 1),
    e41Redondear(accS.baja, 1),
  );

  st.dia.s.sube += accS.sube;
  st.dia.s.baja += accS.baja;
  st.dia.horas++;
  st.dia.fin = fin;
  st.finPrev = fin;
  st.hora = gr.clave;
  filasHora.push(fila);
}

function e41FilaCierre(st) {
  var d = st.dia;
  var nT = E41.tanques.length;
  var prev = st.cierrePrev || [];
  var fila = [d.fecha, d.horas];
  var total = 0;
  var totalCambio = 0;
  var hayCambio = false;
  for (var t = 0; t < nT; t++) {
    var x = d.t[t];
    var estado = "OK";
    if (x.min == null) estado = "SIN LECTURA";
    else if (x.max - x.min < 0.002) estado = "SIN CAMBIO";
    else if (x.malas > x.n * 0.05) estado = "INTERMITENTE";
    var fin = d.fin[t];
    var cambio = fin != null && prev[t] != null ? fin - prev[t] : null;
    if (fin != null) total += fin;
    if (cambio != null) {
      totalCambio += cambio;
      hayCambio = true;
    }
    fila.push(
      e41Celda(fin, 1),
      e41Celda(cambio, 1),
      e41Redondear(x.sube, 1),
      e41Redondear(x.baja, 1),
      estado,
    );
  }
  fila.push(
    e41Redondear(total, 1),
    hayCambio ? e41Redondear(totalCambio, 1) : "",
    e41Redondear(d.s.sube, 1),
    e41Redondear(d.s.baja, 1),
  );
  st.cierrePrev = d.fin;
  return fila;
}

/* ── Administración ── */

/* Crea el activador que ejecuta actualizarResumen cada hora (reemplaza uno anterior). */
function instalarActivador() {
  ScriptApp.getProjectTriggers().forEach(function (tr) {
    if (tr.getHandlerFunction() === "actualizarResumen") ScriptApp.deleteTrigger(tr);
  });
  ScriptApp.newTrigger("actualizarResumen").timeBased().everyHours(1).nearMinute(5).create();
  console.log("Activador instalado: actualizarResumen cada hora.");
}

/* Borra las pestañas de resumen y el estado para recalcular toda la historia. */
function reiniciarResumen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  [E41.hojaResumen, E41.hojaCierre].forEach(function (n) {
    var sh = ss.getSheetByName(n);
    if (sh) ss.deleteSheet(sh);
  });
  e41Props().deleteProperty("E41_ESTADO");
  console.log("Resumen reiniciado. Ejecute actualizarResumen para recalcular.");
}
