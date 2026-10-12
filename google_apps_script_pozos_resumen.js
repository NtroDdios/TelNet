/**
 * POZOS – RESUMEN DIARIO Y EVENTOS POR POZO (día operativo 05:00 → 05:00)
 *
 * Va como archivo APARTE (p. ej. "ResumenPozos.gs") en el proyecto de Apps Script de la hoja
 * "TELEMETRIA-1069HD-SHEET-V17.3" (el mismo de google_apps_script_accesos.js). No modifica el
 * doPost ni la pestaña DATOS: solo la lee y escribe en tres pestañas nuevas, al final del libro.
 *
 *   RESUMEN_POZOS – una fila por pozo y día operativo: horas operando / en paro / sin comunicación.
 *   EVENTOS_POZOS – cada paro y cada pérdida de comunicación, con inicio, fin y horas
 *                   (lo que pide el parte diario para la producción diferida).
 *   POZOS_HOY     – el día operativo en curso; se reescribe en cada ejecución.
 *
 * Cómo se clasifica el tiempo: cada fila del pozo define su estado hasta la siguiente fila
 * (DATO / RESTABLECIDO = operando, ALARMA = paro). Si pasan más de `toleranciaMin` sin filas
 * de ese pozo, el resto del hueco cuenta como sin comunicación.
 *
 * INSTALACIÓN (una sola vez):
 *  1. Agregue este archivo al proyecto y guarde.
 *  2. Ejecute `actualizarResumenPozos`. La primera vez procesa la historia en tandas; si el
 *     registro dice "continúa pendiente", ejecútela otra vez hasta que diga "al día".
 *  3. Ejecute `instalarActivadorPozos` para que corra sola cada hora.
 *  4. Publique en la web las pestañas RESUMEN_POZOS, EVENTOS_POZOS y POZOS_HOY.
 *
 * Las fechas se manejan como hora local de la hoja (GMT-6, la misma con la que doPost escribe).
 * Los días se nombran por la fecha de cierre: "2026-10-10" = del 9/10 05:00 al 10/10 05:00.
 */

var POZ = {
  hojaDatos: "DATOS",
  hojaDia: "RESUMEN_POZOS",
  hojaEventos: "EVENTOS_POZOS",
  hojaHoy: "POZOS_HOY",
  zona: "GMT-6", // igual que doPost
  horaCierre: 5,
  // El equipo reporta cada ~3 min, pero hay huecos frecuentes de 15–30 min con el pozo
  // trabajando; solo lo que pase de esta tolerancia cuenta como sin comunicación.
  toleranciaMin: 30,
  eventoParoMin: 15, // paros más cortos no se listan como evento
  eventoSinComMin: 60, // pérdidas de comunicación más cortas no se listan como evento
  diasInactivo: 7, // un pozo sin filas en tantos días deja de aparecer en el resumen
  bloque: 40000,
  maxMs: 4.5 * 60 * 1000,
  claveEstado: "POZ_ESTADO",
};

var POZ_H = 3600 * 1000;
var POZ_DIA = 24 * POZ_H;

/* ── Utilidades ── */
function pozRedondear(n, d) {
  var f = Math.pow(10, d || 0);
  return Math.round(n * f) / f;
}

/* Hora local como milisegundos "de pared" (UTC con los números locales), sin depender de la zona. */
function pozMs(v) {
  var s = String(v).trim();
  var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})[ T](\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +(m[6] || 0));
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/);
  if (m) return Date.UTC(+m[3], +m[2] - 1, +m[1], +m[4], +m[5], +(m[6] || 0));
  return null;
}

function pozTexto(ms) {
  return new Date(ms).toISOString().slice(0, 19).replace("T", " ");
}

/* Día operativo (fecha de cierre) de un instante */
function pozDia(ms) {
  return new Date(ms + (24 - POZ.horaCierre) * POZ_H).toISOString().slice(0, 10);
}

/* Instante en que cierra el día operativo `dia` (dia 05:00) */
function pozFinDia(dia) {
  return Date.parse(dia + "T00:00:00Z") + POZ.horaCierre * POZ_H;
}

function pozAhora() {
  return pozMs(Utilities.formatDate(new Date(), POZ.zona, "yyyy-MM-dd HH:mm:ss"));
}

function pozHoja(ss, nombre, encabezados) {
  var sh = ss.getSheetByName(nombre);
  if (!sh) sh = ss.insertSheet(nombre, ss.getNumSheets());
  // Repone la fila de encabezados si falta (pestaña nueva o fila 1 borrada / sobrescrita)
  if (String(sh.getRange(1, 1).getValue()) !== encabezados[0]) {
    if (sh.getLastRow() > 0) sh.insertRowBefore(1);
    sh.getRange(1, 1, 1, encabezados.length).setValues([encabezados]).setFontWeight("bold");
    sh.setFrozenRows(1);
  }
  return sh;
}

var POZ_ENC_DIA = [
  "fecha_cierre", "pozo", "horas_operando", "horas_paro", "horas_sin_com",
  "disponibilidad_pct", "paros", "muestras", "rpm_prom", "corriente_prom",
  "ptp_prom", "temp_gen_prom", "ultimo_estado", "ultima_lectura",
];
var POZ_ENC_EVENTOS = ["dia_operativo", "pozo", "tipo", "inicio", "fin", "horas", "detalle"];

/* ── Acumuladores ── */
function pozDiaNuevo() {
  return { op: 0, paro: 0, sc: 0, paros: 0, n: 0, sum: [0, 0, 0, 0], cnt: [0, 0, 0, 0] };
}

function pozDiaDe(w, dia) {
  if (!w.dias[dia]) w.dias[dia] = pozDiaNuevo();
  return w.dias[dia];
}

/* Reparte el tiempo [w.hasta, T) entre el estado de la última fila y sin comunicación,
   partiendo en los cierres de las 05:00. */
function pozAvanzar(w, T) {
  if (w.ultimo == null || T <= w.hasta) return;
  var limiteEstado = w.ultimo + POZ.toleranciaMin * 60 * 1000;
  var t = w.hasta;
  while (t < T) {
    var dia = pozDia(t);
    var fin = Math.min(T, pozFinDia(dia));
    var corte = Math.min(fin, Math.max(t, limiteEstado));
    var acc = pozDiaDe(w, dia);
    if (corte > t) acc[w.estado === "PARO" ? "paro" : "op"] += corte - t;
    if (fin > corte) acc.sc += fin - corte;
    t = fin;
  }
  w.hasta = T;
}

function pozEvento(eventos, w, tipo, inicio, fin, detalle) {
  var minimo = tipo === "PARO" ? POZ.eventoParoMin : POZ.eventoSinComMin;
  if (fin - inicio < minimo * 60 * 1000) return;
  eventos.push([
    pozDia(inicio), w.nombre, tipo, pozTexto(inicio), pozTexto(fin),
    pozRedondear((fin - inicio) / POZ_H, 2), detalle || "",
  ]);
}

/* Procesa una fila de DATOS: [fecha, pozo, tipo, PAR, RPM, I, V, VLL, F, T, gRPM, PTP, texto] */
function pozFila(st, r, eventos) {
  var ms = pozMs(r[0]);
  var nombre = String(r[1]).trim();
  var tipo = String(r[2]).trim().toUpperCase();
  if (ms == null || !nombre || nombre.toUpperCase() === "DESCONOCIDO") return;

  var w = st.pozos[nombre];
  if (!w) w = st.pozos[nombre] = { nombre: nombre, ultimo: null, hasta: ms, estado: null, dias: {}, paroDesde: null, paroTexto: "" };
  if (w.ultimo != null && ms < w.ultimo) return; // fila fuera de orden

  // Hueco de comunicación: el evento va de la última fila a la siguiente
  if (w.ultimo != null && ms - w.ultimo > POZ.toleranciaMin * 60 * 1000) {
    pozEvento(eventos, w, "SIN COMUNICACION", w.ultimo, ms, "");
    // Un paro que pasa por un hueco no se sabe cuánto duró de verdad: se anota en el evento
    if (w.paroDesde != null) w.paroSinCom = (w.paroSinCom || 0) + (ms - w.ultimo);
  }
  pozAvanzar(w, ms);

  var estado = tipo === "ALARMA" ? "PARO" : "OPERANDO";
  var acc = pozDiaDe(w, pozDia(ms));
  acc.n++;
  if (estado === "PARO" && w.estado !== "PARO") {
    acc.paros++;
    w.paroDesde = ms;
    w.paroTexto = String(r[12] || "").trim();
    w.paroSinCom = 0;
  }
  if (estado === "OPERANDO" && w.estado === "PARO" && w.paroDesde != null) {
    var detalle = w.paroTexto;
    if (w.paroSinCom)
      detalle += " · incluye " + pozRedondear(w.paroSinCom / POZ_H, 2) + " h sin comunicación";
    pozEvento(eventos, w, "PARO", w.paroDesde, ms, detalle);
    w.paroDesde = null;
    w.paroSinCom = 0;
  }
  if (estado === "OPERANDO") {
    // RPM variador, corriente, PTP, temperatura del generador
    [4, 5, 11, 9].forEach(function (c, i) {
      var x = typeof r[c] === "number" ? r[c] : parseFloat(r[c]);
      if (!isNaN(x)) {
        acc.sum[i] += x;
        acc.cnt[i]++;
      }
    });
  }
  w.estado = estado;
  w.ultimo = ms;
}

function pozFilaDia(w, dia) {
  var a = w.dias[dia] || pozDiaNuevo();
  var prom = function (i) {
    return a.cnt[i] ? pozRedondear(a.sum[i] / a.cnt[i], 1) : "";
  };
  return [
    dia, w.nombre,
    pozRedondear(a.op / POZ_H, 2), pozRedondear(a.paro / POZ_H, 2), pozRedondear(a.sc / POZ_H, 2),
    pozRedondear((a.op / POZ_DIA) * 100, 1), a.paros, a.n,
    prom(0), prom(1), prom(2), prom(3),
    w.estado || "", w.ultimo != null ? pozTexto(w.ultimo) : "",
  ];
}

/* Pozos que se reportan en el día: con filas dentro de los últimos `diasInactivo` días. */
function pozActivos(st, finDia) {
  return Object.keys(st.pozos)
    .sort()
    .map(function (k) {
      return st.pozos[k];
    })
    .filter(function (w) {
      return w.ultimo != null && finDia - w.ultimo <= POZ.diasInactivo * POZ_DIA && w.ultimo < finDia;
    });
}

/* Cierra los días operativos anteriores a `diaNuevo` */
function pozCerrarHasta(st, diaNuevo, filasDia) {
  while (st.dia && st.dia < diaNuevo) {
    var fin = pozFinDia(st.dia);
    pozActivos(st, fin).forEach(function (w) {
      pozAvanzar(w, fin);
      filasDia.push(pozFilaDia(w, st.dia));
    });
    Object.keys(st.pozos).forEach(function (k) {
      var w = st.pozos[k];
      Object.keys(w.dias).forEach(function (d) {
        if (d <= st.dia) delete w.dias[d];
      });
    });
    st.dia = pozDia(fin); // siguiente día operativo
  }
}

/* ── Proceso principal ── */
function actualizarResumenPozos() {
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(1000)) {
    console.log("Ya hay una actualización en curso.");
    return;
  }
  try {
    pozProcesar();
  } finally {
    lock.releaseLock();
  }
}

function pozProcesar() {
  var t0 = Date.now();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var datos = ss.getSheetByName(POZ.hojaDatos);
  if (!datos) throw new Error("No existe la pestaña " + POZ.hojaDatos);
  var shDia = pozHoja(ss, POZ.hojaDia, POZ_ENC_DIA);
  var shEv = pozHoja(ss, POZ.hojaEventos, POZ_ENC_EVENTOS);
  var shHoy = pozHoja(ss, POZ.hojaHoy, POZ_ENC_DIA);

  var props = PropertiesService.getScriptProperties();
  var guardado = props.getProperty(POZ.claveEstado);
  var st = guardado ? JSON.parse(guardado) : { fila: 2, dia: null, pozos: {} };

  var ultimaFila = datos.getLastRow();
  var filasDia = [];
  var eventos = [];
  var alDia = false;

  while (Date.now() - t0 < POZ.maxMs) {
    if (st.fila > ultimaFila) {
      alDia = true;
      break;
    }
    var n = Math.min(POZ.bloque, ultimaFila - st.fila + 1);
    var valores = datos.getRange(st.fila, 1, n, 13).getValues();
    // La fecha se lee como texto, tal como la escribió doPost (hora local GMT-6)
    var fechas = datos.getRange(st.fila, 1, n, 1).getDisplayValues();
    for (var i = 0; i < valores.length; i++) {
      valores[i][0] = fechas[i][0];
      var ms = pozMs(valores[i][0]);
      if (ms == null) continue;
      var dia = pozDia(ms);
      if (!st.dia) st.dia = dia;
      if (dia > st.dia) pozCerrarHasta(st, dia, filasDia);
      if (dia < st.dia) continue; // fila atrasada de un día ya cerrado
      pozFila(st, valores[i], eventos);
    }
    st.fila += n;
  }

  // Si el día en curso ya terminó y no han llegado filas nuevas, cerrarlo igual
  var ahora = pozAhora();
  if (alDia && st.dia && pozDia(ahora) > st.dia) pozCerrarHasta(st, pozDia(ahora), filasDia);

  if (filasDia.length)
    shDia.getRange(shDia.getLastRow() + 1, 1, filasDia.length, POZ_ENC_DIA.length).setValues(filasDia);
  if (eventos.length)
    shEv.getRange(shEv.getLastRow() + 1, 1, eventos.length, POZ_ENC_EVENTOS.length).setValues(eventos);
  props.setProperty(POZ.claveEstado, JSON.stringify(st));

  // Día en curso: copia del estado avanzada hasta ahora (no se guarda)
  if (alDia) pozEscribirHoy(shHoy, JSON.parse(JSON.stringify(st)), ahora);

  console.log(
    "Días-pozo nuevos: " + filasDia.length + " | Eventos nuevos: " + eventos.length +
      " | Fila " + Math.min(st.fila, ultimaFila + 1) + " de " + ultimaFila +
      (alDia ? " | al día" : " | continúa pendiente: ejecute otra vez"),
  );
}

function pozEscribirHoy(sh, st, ahora) {
  if (!st.dia) return;
  var filas = pozActivos(st, ahora + 1).map(function (w) {
    pozAvanzar(w, ahora);
    var f = pozFilaDia(w, st.dia);
    // Paro abierto: el estado actual dice desde cuándo
    if (w.estado === "PARO" && w.paroDesde != null) f[12] = "PARO desde " + pozTexto(w.paroDesde);
    else if (ahora - w.ultimo > POZ.toleranciaMin * 60 * 1000) f[12] = "SIN COMUNICACION";
    return f;
  });
  var ultima = sh.getLastRow();
  if (ultima > 1) sh.getRange(2, 1, ultima - 1, POZ_ENC_DIA.length).clearContent();
  if (filas.length) sh.getRange(2, 1, filas.length, POZ_ENC_DIA.length).setValues(filas);
}

/* ── Administración ── */

/* Crea el activador que ejecuta actualizarResumenPozos cada hora (reemplaza uno anterior). */
function instalarActivadorPozos() {
  ScriptApp.getProjectTriggers().forEach(function (tr) {
    if (tr.getHandlerFunction() === "actualizarResumenPozos") ScriptApp.deleteTrigger(tr);
  });
  ScriptApp.newTrigger("actualizarResumenPozos").timeBased().everyHours(1).nearMinute(10).create();
  console.log("Activador instalado: actualizarResumenPozos cada hora.");
}

/* Vacía las pestañas de resumen y borra el estado para recalcular toda la historia.
   Las pestañas se conservan para no cambiar sus gid (la app las pide por gid). */
function reiniciarResumenPozos() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  [POZ.hojaDia, POZ.hojaEventos, POZ.hojaHoy].forEach(function (n) {
    var sh = ss.getSheetByName(n);
    if (sh && sh.getLastRow() > 1)
      sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).clearContent();
  });
  PropertiesService.getScriptProperties().deleteProperty(POZ.claveEstado);
  console.log("Resumen de pozos reiniciado. Ejecute actualizarResumenPozos para recalcular.");
}
