/* ═══════════════════════════════════════════════
   TELNET – API & SESSION  (api.js)
   All authentication and user administration go through the Apps Script
   backend, which verifies the signed token and the role on every call.
   ═══════════════════════════════════════════════ */

const API = (function () {
  var SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzvORT5f8pyrca71o73mCE8xakID5ZaIyVcI5ioYRX1rRc4sXN2wQj_wD_3MYbdp2oC/exec";

  var SESSION_KEY = "tn_session";

  /* Legacy keys that stored the user list (with passwords) or a forgeable session */
  ["tn_usuarios", "tn_logged_user", "tn_access_script_url"].forEach(function (k) {
    try {
      localStorage.removeItem(k);
    } catch (e) {}
  });

  function readSession() {
    try {
      var raw =
        sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
      var s = raw ? JSON.parse(raw) : null;
      if (!s || !s.token || !s.user) return null;
      if (tokenExp(s.token) < Date.now()) {
        clearSession();
        return null;
      }
      return s;
    } catch (e) {
      return null;
    }
  }

  function saveSession(token, user, remember) {
    var s = JSON.stringify({ token: token, user: user });
    clearSession();
    try {
      (remember ? localStorage : sessionStorage).setItem(SESSION_KEY, s);
    } catch (e) {}
  }

  /* Keep the token where it already lives (remember-me choice) */
  function updateSession(token, user) {
    var remember = false;
    try {
      remember = !!localStorage.getItem(SESSION_KEY);
    } catch (e) {}
    saveSession(token, user, remember);
  }

  function clearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  /* Reads the expiry from the token payload. Only used to skip obviously expired
     sessions; the server is the one that validates the signature. */
  function tokenExp(token) {
    try {
      var b64 = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
      return JSON.parse(atob(b64)).exp || 0;
    } catch (e) {
      return 0;
    }
  }

  async function call(action, payload) {
    var body = Object.assign({}, payload || {}, { action: action });
    if (action !== "login") {
      var s = readSession();
      body.token = s ? s.token : "";
    }
    var res = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    var data = await res.json();
    if (!data.ok) {
      var e = new Error(data.error || "Error del servidor");
      e.auth = data.auth === false;
      throw e;
    }
    return data;
  }

  async function login(correo, password, remember) {
    var data = await call("login", { correo: correo, password: password });
    saveSession(data.token, data.user, remember);
    return data.user;
  }

  async function changePassword(actual, nueva) {
    var data = await call("changePassword", { actual: actual, nueva: nueva });
    updateSession(data.token, data.user);
    return data.user;
  }

  return {
    call: call,
    login: login,
    changePassword: changePassword,
    readSession: readSession,
    updateSession: updateSession,
    clearSession: clearSession,
  };
})();
