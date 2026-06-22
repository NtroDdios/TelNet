/**
 * TelNet – Apps Script API: Historial de Accesos
 * Pegar este código en Google Apps Script del spreadsheet
 * https://docs.google.com/spreadsheets/d/1dvq2uDcnzf2g6yPECKMgb-Ij-bw4OV_mAfLBCHkJeJg/edit
 *
 * Desplegar como: Web App → "Cualquier usuario" → Ejecutar como "Yo"
 */

const SHEET_NAME_LOG = "HistorialAccesos";

function getOrCreateSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME_LOG);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME_LOG);
    sheet.appendRow(["timestamp", "fecha", "usuario", "correo", "rol", "dispositivo", "os", "ip", "ubicacion"]);
    sheet.setFrozenRows(1);
    // Format header row
    sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#1a1a2e").setFontColor("#ffffff");
  }
  return sheet;
}

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getOrCreateSheet();

    var ts = data.ts || Date.now();
    var fecha = new Date(ts).toLocaleString("es-MX", {
      timeZone: "America/Mexico_City",
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });

    sheet.appendRow([
      ts,
      fecha,
      data.usuario || "",
      data.correo || "",
      data.rol || "",
      data.dispositivo || "",
      data.os || "",
      data.ip || "",
      data.ubicacion || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = getOrCreateSheet();
    var rows = sheet.getDataRange().getValues();

    // Skip header row
    var logs = rows.slice(1).map(function(row) {
      return {
        ts:          row[0],
        fecha:       row[1],
        usuario:     row[2],
        correo:      row[3],
        rol:         row[4],
        dispositivo: row[5],
        os:          row[6],
        ip:          row[7],
        ubicacion:   row[8]
      };
    });

    // Sort newest first
    logs.sort(function(a, b) { return (b.ts || 0) - (a.ts || 0); });

    return ContentService
      .createTextOutput(JSON.stringify(logs))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
