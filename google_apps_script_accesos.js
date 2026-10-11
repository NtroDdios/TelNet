/**
 * SISTEMA INTEGRAL EBANO & HISTORIAL DE ACCESOS - V6.0 (seguro)
 * - Mantiene la estructura de 13 columnas para aplicaciones de telemetría en "DATOS".
 * - Registro de eventos de pozos y uso de GmailApp.
 * - Autenticación del lado del servidor: contraseñas con hash + sal, tokens firmados (HMAC),
 *   control de roles en cada acción y bloqueo por intentos fallidos.
 *
 * DESPLIEGUE (una sola vez):
 *  1. Pegue este archivo en el editor de Apps Script y guarde.
 *  2. Ejecute manualmente `migrarPasswords` para convertir las contraseñas en texto plano a hash.
 *  3. Implementar > Administrar implementaciones > Editar > Nueva versión (conserva la misma URL).
 *  4. En la hoja de cálculo: Archivo > Compartir > Publicar en la web → deje de publicar la
 *     pestaña "Usuarios" (y "HistorialAccesos" si estuviera publicada).
 *  5. Opcional: defina la propiedad de script DEVICE_KEY y configure los equipos de campo para
 *     enviar {"k": "<DEVICE_KEY>"} en su JSON. Mientras no exista, la telemetría se acepta sin clave.
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

// --- SEGURIDAD ---
var ROLES_VALIDOS = ["administrador", "supervisor", "operador", "visitante"];
var TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12 h
var HASH_ITER = 1000;
var MAX_FALLOS = 5; // intentos antes de bloquear
var BLOQUEO_SEG = 15 * 60; // 15 min
var PWD_MIN = 8;

// --- HELPERS PARA HISTORIAL DE ACCESOS Y USUARIOS ---
function getActiveSpreadsheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    try {
      ss = SpreadsheetApp.openById("1dvq2uDcnzf2g6yPECKMgb-Ij-bw4OV_mAfLBCHkJeJg");
    } catch(e) {
      try {
        ss = SpreadsheetApp.openById("1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1");
      } catch(ex) {}
    }
  }
  return ss;
}

function getOrCreateUsersSheet() {
  var ss = getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Usuarios") || ss.getSheetByName("USUARIOS");
  if (!sheet) {
    var sheets = ss.getSheets();
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getSheetId().toString() === "230819089") {
        return sheets[i];
      }
    }
    for (var i = 0; i < sheets.length; i++) {
      var firstRow = sheets[i].getRange(1, 1, 1, 4).getValues()[0];
      if (firstRow && firstRow.some(function(cell) { return cell && cell.toString().toLowerCase().indexOf("correo") !== -1; })) {
        return sheets[i];
      }
    }
    sheet = ss.insertSheet("Usuarios");
    sheet.appendRow(["nombre", "correo", "rol", "password"]);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#1a1a2e").setFontColor("#ffffff");
  }
  return sheet;
}

function getOrCreateAccessSheet() {
  var ss = getActiveSpreadsheet();
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
    sheet
      .getRange(1, 1, 1, 9)
      .setFontWeight("bold")
      .setBackground("#1a1a2e")
      .setFontColor("#ffffff");
  }
  return sheet;
}

/* Texto seguro para una celda: recorta, limita longitud y neutraliza fórmulas (=, +, -, @). */
function celda(v, max) {
  var s = v == null ? "" : String(v).trim();
  s = s.slice(0, max || 120);
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function err(msg) {
  return json({ ok: false, error: msg });
}

function normCorreo(c) {
  return String(c || "").trim().toLowerCase();
}

function correoValido(c) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) && c.length <= 120;
}

/* ── Hash de contraseñas ── */
function toHex(bytes) {
  var out = "";
  for (var i = 0; i < bytes.length; i++) {
    var b = (bytes[i] + 256) % 256;
    out += (b < 16 ? "0" : "") + b.toString(16);
  }
  return out;
}

function hashPassword(pwd, salt) {
  var h = salt + "|" + pwd;
  for (var i = 0; i < HASH_ITER; i++) {
    h = toHex(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, h + salt));
  }
  return h;
}

function makeStoredPassword(pwd) {
  var salt = Utilities.getUuid().replace(/-/g, "");
  return "s1$" + salt + "$" + hashPassword(pwd, salt);
}

/* Compara en tiempo constante para no filtrar información por tiempos de respuesta. */
function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  var r = 0;
  for (var i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function checkPassword(pwd, stored) {
  stored = String(stored || "");
  if (stored.indexOf("s1$") === 0) {
    var parts = stored.split("$");
    return safeEqual(hashPassword(pwd, parts[1]), parts[2] || "");
  }
  // Contraseña heredada en texto plano (se migra al iniciar sesión correctamente)
  return stored !== "" && safeEqual(pwd, stored);
}

/* ── Tokens firmados ── */
function getSecret() {
  var props = PropertiesService.getScriptProperties();
  var s = props.getProperty("TOKEN_SECRET");
  if (!s) {
    s = Utilities.getUuid() + Utilities.getUuid();
    props.setProperty("TOKEN_SECRET", s);
  }
  return s;
}

function sign(data) {
  return Utilities.base64EncodeWebSafe(
    Utilities.computeHmacSha256Signature(data, getSecret()),
  );
}

/* pv = huella de la contraseña: si cambia la contraseña, los tokens anteriores dejan de valer. */
function issueToken(user, stored) {
  var payload = Utilities.base64EncodeWebSafe(
    JSON.stringify({
      c: user.correo,
      pv: String(stored).slice(-12),
      exp: Date.now() + TOKEN_TTL_MS,
    }),
  );
  return payload + "." + sign(payload);
}

/* Lee todos los usuarios de la hoja. */
function readUsers() {
  var sheet = getOrCreateUsersSheet();
  var rows = sheet.getDataRange().getValues();
  var out = [];
  for (var i = 1; i < rows.length; i++) {
    var correo = normCorreo(rows[i][1]);
    if (!correo) continue;
    out.push({
      row: i + 1,
      nombre: String(rows[i][0] || "").trim(),
      correo: correo,
      rol: String(rows[i][2] || "visitante").trim().toLowerCase(),
      stored: String(rows[i][3] || ""),
    });
  }
  return { sheet: sheet, users: out };
}

function findUser(correo) {
  var data = readUsers();
  for (var i = 0; i < data.users.length; i++) {
    if (data.users[i].correo === correo) {
      data.users[i].sheet = data.sheet;
      return data.users[i];
    }
  }
  return null;
}

function publicUser(u) {
  return { nombre: u.nombre, correo: u.correo, rol: u.rol };
}

/* Valida el token y devuelve el usuario ACTUAL de la hoja (rol vigente), o null. */
function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  var parts = token.split(".");
  if (parts.length !== 2) return null;
  if (!safeEqual(sign(parts[0]), parts[1])) return null;
  var payload;
  try {
    payload = JSON.parse(
      Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0])).getDataAsString(),
    );
  } catch (e) {
    return null;
  }
  if (!payload || !payload.exp || payload.exp < Date.now()) return null;
  var u = findUser(normCorreo(payload.c));
  if (!u || String(u.stored).slice(-12) !== payload.pv) return null;
  return u;
}

function withLock(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    return fn();
  } finally {
    lock.releaseLock();
  }
}

/* ── Acciones de autenticación ── */
function actionLogin(data) {
  var correo = normCorreo(data.correo);
  var pwd = String(data.password || "");
  if (!correo || !pwd) return err("Datos incompletos");

  var cache = CacheService.getScriptCache();
  var failKey = "fail_" + correo;
  var fails = parseInt(cache.get(failKey) || "0", 10);
  if (fails >= MAX_FALLOS) {
    return err("Demasiados intentos. Intente de nuevo en 15 minutos.");
  }

  var u = findUser(correo);
  if (!u || !checkPassword(pwd, u.stored)) {
    cache.put(failKey, String(fails + 1), BLOQUEO_SEG);
    return err("Correo o contraseña incorrectos");
  }
  cache.remove(failKey);

  // Migración transparente de contraseñas en texto plano
  if (String(u.stored).indexOf("s1$") !== 0) {
    u.stored = makeStoredPassword(pwd);
    u.sheet.getRange(u.row, 4).setValue(u.stored);
  }

  return json({ ok: true, token: issueToken(u, u.stored), user: publicUser(u) });
}

function actionChangePassword(me, data) {
  var actual = String(data.actual || "");
  var nueva = String(data.nueva || "");
  if (!checkPassword(actual, me.stored)) return err("La contraseña actual no es correcta");
  if (nueva.length < PWD_MIN) return err("La nueva contraseña debe tener al menos " + PWD_MIN + " caracteres");
  var stored = makeStoredPassword(nueva);
  withLock(function () {
    me.sheet.getRange(me.row, 4).setValue(stored);
  });
  return json({ ok: true, token: issueToken(me, stored), user: publicUser(me) });
}

/* ── Acciones de administración de usuarios (solo administrador) ── */
function validarNuevoUsuario(u) {
  var nombre = celda(u.nombre, 80);
  var correo = normCorreo(u.correo);
  var rol = String(u.rol || "supervisor").trim().toLowerCase();
  var pwd = String(u.password || "");
  if (!nombre) return { error: "Nombre requerido" };
  if (!correoValido(correo)) return { error: "Correo inválido" };
  if (ROLES_VALIDOS.indexOf(rol) === -1) return { error: "Rol inválido" };
  if (pwd.length < PWD_MIN) return { error: "La contraseña debe tener al menos " + PWD_MIN + " caracteres" };
  return { nombre: nombre, correo: correo, rol: rol, pwd: pwd };
}

function actionAddUsuarios(lista) {
  return withLock(function () {
    var data = readUsers();
    var existentes = {};
    data.users.forEach(function (u) { existentes[u.correo] = true; });
    var added = [];
    var errors = [];
    lista.slice(0, 200).forEach(function (raw, idx) {
      var v = validarNuevoUsuario(raw || {});
      var etiqueta = (raw && raw.nombre ? String(raw.nombre).slice(0, 80) : "#" + (idx + 1));
      if (v.error) return errors.push(etiqueta + ": " + v.error);
      if (existentes[v.correo]) return errors.push(etiqueta + ": el correo ya existe");
      data.sheet.appendRow([v.nombre, v.correo, v.rol, makeStoredPassword(v.pwd)]);
      existentes[v.correo] = true;
      added.push({ nombre: v.nombre, correo: v.correo, rol: v.rol });
    });
    return json({ ok: true, added: added, errors: errors });
  });
}

function actionDeleteUsuario(me, data) {
  var correo = normCorreo(data.correo);
  if (correo === me.correo) return err("No puede eliminar su propio usuario");
  return withLock(function () {
    var u = findUser(correo);
    if (!u) return err("Usuario no encontrado");
    u.sheet.deleteRow(u.row);
    return json({ ok: true });
  });
}

function actionUpdateRole(me, data) {
  var correo = normCorreo(data.correo);
  var rol = String(data.rol || "").trim().toLowerCase();
  if (ROLES_VALIDOS.indexOf(rol) === -1) return err("Rol inválido");
  if (correo === me.correo && rol !== "administrador") {
    return err("No puede quitarse a sí mismo el rol de administrador");
  }
  return withLock(function () {
    var u = findUser(correo);
    if (!u) return err("Usuario no encontrado");
    u.sheet.getRange(u.row, 3).setValue(rol);
    return json({ ok: true });
  });
}

function actionResetPassword(data) {
  var correo = normCorreo(data.correo);
  var pwd = String(data.password || "");
  if (pwd.length < PWD_MIN) return err("La contraseña debe tener al menos " + PWD_MIN + " caracteres");
  return withLock(function () {
    var u = findUser(correo);
    if (!u) return err("Usuario no encontrado");
    u.sheet.getRange(u.row, 4).setValue(makeStoredPassword(pwd));
    return json({ ok: true });
  });
}

/* ── Historial de accesos ── */
function registrarAcceso(me, data) {
  var sheet = getOrCreateAccessSheet();
  var ts = Date.now();
  var fecha = Utilities.formatDate(
    new Date(ts),
    "GMT-6",
    "yyyy-MM-dd HH:mm:ss",
  );

  // Identidad tomada del token, no del cuerpo de la petición
  sheet.appendRow([
    ts,
    fecha,
    celda(me.nombre, 80),
    celda(me.correo, 120),
    celda(me.rol, 20),
    celda(data.dispositivo, 60),
    celda(data.os, 40),
    celda(data.ip, 45),
    celda(data.ubicacion, 120),
  ]);
}

function leerAccesos() {
  var sheet = getOrCreateAccessSheet();
  var rows = sheet.getDataRange().getValues();
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
  logs.sort(function (a, b) {
    return (b.ts || 0) - (a.ts || 0);
  });
  return logs.slice(0, 500);
}

/* ── Enrutador de acciones de la aplicación web ── */
function handleAction(data) {
  if (data.action === "login") return actionLogin(data);

  var me = verifyToken(data.token);
  if (!me) return json({ ok: false, error: "Sesión inválida o expirada", auth: false });

  switch (data.action) {
    case "me":
      return json({ ok: true, user: publicUser(me) });
    case "changePassword":
      return actionChangePassword(me, data);
    case "logAcceso":
      registrarAcceso(me, data);
      return json({ ok: true });
  }

  if (me.rol !== "administrador") return err("Permiso denegado");

  switch (data.action) {
    case "listUsuarios":
      return json({ ok: true, usuarios: readUsers().users.map(publicUser) });
    case "addUsuario":
      return actionAddUsuarios([data]);
    case "addUsuariosBulk":
      return actionAddUsuarios(Array.isArray(data.usuarios) ? data.usuarios : []);
    case "deleteUsuario":
      return actionDeleteUsuario(me, data);
    case "updateUsuarioRole":
      return actionUpdateRole(me, data);
    case "resetPassword":
      return actionResetPassword(data);
    case "getAccesos":
      return json({ ok: true, accesos: leerAccesos() });
  }
  return err("Acción desconocida");
}

// --- GET: ya no expone datos; solo indica que el servicio está activo ---
function doGet(e) {
  return json({ ok: true, service: "TelNet" });
}

// --- POST: Acciones de la app (con token) y telemetría de equipos de campo ---
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    if (data.action) {
      return handleAction(data);
    }

    // --- TELEMETRÍA DE EQUIPOS ---
    var deviceKey = PropertiesService.getScriptProperties().getProperty("DEVICE_KEY");
    if (deviceKey && !safeEqual(String(data.k || ""), deviceKey)) {
      return ContentService.createTextOutput("DENEGADO").setMimeType(
        ContentService.MimeType.TEXT,
      );
    }

    var ss = getActiveSpreadsheet();
    var sheet = ss.getSheetByName("DATOS") || ss.getSheets()[0];

    var ahora = new Date();
    var timestampStr = Utilities.formatDate(
      ahora,
      "GMT-6",
      "yyyy-MM-dd HH:mm:ss",
    );

    var nombreEnviado = data.p ? celda(data.p, 40) : "DESCONOCIDO";

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
    return ContentService.createTextOutput("Error").setMimeType(
      ContentService.MimeType.TEXT,
    );
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

/* Limpia solo los estados de alarma de pozos; conserva TOKEN_SECRET y DEVICE_KEY. */
function resetearEstados() {
  var props = PropertiesService.getScriptProperties();
  Object.keys(props.getProperties()).forEach(function (k) {
    if (k.indexOf("status_") === 0) props.deleteProperty(k);
  });
  console.log(
    "Memoria de estados limpiada. El siguiente reporte enviará correo sí o sí.",
  );
}

/* Ejecutar UNA VEZ desde el editor: convierte contraseñas en texto plano a hash con sal. */
function migrarPasswords() {
  withLock(function () {
    var data = readUsers();
    var n = 0;
    data.users.forEach(function (u) {
      if (u.stored && u.stored.indexOf("s1$") !== 0) {
        data.sheet.getRange(u.row, 4).setValue(makeStoredPassword(u.stored));
        n++;
      }
    });
    console.log("Contraseñas migradas: " + n);
  });
}

/* Invalida TODAS las sesiones activas (útil si se sospecha un robo de token). */
function cerrarTodasLasSesiones() {
  PropertiesService.getScriptProperties().deleteProperty("TOKEN_SECRET");
  console.log("Secreto rotado: todos los usuarios deberán iniciar sesión de nuevo.");
}

function ejecutarPruebaManual() {
  console.log("Iniciando prueba manual V6.0...");
  enviarEmail("TEST-2287", "PRUEBA DE CONEXIÓN", true, [0, 60, 0, 0, 0], 20.0);
}
