/* ═══════════════════════════════════════════════
   TELNET – DATA SERVICE  (data.js)
   ═══════════════════════════════════════════════ */

const DB = (function () {
  /* ── Spreadsheet CSV URLs ── */
  var E41_PUB =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRquP2hMacKcZRBshBCQh1w3Ad5cIJaY4mV03zKHPaPVp2Bmb1tvPh-HihmZbVeiH63E4CZLjWLPOXu/pub?output=csv";
  var ESTACIONES_CSV = E41_PUB + "&gid=0";
  var POZOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv&gid=0";
  var COORDENADAS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv&gid=48860810";
  /* Pestañas que llena google_apps_script_e41_resumen.js en la hoja de E41 */
  var RESUMEN_HORA_CSV = E41_PUB + "&gid=541439107";
  var CIERRE_CSV = E41_PUB + "&gid=375527899";
  var RESUMEN_TTL = 10 * 60 * 1000; // el resumen se recalcula cada hora
  /* Pestañas que llena google_apps_script_pozos_resumen.js en la hoja de pozos */
  var POZOS_PUB =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv";
  var POZOS_DIA_CSV = POZOS_PUB + "&gid=1193255263";
  var POZOS_EVENTOS_CSV = POZOS_PUB + "&gid=2024879093";
  var POZOS_HOY_CSV = POZOS_PUB + "&gid=2017838129";
  // Mismas columnas que escribe google_apps_script_pozos_resumen.js
  var POZOS_ENC_DIA = [
    "fecha_cierre", "pozo", "horas_operando", "horas_paro", "horas_sin_com",
    "disponibilidad_pct", "paros", "muestras", "rpm_prom", "corriente_prom",
    "ptp_prom", "temp_gen_prom", "ultimo_estado", "ultima_lectura",
  ];
  var POZOS_ENC_EVENTOS = ["dia_operativo", "pozo", "tipo", "inicio", "fin", "horas", "detalle"];

  var MAX_ROWS = 250000;
  var TTL = 30000; // 30 seconds — keeps live data fresh

  /* ── State ── */
  var cache = {
    erb: { rows: [], ts: 0 },
    pozos: { rows: [], ts: 0 },
    coordenadas: { rows: [], ts: 0 },
    resumen: { hora: [], cierre: [], ts: 0 },
    pozosResumen: { dias: [], eventos: [], hoy: [], ts: 0 },
  };

  /* ── Static geodata ── */
  var GEO_ERB = {
    "ERB E41": {
      lat: 22.23072,
      lng: -98.2726,
      sector: "Estación E41",
      tanques: 3,
    },
  };

  var GEO_POZOS = {
    "EBANO 1069H": {
      lat: 22.379812,
      lng: -98.2556,
      sector: "Sector Las Flores",
      campo: "Campo Ébano",
    },
    "EBANO 1069D": {
      lat: 22.379812,
      lng: -98.2556,
      sector: "Sector Las Flores",
      campo: "Campo Ébano",
    },
    "EBANO 1153H": {
      lat: 22.3928,
      lng: -98.2571,
      sector: "Sector Las Flores",
      campo: "Campo Ébano Norte",
    },
    "EBANO 1153D": {
      lat: 22.3928,
      lng: -98.2571,
      sector: "Sector Las Flores",
      campo: "Campo Ébano Norte",
    },
    "EBANO 3000EXP": {
      lat: 22.258199,
      lng: -98.2222,
      sector: "Sector Corcovado",
      campo: "Campo Exploración",
    },
    "EBANO 2287DES": {
      lat: 22.335406,
      lng: -98.291638,
      sector: "Sector D17",
      campo: "Campo Desarrollo",
    },
  };

  /* ── Helpers ── */
  function safeGet(k) {
    try {
      return JSON.parse(localStorage.getItem(k) || "null");
    } catch (e) {
      return null;
    }
  }

  function toF(v) {
    return parseFloat(v) || 0;
  }
  /* Like toF but keeps blanks as null (alarm rows carry no readings) */
  function toN(v) {
    if (v == null || String(v).trim() === "") return null;
    var n = parseFloat(v);
    return isNaN(n) ? null : n;
  }
  function toI(v) {
    return parseInt(v) || 0;
  }

  function csvSplit(line) {
    return line.split(",");
  }

  /* ── CSV fetch ── */
  async function fetchCSV(url, all) {
    var separator = url.indexOf("?") !== -1 ? "&" : "?";
    var fetchUrl = url + separator + "t=" + Date.now();
    var res = await fetch(fetchUrl, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var text = await res.text();
    var lines = text.split(/\r?\n/);
    var data = lines.slice(1).filter(function (l) {
      return l.trim();
    });
    return { rows: all ? data : data.slice(-MAX_ROWS) };
  }

  /* ── Parsers ── */
  function parseERB(rawRows) {
    return rawRows.map(function (line) {
      var p = csvSplit(line);
      var niv601 = toF(p[1]);
      var niv602 = toF(p[2]);
      var niv741 = toF(p[3]);
      var h601 = toF(p[15]) || 9.42;
      var h602 = toF(p[16]) || 9.38;
      var h741 = toF(p[17]) || 5.95;

      // Calculate percentage dynamically to avoid 0/stale values in the Google Sheet
      var pct601 = h601 > 0 ? (niv601 / h601) * 100 : 0;
      var pct602 = h602 > 0 ? (niv602 / h602) * 100 : 0;
      var pct741 = h741 > 0 ? (niv741 / h741) * 100 : 0;

      // Clamp percentages between 0 and 100
      pct601 = Math.max(0, Math.min(100, pct601));
      pct602 = Math.max(0, Math.min(100, pct602));
      pct741 = Math.max(0, Math.min(100, pct741));

      return {
        ts: p[0] ? p[0].trim() : "",
        niv601: niv601,
        niv602: niv602,
        niv741: niv741,
        presL1: toF(p[4]),
        presL2: toF(p[5]),
        pct601: pct601,
        pct602: pct602,
        pct741: pct741,
        alm601H: toI(p[9]),
        alm601L: toI(p[10]),
        alm602H: toI(p[11]),
        alm602L: toI(p[12]),
        alm741H: toI(p[13]),
        alm741L: toI(p[14]),
        h601: h601,
        h602: h602,
        h741: h741,
        umbH: toF(p[18]) || 80,
        umbL: toF(p[19]) || 20,
      };
    });
  }

  function parsePozos(rawRows) {
    return rawRows
      .map(function (line) {
        var p = csvSplit(line);
        var pozo = p[1] ? p[1].trim() : "";
        if (!pozo || pozo.toUpperCase() === "DESCONOCIDO") return null;
        return {
          ts: p[0] ? p[0].trim() : "",
          pozo: pozo,
          tipo: p[2] ? p[2].trim() : "",
          par: toN(p[3]),
          rpm: toN(p[4]),
          I: toN(p[5]),
          V: toN(p[6]),
          vll: toN(p[7]),
          freq: toN(p[8]),
          temp: toN(p[9]),
          gRPM: toN(p[10]),
          ptp: toN(p[11]),
          texto: p[12] ? p[12].trim() : "",
        };
      })
      .filter(Boolean);
  }

  function parseDate(ts) {
    if (!ts) return null;
    var parts = ts.trim().split(" ");
    if (parts.length < 2) return null;
    var dateParts = parts[0].split(/[-\/]/);
    var timeParts = parts[1].split(":");
    if (dateParts.length < 3 || timeParts.length < 2) return null;
    var year, month, day;
    if (dateParts[0].length === 4) {
      year = parseInt(dateParts[0]);
      month = parseInt(dateParts[1]) - 1;
      day = parseInt(dateParts[2]);
    } else {
      day = parseInt(dateParts[0]);
      month = parseInt(dateParts[1]) - 1;
      year = parseInt(dateParts[2]);
    }
    var hour = parseInt(timeParts[0]) || 0;
    var minute = parseInt(timeParts[1]) || 0;
    var second = parseInt(timeParts[2]) || 0;
    return new Date(year, month, day, hour, minute, second);
  }

  /* ── Load helpers ── */
  /* ── E41: solo las últimas ~26 h de lecturas, no los 25 MB de toda la historia ──
     El CSV publicado acepta &range=A{fila}:T (de esa fila al final). Ojo: si la fila de
     inicio pasa de la última, Google devuelve la hoja COMPLETA, así que el inicio siempre
     es una cota inferior segura:
       - Primera carga: la suma de "muestras" de RESUMEN_HORA es exactamente el número de
         lecturas hasta la última hora cerrada (fila = suma + 2).
       - Después: solo las filas nuevas, desde la siguiente fila conocida menos un margen. */
  var ERB_VENTANA_FILAS = 26 * 60; // una lectura por minuto
  var ERB_MARGEN_FILAS = 30;
  var ERB_MAX_CACHE = 3000;

  async function fetchERBDesde(fila) {
    var url = ESTACIONES_CSV + "&range=A" + fila + ":T&t=" + Date.now();
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var lines = (await res.text()).split(/\r?\n/).filter(function (l) {
      return l.trim();
    });
    // Rango fuera de la hoja: llegó el documento completo, empezando por el encabezado
    var completo = lines.length && /fecha/i.test(lines[0]);
    return { lines: completo ? lines.slice(1) : lines, completo: completo };
  }

  function sumaMuestras() {
    return cache.resumen.hora.reduce(function (a, r) {
      return a + (r.muestras || 0);
    }, 0);
  }

  async function loadERB() {
    var now = Date.now();
    if (cache.erb.ts && now - cache.erb.ts < TTL && cache.erb.rows.length)
      return cache.erb.rows;
    try {
      var previas = cache.erb.rows;
      var ultima = previas.length ? parseDate(previas[previas.length - 1].ts) : null;
      // Lo guardado de una sesión vieja no sirve como punto de partida
      if (!ultima || now - ultima > ERB_VENTANA_FILAS * 60e3) {
        cache.erb.next = 0;
        previas = [];
      }

      var desde;
      if (cache.erb.next) {
        desde = Math.max(2, cache.erb.next - ERB_MARGEN_FILAS);
      } else {
        await loadResumen();
        var total = sumaMuestras();
        desde = total ? Math.max(2, total + 2 - ERB_VENTANA_FILAS) : 0;
      }

      var r = desde ? await fetchERBDesde(desde) : await fetchCSV(ESTACIONES_CSV, true);
      var lineas = desde ? r.lines : r.rows;
      var nuevas = parseERB(lineas);
      var siguiente = desde && !r.completo ? desde + lineas.length : 2 + lineas.length;

      // Unir sin duplicar: solo filas posteriores a la última que ya tenemos.
      // También evita retroceder en el tiempo si el CDN de Google entrega datos atrasados.
      var corte = previas.length ? parseDate(previas[previas.length - 1].ts) : null;
      var agregadas = corte
        ? nuevas.filter(function (row) {
            var d = parseDate(row.ts);
            return d && d > corte;
          })
        : nuevas;
      var filas = previas.concat(agregadas);
      if (filas.length > ERB_MAX_CACHE) filas = filas.slice(-ERB_MAX_CACHE);

      cache.erb.rows = filas;
      cache.erb.next = Math.max(cache.erb.next || 0, siguiente);
      cache.erb.ts = now;
      try {
        localStorage.setItem("tn_erb", JSON.stringify(cache.erb));
      } catch (e) {}
    } catch (e) {
      console.warn("[DB] ERB fetch failed:", e.message);
      if (!cache.erb.rows.length) {
        var s = safeGet("tn_erb");
        if (s) Object.assign(cache.erb, s);
      }
    }
    return cache.erb.rows;
  }

  /* ── Pozos: solo los últimos 7 días (la pestaña DATOS completa pesa ~26 MB) ──
     Misma técnica que E41 (&range=A{fila}:M). La cota inferior sale de RESUMEN_POZOS y
     POZOS_HOY: la suma de "muestras" nunca pasa del número real de filas, porque el
     resumen se salta filas (pozo DESCONOCIDO, filas fuera de orden). */
  var POZOS_VENTANA_DIAS = 7;
  var POZOS_MARGEN_FILAS = 50;
  var POZOS_COMPLETO = false; // true después de pedir la historia completa a mano

  async function fetchPozosDesde(fila) {
    var url = POZOS_CSV + "&range=A" + fila + ":M&t=" + Date.now();
    var res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var lines = (await res.text()).split(/\r?\n/).filter(function (l) {
      return l.trim();
    });
    var completo = lines.length && /fecha/i.test(lines[0]);
    return { lines: completo ? lines.slice(1) : lines, completo: completo };
  }

  /* Fila desde la que bajar ~7 días, o 0 si el resumen no está disponible */
  function pozosFilaInicio() {
    var pr = cache.pozosResumen;
    if (!pr.dias.length) return 0;
    var suma = function (lista) {
      return lista.reduce(function (a, r) {
        return a + (r.muestras || 0);
      }, 0);
    };
    var total = suma(pr.dias) + suma(pr.hoy);
    var corte = new Date(Date.now() - POZOS_VENTANA_DIAS * 86400e3).toISOString().slice(0, 10);
    var ventana =
      suma(
        pr.dias.filter(function (r) {
          return r.fecha >= corte;
        }),
      ) + suma(pr.hoy);
    return Math.max(2, total + 2 - ventana - POZOS_MARGEN_FILAS);
  }

  async function loadPozos() {
    var now = Date.now();
    if (cache.pozos.ts && now - cache.pozos.ts < TTL && cache.pozos.rows.length)
      return cache.pozos.rows;
    try {
      var previas = cache.pozos.rows;
      var ultima = previas.length ? parseDate(previas[previas.length - 1].ts) : null;
      if (!POZOS_COMPLETO && (!ultima || now - ultima > POZOS_VENTANA_DIAS * 86400e3)) {
        cache.pozos.next = 0;
        previas = [];
      }

      var desde;
      if (cache.pozos.next) {
        desde = Math.max(2, cache.pozos.next - POZOS_MARGEN_FILAS);
      } else {
        await loadPozosResumen();
        desde = pozosFilaInicio();
      }

      var r = desde ? await fetchPozosDesde(desde) : await fetchCSV(POZOS_CSV, true);
      var lineas = desde ? r.lines : r.rows;
      var siguiente = desde && !r.completo ? desde + lineas.length : 2 + lineas.length;

      // Filas nuevas por posición (varios pozos comparten la misma hora); si el rango vino
      // completo o es la primera carga, se toma todo
      var nuevasLineas = lineas;
      if (previas.length && cache.pozos.next && desde && !r.completo)
        nuevasLineas = lineas.slice(Math.max(0, cache.pozos.next - desde));
      var nuevas = parsePozos(nuevasLineas);
      // Nunca retroceder en el tiempo (CDN de Google atrasado)
      var corte = previas.length ? parseDate(previas[previas.length - 1].ts) : null;
      if (corte)
        nuevas = nuevas.filter(function (row) {
          var d = parseDate(row.ts);
          return d && d >= corte;
        });
      var filas = r.completo || !previas.length ? nuevas : previas.concat(nuevas);

      cache.pozos.rows = filas;
      cache.pozos.next = Math.max(cache.pozos.next || 0, siguiente);
      cache.pozos.ts = now;
      try {
        localStorage.setItem("tn_pz", JSON.stringify({
          rows: cache.pozos.rows.slice(-10000),
          ts: cache.pozos.ts,
          // Si se recortó, la próxima sesión empieza desde el resumen
          next: cache.pozos.rows.length > 10000 ? 0 : cache.pozos.next,
        }));
      } catch (e) {}
    } catch (e) {
      console.warn("[DB] Pozos fetch failed:", e.message);
      if (!cache.pozos.rows.length) {
        var s = safeGet("tn_pz");
        if (s) Object.assign(cache.pozos, s);
      }
    }
    return cache.pozos.rows;
  }

  /* Historia completa de todos los pozos (~26 MB), solo cuando el usuario la pide */
  async function loadPozosCompleto() {
    var r = await fetchCSV(POZOS_CSV, true);
    cache.pozos.rows = parsePozos(r.rows);
    cache.pozos.next = 2 + r.rows.length;
    cache.pozos.ts = Date.now();
    POZOS_COMPLETO = true;
    return cache.pozos.rows;
  }

  async function loadCoords() {
    var now = Date.now();
    if (
      cache.coordenadas.ts &&
      now - cache.coordenadas.ts < 3600000 &&
      cache.coordenadas.rows.length
    )
      return cache.coordenadas.rows;
    try {
      var result = await fetchCSV(COORDENADAS_CSV, true);
      cache.coordenadas.rows = result.rows
        .map(function (line) {
          var p = line.split(",");
          return {
            pozo: p[0] ? p[0].trim() : "",
            lat: parseFloat(p[1]) || 0,
            lng: parseFloat(p[2]) || 0,
          };
        })
        .filter(function (r) {
          return r.pozo && r.lat && r.lng;
        });
      cache.coordenadas.ts = now;
      try {
        localStorage.setItem("tn_coords", JSON.stringify(cache.coordenadas));
      } catch (e) {}
    } catch (e) {
      console.warn("[DB] Coords fetch failed:", e.message);
      var s = safeGet("tn_coords");
      if (s) Object.assign(cache.coordenadas, s);
    }
    return cache.coordenadas.rows;
  }

  /* ── Resumen E41 (RESUMEN_HORA y CIERRE_0500) ──
     Se lee por nombre de columna para que agregar columnas en la hoja no rompa la app. */
  var RES_TANQUES = ["TV-601", "TV-602", "TV-741"];

  /* `encabezados` (opcional): columnas esperadas, por si la fila 1 de la pestaña se perdió */
  async function fetchTabla(url, encabezados) {
    var separator = url.indexOf("?") !== -1 ? "&" : "?";
    var res = await fetch(url + separator + "t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var lines = (await res.text()).split(/\r?\n/).filter(function (l) {
      return l.trim();
    });
    if (!lines.length) return [];
    var head = csvSplit(lines[0]).map(function (h) {
      return h.trim();
    });
    var datos = lines.slice(1);
    if (encabezados && head[0] !== encabezados[0]) {
      head = encabezados;
      datos = lines;
    }
    return datos.map(function (line) {
      var p = csvSplit(line);
      var o = {};
      head.forEach(function (h, i) {
        o[h] = p[i] != null ? p[i].trim() : "";
      });
      return o;
    });
  }

  function parseResumenHora(rows) {
    return rows.map(function (o) {
      var r = {
        ts: o.hora,
        dia: o.dia_operativo,
        muestras: toI(o.muestras),
        existencia: RES_TANQUES.map(function (t) {
          return toN(o[t + " existencia_bbl"]);
        }),
        totalExistencia: toN(o.total_existencia_bbl),
        totalCambio: toN(o.total_cambio_bbl),
        sube: toF(o.total_sube_bbl),
        baja: toF(o.total_baja_bbl),
      };
      // Mismas claves que las filas crudas para reutilizar las gráficas
      r.niv601 = toN(o["TV-601 nivel_m"]);
      r.niv602 = toN(o["TV-602 nivel_m"]);
      r.niv741 = toN(o["TV-741 nivel_m"]);
      return r;
    });
  }

  function parseCierre(rows) {
    return rows.map(function (o) {
      return {
        fecha: o.fecha_cierre,
        horas: toI(o.horas_con_datos),
        tanques: RES_TANQUES.map(function (t) {
          return {
            nombre: t,
            existencia: toN(o[t + " existencia_bbl"]),
            cambio: toN(o[t + " cambio_bbl"]),
            sube: toF(o[t + " sube_bbl"]),
            baja: toF(o[t + " baja_bbl"]),
            estado: o[t + " estado"] || "",
          };
        }),
        totalExistencia: toN(o.total_existencia_bbl),
        totalCambio: toN(o.total_cambio_bbl),
        recibido: toF(o.recibido_bbl),
        enviado: toF(o.enviado_bbl),
      };
    });
  }

  async function loadResumen() {
    var now = Date.now();
    if (cache.resumen.ts && now - cache.resumen.ts < RESUMEN_TTL)
      return cache.resumen;
    try {
      var tablas = await Promise.all([
        fetchTabla(RESUMEN_HORA_CSV),
        fetchTabla(CIERRE_CSV),
      ]);
      cache.resumen = {
        hora: parseResumenHora(tablas[0]),
        cierre: parseCierre(tablas[1]),
        ts: now,
      };
    } catch (e) {
      console.warn("[DB] Resumen fetch failed:", e.message);
    }
    return cache.resumen;
  }

  /* ── Resumen de pozos (RESUMEN_POZOS, EVENTOS_POZOS y POZOS_HOY) ── */
  function parsePozoDia(o) {
    return {
      fecha: o.fecha_cierre,
      pozo: o.pozo,
      operando: toF(o.horas_operando),
      paro: toF(o.horas_paro),
      sinCom: toF(o.horas_sin_com),
      disponibilidad: toF(o.disponibilidad_pct),
      paros: toI(o.paros),
      muestras: toI(o.muestras),
      rpm: toN(o.rpm_prom),
      corriente: toN(o.corriente_prom),
      estado: o.ultimo_estado,
      ultima: o.ultima_lectura,
    };
  }

  async function loadPozosResumen() {
    var now = Date.now();
    if (cache.pozosResumen.ts && now - cache.pozosResumen.ts < RESUMEN_TTL)
      return cache.pozosResumen;
    // Cada pestaña por separado: si una falla se conserva lo anterior y se reintenta en la siguiente carga
    var r = await Promise.allSettled([
      fetchTabla(POZOS_DIA_CSV, POZOS_ENC_DIA),
      fetchTabla(POZOS_EVENTOS_CSV, POZOS_ENC_EVENTOS),
      fetchTabla(POZOS_HOY_CSV, POZOS_ENC_DIA),
    ]);
    var c = cache.pozosResumen;
    var fallas = 0;
    r.forEach(function (x) {
      if (x.status === "rejected") {
        fallas++;
        console.warn("[DB] Resumen de pozos fetch failed:", x.reason && x.reason.message);
      }
    });
    cache.pozosResumen = {
      dias: r[0].status === "fulfilled" ? r[0].value.map(parsePozoDia) : c.dias,
      eventos:
        r[1].status === "fulfilled"
          ? r[1].value.map(function (o) {
              return {
                dia: o.dia_operativo,
                pozo: o.pozo,
                tipo: o.tipo,
                inicio: o.inicio,
                fin: o.fin,
                horas: toF(o.horas),
                detalle: o.detalle,
              };
            })
          : c.eventos,
      hoy: r[2].status === "fulfilled" ? r[2].value.map(parsePozoDia) : c.hoy,
      ts: fallas ? 0 : now,
    };
    return cache.pozosResumen;
  }

  function delPozo(lista, nombre) {
    return lista.filter(function (r) {
      return r.pozo === nombre;
    });
  }
  function getPozoDias(nombre) {
    return delPozo(cache.pozosResumen.dias, nombre);
  }
  function getPozoEventos(nombre) {
    return delPozo(cache.pozosResumen.eventos, nombre);
  }
  function getPozoHoy(nombre) {
    return delPozo(cache.pozosResumen.hoy, nombre)[0] || null;
  }

  /* ── PUBLIC API ── */

  /* A device that hasn't reported within STALE_MS is shown as communication loss */
  var STALE_MS = 30 * 60 * 1000;
  function isStale(ts) {
    var d = parseDate(ts);
    return !d || Date.now() - d.getTime() > STALE_MS;
  }

  /* Últimas n lecturas crudas, sin recorrer toda la historia */
  function getERBUltimas(n) {
    return cache.erb.rows.slice(-n);
  }

  function getLatestERB() {
    var r = cache.erb.rows;
    return r.length ? r[r.length - 1] : null;
  }

  /* Rows inside the last `hours`. Falls back to a row-count estimate only when
     the timestamps can't be parsed at all, so a silent device shows an empty window
     instead of stale data mislabeled as recent. */
  function lastHours(rows, hours, rowsPerHour) {
    if (!rows.length) return [];
    var cutoff = new Date(Date.now() - hours * 3600 * 1000);
    var parsed = 0;
    var filtered = rows.filter(function (row) {
      var d = parseDate(row.ts);
      if (d) parsed++;
      return d !== null && d >= cutoff;
    });
    if (!parsed) return rows.slice(-Math.min(hours * rowsPerHour, rows.length));
    return filtered;
  }

  function getERBHistory(hours) {
    return lastHours(cache.erb.rows, hours || 24, 60);
  }

  function getERBHistoryRange(fromDate, toDate) {
    var r = cache.erb.rows;
    if (!r.length) return [];
    return r.filter(function (row) {
      if (!row.ts) return false;
      var d = parseDate(row.ts);
      return d !== null && d >= fromDate && d <= toDate;
    });
  }

  /* Filas horarias del resumen dentro del rango (para 7D, 30D y rangos largos) */
  function getERBResumenHora(fromDate, toDate) {
    return cache.resumen.hora.filter(function (row) {
      var d = parseDate(row.ts);
      return d !== null && d >= fromDate && d <= toDate;
    });
  }

  /* Día operativo en curso: horas desde el último cierre de las 05:00 */
  function getERBDiaEnCurso() {
    var h = cache.resumen.hora;
    if (!h.length) return null;
    var dia = h[h.length - 1].dia;
    var horas = h.filter(function (r) {
      return r.dia === dia;
    });
    var ultimoCierre = cache.resumen.cierre.length
      ? cache.resumen.cierre[cache.resumen.cierre.length - 1]
      : null;
    var fin = horas[horas.length - 1];
    return {
      fecha: dia,
      horas: horas.length,
      hasta: fin.ts,
      totalExistencia: fin.totalExistencia,
      totalCambio:
        ultimoCierre && ultimoCierre.totalExistencia != null && fin.totalExistencia != null
          ? fin.totalExistencia - ultimoCierre.totalExistencia
          : null,
      recibido: horas.reduce(function (a, r) {
        return a + r.sube;
      }, 0),
      enviado: horas.reduce(function (a, r) {
        return a + r.baja;
      }, 0),
    };
  }

  function getERBCierres() {
    return cache.resumen.cierre;
  }

  function getEstaciones() {
    var l = getLatestERB();
    if (!l) return [];
    var anyAlarm = l.alm601H || l.alm602H || l.alm741H;
    var geo = GEO_ERB["ERB E41"];
    return [
      {
        id: "erb-e41",
        nombre: "ERB E41",
        ubicacion: "Sector Ébano",
        tanques: 3,
        ts: l.ts,
        estado: isStale(l.ts) ? "offline" : anyAlarm ? "warning" : "online",
        lat: geo.lat,
        lng: geo.lng,
      },
    ];
  }

  function getERBDetalle() {
    var l = getLatestERB();
    if (!l) return null;
    return {
      nombre: "ERB E41",
      sector: "Sector Ébano",
      estado: isStale(l.ts)
        ? "offline"
        : l.alm601H || l.alm602H || l.alm741H
          ? "warning"
          : "online",
      ts: l.ts,
      tanks: [
        {
          id: "TV601",
          nombre: "TV-601",
          pct: l.pct601,
          nivel: l.niv601,
          altMax: l.h601,
          alarmH: l.alm601H,
          alarmL: l.alm601L,
          color: "#4d9ffc",
        },
        {
          id: "TV602",
          nombre: "TV-602",
          pct: l.pct602,
          nivel: l.niv602,
          altMax: l.h602,
          alarmH: l.alm602H,
          alarmL: l.alm602L,
          color: "#4d9ffc",
        },
        {
          id: "TV741",
          nombre: "TV-741",
          pct: l.pct741,
          nivel: l.niv741,
          altMax: l.h741,
          alarmH: l.alm741H,
          alarmL: l.alm741L,
          color: "#4d9ffc",
        },
      ],
      umbH: l.umbH,
      umbL: l.umbL,
      presL1: l.presL1,
      presL2: l.presL2,
    };
  }

  function getPozos() {
    var rows = cache.pozos.rows;
    if (!rows.length) return [];
    var map = {};
    // Pozos sin lecturas en la ventana descargada: se conocen por el resumen diario
    cache.pozosResumen.dias.forEach(function (d) {
      if (d.pozo && d.ultima) map[d.pozo] = { pozo: d.pozo, ts: d.ultima, texto: "" };
    });
    for (var i = 0; i < rows.length; i++) map[rows[i].pozo] = rows[i];
    return Object.keys(map).map(function (nombre) {
      var r = map[nombre];
      var coords = getCoords(nombre);
      var geo = GEO_POZOS[nombre] || { sector: "Ébano", campo: "Campo Ébano" };
      return {
        id: nombre.replace(/\s+/g, "-").toLowerCase(),
        nombre: nombre,
        sector: geo.sector || "Ébano",
        campo: geo.campo || "Campo Ébano",
        estado:
          r.texto === "" || isStale(r.ts)
            ? "offline"
            : r.texto === "Normal"
              ? "online"
              : "warning",
        ts: r.ts,
        lat: coords.lat,
        lng: coords.lng,
        latest: getPozoLatest(nombre),
      };
    });
  }

  /* Latest status row for a well. Alarm rows carry no readings, so the numeric
     fields are filled from the most recent row that has them; `valsTs` tells
     which timestamp those readings belong to. */
  var READING_KEYS = ["par", "rpm", "I", "V", "vll", "freq", "temp", "gRPM", "ptp"];
  function getPozoLatest(nombre) {
    var rows = cache.pozos.rows;
    var latest = null;
    for (var i = rows.length - 1; i >= 0; i--) {
      if (rows[i].pozo !== nombre) continue;
      if (!latest) latest = Object.assign({ valsTs: null }, rows[i]);
      if (rows[i].ptp !== null || rows[i].freq !== null) {
        READING_KEYS.forEach(function (k) {
          if (latest[k] === null) latest[k] = rows[i][k];
        });
        latest.valsTs = rows[i].ts;
        break;
      }
    }
    return latest;
  }

  function getPozoHistory(nombre, hours) {
    var rows = cache.pozos.rows.filter(function (r) {
      return r.pozo === nombre;
    });
    return lastHours(rows, hours || 24, 30);
  }

  function getPozoHistoryRange(nombre, fromDate, toDate) {
    var rows = cache.pozos.rows.filter(function (r) {
      return r.pozo === nombre;
    });
    if (!rows.length) return [];
    return rows.filter(function (row) {
      if (!row.ts) return false;
      var d = parseDate(row.ts);
      return d !== null && d >= fromDate && d <= toDate;
    });
  }

  function getCoords(nombre) {
    var key = nombre.replace("EBANO ", "").trim();
    var found = null;
    for (var i = 0; i < cache.coordenadas.rows.length; i++) {
      var r = cache.coordenadas.rows[i];
      if (r.pozo === key || r.pozo === nombre) {
        found = r;
        break;
      }
    }
    if (found) return { lat: found.lat, lng: found.lng };
    return GEO_POZOS[nombre] || { lat: 22.23, lng: -98.27 };
  }

  function invalidate() {
    cache.erb.ts = 0;
    cache.pozos.ts = 0;
    cache.coordenadas.ts = 0;
  }

  /* Force a full refresh: clears memory cache AND localStorage so
     the very next loadERB() / loadPozos() hits Google Sheets directly */
  function forceRefresh() {
    cache.erb = { rows: [], ts: 0 };
    cache.pozos = { rows: [], ts: 0 };
    cache.coordenadas = { rows: [], ts: 0 };
    cache.resumen = { hora: [], cierre: [], ts: 0 };
    cache.pozosResumen = { dias: [], eventos: [], hoy: [], ts: 0 };
    try { localStorage.removeItem("tn_erb"); } catch(e){}
    try { localStorage.removeItem("tn_pz"); } catch(e){}
    try { localStorage.removeItem("tn_coords"); } catch(e){}
    console.log("[DB] Cache cleared — next load will fetch from Google Sheets");
  }

  /* Pre-load other caches from localStorage but ALWAYS reset ts=0
     so the first call always fetches fresh data from Google Sheets */
  var sERB = safeGet("tn_erb");
  if (sERB) { Object.assign(cache.erb, sERB); cache.erb.ts = 0; }
  var sPZ = safeGet("tn_pz");
  if (sPZ) { Object.assign(cache.pozos, sPZ); cache.pozos.ts = 0; }
  var sCO = safeGet("tn_coords");
  if (sCO) Object.assign(cache.coordenadas, sCO);

  return {
    loadERB,
    loadPozos,
    loadCoords,
    getEstaciones,
    getERBDetalle,
    getERBHistory,
    getERBHistoryRange,
    loadResumen,
    loadPozosResumen,
    loadPozosCompleto,
    getPozoDias,
    getPozoEventos,
    getPozoHoy,
    getERBResumenHora,
    getERBDiaEnCurso,
    getERBCierres,
    getLatestERB,
    getERBUltimas,
    getPozos,
    getPozoLatest,
    getPozoHistory,
    getPozoHistoryRange,
    getCoords,
    invalidate,
    parseDate,
    isStale,
    forceRefresh,
    GEO_ERB,
    GEO_POZOS,
  };
})();
