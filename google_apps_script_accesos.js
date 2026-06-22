/**
 * SISTEMA INTEGRAL EBANO & HISTORIAL DE ACCESOS - V5.0
 * - Mantiene la estructura de 13 columnas para aplicaciones de telemetría en "DATOS".
 * - Registro de eventos de pozos y uso de GmailApp.
 * - Registra y expone el Historial de Accesos multidispositivo en la pestaña "HistorialAccesos".
 */

var destinatariosGlobal =
  "alfredo.netro@deppg.com, alba.garcia@deppg.com, gilberto.martell@deppg.com";

// --- CONFIGURACIÓN DE FILTRO ---
var POZOS_IGNORADOS = [];

var MAPA_FALLAS_GEN = {
  8: "PARO EMERGENCIA (EM STOP)",
  9: "SOBRE VELOCIDAD (OVER SPEED)",
  10: "BAJA VELOCIDAD (UNDER SPEED)",
  11: "PÉRDIDA DE SEÑAL VELOCIDAD",
  12: "SOBRE FRECUENCIA (SHUTDOWN)",
  13: "BAJA FRECUENCIA (SHUTDOWN)",
  14: "SOBRE VOLTAJE GEN (SHUTDOWN)",
  15: "BAJO VOLTAJE GEN (SHUTDOWN)",
  16: "SOBRE CORRIENTE (SHUTDOWN)",
  17: "FALLA EN ARRANQUE (FAILED TO START)",
  18: "ALTA TEMP MOTOR (SHUTDOWN)",
  19: "BAJA PRESIÓN ACEITE (SHUTDOWN)",
  20: "PÉRDIDA DE FRECUENCIA",
  21: "ENTRADA DE PARO EXTERNA (INPUT)",
  24: "ALTA TEMP MOTOR (ADVERTENCIA)",
  25: "BAJA PRESIÓN ACEITE (ADVERTENCIA)",
  26: "SOBRE CORRIENTE (ADVERTENCIA)",
  27: "FALLA EN PARO (FAILED TO STOP)",
  28: "BAJO NIVEL COMBUSTIBLE (ALERTA)",
  29: "FALLA DE CARGA (CHARGE FAIL)",
  30: "BAJO VOLTAJE BATERÍA",
  31: "SOBRE VOLTAJE BATERÍA",
  99: "RPM BAJAS (SISTEMA DETENIDO)",
};

const SHEET_NAME_LOG = "HistorialAccesos";

// --- HELPERS PARA HISTORIAL DE ACCESOS ---
function getOrCreateAccessSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_LOG);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_LOG);
    sheet.appendRow([
      "timestamp",
      "fecha",
      "usuario",
      "correo",
      "rol",
      "dispositivo",
      "os",
      "ip",
      "ubicacion",
    ]);
    sheet.setFrozenRows(1);
    // Formato de cabecera
    sheet
      .getRange(1, 1, 1, 9)
      .setFontWeight("bold")
      .setBackground("#1a1a2e")
      .setFontColor("#ffffff");
  }
  return sheet;
}

function registrarAcceso(data) {
  var sheet = getOrCreateAccessSheet();
  var ts = data.ts || Date.now();
  var fecha = Utilities.formatDate(
    new Date(ts),
    "GMT-6",
    "yyyy-MM-dd HH:mm:ss",
  );

  sheet.appendRow([
    ts,
    fecha,
    data.usuario || "",
    data.correo || "",
    data.rol || "",
    data.dispositivo || "",
    data.os || "",
    data.ip || "",
    data.ubicacion || "",
  ]);
}

// --- GET: Para consultar el historial de accesos ---
function doGet(e) {
  try {
    var sheet = getOrCreateAccessSheet();
    var rows = sheet.getDataRange().getValues();

    // Omitir cabecera
    var logs = rows.slice(1).map(function (row) {
      return {
        ts: row[0],
        fecha: row[1],
        usuario: row[2],
        correo: row[3],
        rol: row[4],
        dispositivo: row[5],
        os: row[6],
        ip: row[7],
        ubicacion: row[8],
      };
    });

    // Ordenar de más nuevo a más viejo
    logs.sort(function (a, b) {
      return (b.ts || 0) - (a.ts || 0);
    });

    return ContentService.createTextOutput(JSON.stringify(logs)).setMimeType(
      ContentService.MimeType.JSON,
    );
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify([])).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}

// --- POST: Para registrar eventos (Telemetría de pozos u Historial de Accesos) ---
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Si la petición contiene correo o dispositivo, se trata de un registro de acceso
    if (data.correo !== undefined || data.dispositivo !== undefined) {
      registrarAcceso(data);
      return ContentService.createTextOutput(
        JSON.stringify({ ok: true }),
      ).setMimeType(ContentService.MimeType.JSON);
    }

    // De lo contrario, corre la telemetría original
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DATOS") || ss.getSheets()[0];

    var ahora = new Date();
    var timestampStr = Utilities.formatDate(
      ahora,
      "GMT-6",
      "yyyy-MM-dd HH:mm:ss",
    );

    var nombreEnviado = data.p ? data.p.toString().trim() : "DESCONOCIDO";

    // --- FILTRO DE SEGURIDAD ---
    if (POZOS_IGNORADOS.indexOf(nombreEnviado) !== -1) {
      return ContentService.createTextOutput("IGNORADO").setMimeType(
        ContentService.MimeType.TEXT,
      );
    }

    var cantPozos = data.cant || 1;
    var v1 = data.v1 || [0, 0, 0, 0, 0];
    var g = data.g || [0, 0, 0, 0, 0];
    var pr = data.pr || [0, 0];

    function registrarEvento(nombreFinal, datosVar, presion) {
      var props = PropertiesService.getScriptProperties();
      var estadoPrevio = props.getProperty("status_" + nombreFinal) || "Normal";

      var falla = "";
      if (datosVar[1] <= 0.5) {
        falla = "PARO VARIADOR (FREQ 0)";
      } else if (g[4] > 0) {
        falla = "FALLA GENERADOR COD:" + Math.floor(g[4]);
      }

      var esAlarmaActual = falla !== "";
      var tipoRegistro = esAlarmaActual ? "ALARMA" : "DATO";

      if (!esAlarmaActual && estadoPrevio === "Alarma") {
        tipoRegistro = "RESTABLECIDO";
      }

      console.log(
        "Pozo: " +
          nombreFinal +
          " | Estado Anterior: " +
          estadoPrevio +
          " | Alarma Actual: " +
          esAlarmaActual,
      );

      if (esAlarmaActual && estadoPrevio !== "Alarma") {
        console.log(">>> DISPARANDO CORREO DE ALARMA...");
        enviarEmail(nombreFinal, falla, true, datosVar, presion);
        props.setProperty("status_" + nombreFinal, "Alarma");
      } else if (!esAlarmaActual && estadoPrevio === "Alarma") {
        console.log(">>> DISPARANDO CORREO DE RESTABLECIMIENTO...");
        enviarEmail(
          nombreFinal,
          "SISTEMA RESTABLECIDO",
          false,
          datosVar,
          presion,
        );
        props.setProperty("status_" + nombreFinal, "Normal");
      }

      var fila = [
        timestampStr,
        nombreFinal,
        tipoRegistro,
        esAlarmaActual ? "" : datosVar[3],
        esAlarmaActual ? "" : datosVar[2],
        esAlarmaActual ? "" : datosVar[0],
        esAlarmaActual ? "" : datosVar[4],
        esAlarmaActual ? "" : g[0],
        esAlarmaActual ? "" : g[2],
        esAlarmaActual ? "" : g[1],
        esAlarmaActual ? "" : g[3],
        esAlarmaActual ? "" : presion,
        esAlarmaActual ? falla : "Normal",
      ];

      sheet.appendRow(fila);
      if (!esAlarmaActual)
        sheet.getRange(sheet.getLastRow(), 4, 1, 9).setNumberFormat("0.0");
    }

    if (cantPozos == 1) {
      registrarEvento(nombreEnviado, v1, pr[0]);
    } else {
      registrarEvento(nombreEnviado + "H", v1, pr[0]);
      registrarEvento(nombreEnviado + "D", data.v2 || [0, 0, 0, 0, 0], pr[1]);
    }

    return ContentService.createTextOutput("OK").setMimeType(
      ContentService.MimeType.TEXT,
    );
  } catch (err) {
    console.log("Error critico en doPost: " + err.toString());
    return ContentService.createTextOutput(
      "Error: " + err.toString(),
    ).setMimeType(ContentService.MimeType.TEXT);
  }
}

function enviarEmail(pozo, evento, esAlarma, v, p) {
  var emoji = esAlarma ? "⚠️" : "✅";
  var asunto = emoji + " " + pozo + ": " + evento;
  var cuerpo =
    "TELEMETRÍA ÉBANO - REPORTE\n" +
    "-------------------------------------\n" +
    "Pozo: " +
    pozo +
    "\n" +
    "Evento: " +
    evento +
    "\n" +
    "Presión: " +
    p +
    " psi\n" +
    "Frecuencia: " +
    v[1] +
    " Hz\n" +
    "Fecha: " +
    new Date().toLocaleString();

  try {
    GmailApp.sendEmail(destinatariosGlobal, asunto, cuerpo);
    console.log("Correo enviado a la lista de destinatarios.");
  } catch (e) {
    console.log("Fallo el envío de GmailApp: " + e.toString());
  }
}

function resetearEstados() {
  PropertiesService.getScriptProperties().deleteAllProperties();
  console.log(
    "Memoria de estados limpiada. El siguiente reporte enviará correo sí o sí.",
  );
}

function ejecutarPruebaManual() {
  console.log("Iniciando prueba manual V5.0...");
  enviarEmail("TEST-2287", "PRUEBA DE CONEXIÓN", true, [0, 60, 0, 0, 0], 20.0);
}
