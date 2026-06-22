/* ═══════════════════════════════════════════════
   TELNET – DATA SERVICE  (data.js)
   ═══════════════════════════════════════════════ */

const DB = (function () {
  /* ── Spreadsheet CSV URLs ── */
  var ESTACIONES_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRquP2hMacKcZRBshBCQh1w3Ad5cIJaY4mV03zKHPaPVp2Bmb1tvPh-HihmZbVeiH63E4CZLjWLPOXu/pub?output=csv";
  var POZOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv";
  var COORDENADAS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv&gid=48860810";
  var USUARIOS_CSV =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vT_8dadg9C3qMvGt9nHj29zA4gpewQt_5J1DToV9jtunqdS-qDY9WaBZ89YBhhGvZIx9AQSAdQBDov1/pub?output=csv&gid=230819089";

  var MAX_ROWS = 250000;
  var TTL = 30000; // 30 seconds — keeps live data fresh

  /* ── State ── */
  var cache = {
    erb: { rows: [], ts: 0 },
    pozos: { rows: [], ts: 0 },
    coordenadas: { rows: [], ts: 0 },
    usuarios: { rows: [], ts: 0 },
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

  /* ── Always-available user list ── */
  var USUARIOS = [
    {
      nombre: "Mauro Alberto Cedillo Azua",
      correo: "mauro.cedillo@deppg.com",
      rol: "supervisor",
      password: "TN2026MC",
    },
    {
      nombre: "Oscar Del Angel Gomez",
      correo: "oscar.delangel@deppg.com",
      rol: "supervisor",
      password: "TN2026OA",
    },
    {
      nombre: "Gabriel Hernandez Godinez",
      correo: "gabriel.hernandez@deppg.com",
      rol: "supervisor",
      password: "TN2026GH",
    },
    {
      nombre: "Alfredo Jose Fajardo Brito",
      correo: "alfredo.fajardo@deppg.com",
      rol: "supervisor",
      password: "TN2026AF",
    },
    {
      nombre: "Edgar Flores",
      correo: "edgar.flores@deppg.com",
      rol: "supervisor",
      password: "TN2026EF",
    },
    {
      nombre: "Gabriel Guzman de la Torre",
      correo: "gabriel.guzman@deppg.com",
      rol: "supervisor",
      password: "TN2026GG",
    },
    {
      nombre: "Jose Carlos Tinajero Martinez",
      correo: "jose.tinajero@deppg.com",
      rol: "supervisor",
      password: "TN2026JT",
    },
    {
      nombre: "Jose Guadalupe Perez De La Paz",
      correo: "jose.perez@deppg.com",
      rol: "supervisor",
      password: "TN2026JP",
    },
    {
      nombre: "Jose Alfredo Netro Angeles",
      correo: "alfredo.netro@deppg.com",
      rol: "administrador",
      password: "TN2026NETRO",
    },
    {
      nombre: "Gilberto Martell Cantero",
      correo: "gilberto.martell@deppg.com",
      rol: "supervisor",
      password: "TN2026GM",
    },
    {
      nombre: "Gregorio Ilagor Martinez",
      correo: "gregorio.ilagor@deppg.com",
      rol: "supervisor",
      password: "TN2026GI",
    },
    {
      nombre: "Alba Fabiola Garcia Perez",
      correo: "alba.garcia@deppg.com",
      rol: "supervisor",
      password: "TN2026AG",
    },
  ];

  /* Load cached users if available, otherwise load default USUARIOS */
  var cachedUsers = safeGet("tn_usuarios");
  if (cachedUsers && cachedUsers.rows && cachedUsers.rows.length) {
    cache.usuarios = cachedUsers;
  } else {
    cache.usuarios.rows = USUARIOS;
    cache.usuarios.ts = Date.now();
  }

  function saveUsuarios() {
    try {
      localStorage.setItem("tn_usuarios", JSON.stringify(cache.usuarios));
    } catch (e) {
      console.error("[DB] Error saving users:", e);
    }
  }

  function addUsuario(u) {
    if (!u.nombre || !u.correo || !u.password || !u.rol) {
      throw new Error("Datos incompletos");
    }
    var email = u.correo.trim().toLowerCase();
    var exists = cache.usuarios.rows.some(function (x) {
      return x.correo.toLowerCase() === email;
    });
    if (exists) {
      throw new Error("El usuario ya existe con este correo");
    }
    var newUser = {
      nombre: u.nombre.trim(),
      correo: email,
      rol: u.rol.trim(),
      password: u.password.trim(),
      creado: new Date().toISOString()
    };
    cache.usuarios.rows.push(newUser);
    cache.usuarios.ts = Date.now();
    saveUsuarios();
    return newUser;
  }

  function deleteUsuario(email) {
    var emailLower = email.trim().toLowerCase();
    var initialLength = cache.usuarios.rows.length;
    cache.usuarios.rows = cache.usuarios.rows.filter(function (x) {
      return x.correo.toLowerCase() !== emailLower;
    });
    if (cache.usuarios.rows.length === initialLength) {
      throw new Error("Usuario no encontrado");
    }
    cache.usuarios.ts = Date.now();
    saveUsuarios();
  }

  function updateUsuarioRole(email, newRole) {
    var emailLower = email.trim().toLowerCase();
    var found = false;
    for (var i = 0; i < cache.usuarios.rows.length; i++) {
      if (cache.usuarios.rows[i].correo.toLowerCase() === emailLower) {
        cache.usuarios.rows[i].rol = newRole.trim();
        found = true;
        
        if (typeof CURRENT_USER !== "undefined" && CURRENT_USER && CURRENT_USER.correo.toLowerCase() === emailLower) {
          CURRENT_USER.rol = newRole.trim();
          try {
            localStorage.setItem("tn_logged_user", JSON.stringify(CURRENT_USER));
          } catch (e) {}
        }
        break;
      }
    }
    if (!found) {
      throw new Error("Usuario no encontrado");
    }
    cache.usuarios.ts = Date.now();
    saveUsuarios();
  }

  function addUsuariosBulk(text, defaultRole) {
    var lines = text.split(/\r?\n/);
    var added = [];
    var errors = [];
    lines.forEach(function (line, index) {
      var trimmed = line.trim();
      if (!trimmed) return;
      
      // Try splitting by tabs or multiple spaces (2+)
      var parts = trimmed.split(/[\t]+| {2,}/);
      if (parts.length < 2) {
        // Fallback to single spaces if no tabs or 2+ consecutive spaces
        var singleSpaceParts = trimmed.split(/\s+/);
        if (singleSpaceParts.length === 2) {
          parts = singleSpaceParts;
        } else {
          errors.push("Línea " + (index + 1) + ": Formato incorrecto. Use: Nombre [Espacio] Contraseña");
          return;
        }
      }
      var nombre = parts[0].trim();
      var password = parts[1].trim();
      
      // Auto-generate email
      var cleanName = nombre.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .trim();
      var email = cleanName.replace(/\s+/g, ".") + "@deppg.com";

      try {
        var newUser = addUsuario({
          nombre: nombre,
          correo: email,
          password: password,
          rol: defaultRole || "supervisor"
        });
        added.push(newUser);
      } catch (e) {
        errors.push("Línea " + (index + 1) + " (" + nombre + "): " + e.message);
      }
    });
    return { added: added, errors: errors };
  }

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
          par: toF(p[3]),
          rpm: toF(p[4]),
          I: toF(p[5]),
          V: toF(p[6]),
          vll: toF(p[7]),
          freq: toF(p[8]),
          temp: toF(p[9]),
          gRPM: toF(p[10]),
          ptp: toF(p[11]),
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
  async function loadERB() {
    var now = Date.now();
    if (cache.erb.ts && now - cache.erb.ts < TTL && cache.erb.rows.length)
      return cache.erb.rows;
    try {
      var result = await fetchCSV(ESTACIONES_CSV, false);
      var newRows = parseERB(result.rows);

      // Prevent rollback/going backward in time due to Google CDN sync delay
      var currentLatest = cache.erb.rows.length ? cache.erb.rows[cache.erb.rows.length - 1] : null;
      var newLatest = newRows.length ? newRows[newRows.length - 1] : null;
      if (currentLatest && newLatest) {
        var currentTs = parseDate(currentLatest.ts);
        var newTs = parseDate(newLatest.ts);
        if (currentTs && newTs && newTs < currentTs) {
          console.warn("[DB] Ignored older ERB data fetched (likely CDN sync lag).");
          cache.erb.ts = now;
          return cache.erb.rows;
        }
      }

      cache.erb.rows = newRows;
      cache.erb.ts = now;
      try {
        localStorage.setItem("tn_erb", JSON.stringify(cache.erb));
      } catch (e) {}
    } catch (e) {
      console.warn("[DB] ERB fetch failed:", e.message);
      var s = safeGet("tn_erb");
      if (s) Object.assign(cache.erb, s);
    }
    return cache.erb.rows;
  }

  async function loadPozos() {
    var now = Date.now();
    if (cache.pozos.ts && now - cache.pozos.ts < TTL && cache.pozos.rows.length)
      return cache.pozos.rows;
    try {
      var result = await fetchCSV(POZOS_CSV, false);
      var newRows = parsePozos(result.rows);

      // Prevent rollback/going backward in time due to Google CDN sync delay
      var currentLatest = cache.pozos.rows.length ? cache.pozos.rows[cache.pozos.rows.length - 1] : null;
      var newLatest = newRows.length ? newRows[newRows.length - 1] : null;
      if (currentLatest && newLatest) {
        var currentTs = parseDate(currentLatest.ts);
        var newTs = parseDate(newLatest.ts);
        if (currentTs && newTs && newTs < currentTs) {
          console.warn("[DB] Ignored older Pozos data fetched (likely CDN sync lag).");
          cache.pozos.ts = now;
          return cache.pozos.rows;
        }
      }

      cache.pozos.rows = newRows;
      cache.pozos.ts = now;
      try {
        localStorage.setItem("tn_pz", JSON.stringify({
          rows: cache.pozos.rows.slice(-10000),
          ts: cache.pozos.ts
        }));
      } catch (e) {}
    } catch (e) {
      console.warn("[DB] Pozos fetch failed:", e.message);
      var s = safeGet("tn_pz");
      if (s) Object.assign(cache.pozos, s);
    }
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

  async function loadUsuarios() {
    var now = Date.now();
    if (!cache.usuarios.rows.length || (now - cache.usuarios.ts > TTL)) {
      try {
        var result = await fetchCSV(USUARIOS_CSV, true);
        var remoteUsers = result.rows.map(function(line) {
          var p = csvSplit(line);
          return {
            nombre: p[0] ? p[0].trim() : "",
            correo: p[1] ? p[1].trim().toLowerCase() : "",
            rol: p[2] ? p[2].trim().toLowerCase() : "supervisor",
            password: p[3] ? p[3].trim() : ""
          };
        }).filter(function(u) {
          return u.nombre && u.correo && u.password;
        });

        remoteUsers.forEach(function(ru) {
          var localUser = cache.usuarios.rows.find(function(lu) {
            return lu.correo.toLowerCase() === ru.correo;
          });
          if (localUser) {
            localUser.nombre = ru.nombre;
            localUser.rol = ru.rol;
            localUser.password = ru.password;
          } else {
            cache.usuarios.rows.push(ru);
          }
        });

        cache.usuarios.ts = now;
        saveUsuarios();
      } catch (e) {
        console.warn("[DB] Usuarios fetch failed, using cache:", e.message);
      }
    }
    return cache.usuarios.rows;
  }

  /* ── PUBLIC API ── */

  function getLatestERB() {
    var r = cache.erb.rows;
    return r.length ? r[r.length - 1] : null;
  }

  function getERBHistory(hours) {
    hours = hours || 24;
    var r = cache.erb.rows;
    if (!r.length) return [];
    // Try filtering by real timestamp first
    var cutoff = new Date(Date.now() - hours * 3600 * 1000);
    var filtered = r.filter(function (row) {
      if (!row.ts) return true;
      var d = new Date(row.ts.replace(" ", "T"));
      return !isNaN(d.getTime()) && d >= cutoff;
    });
    // If timestamp filtering got nothing (bad timestamps), fall back to row count estimate
    if (!filtered.length) {
      var n = Math.min(hours * 60, r.length);
      return r.slice(-n);
    }
    return filtered;
  }

  function getERBHistoryRange(fromDate, toDate) {
    var r = cache.erb.rows;
    if (!r.length) return [];
    return r.filter(function (row) {
      if (!row.ts) return false;
      var d = new Date(row.ts.replace(" ", "T"));
      return !isNaN(d.getTime()) && d >= fromDate && d <= toDate;
    });
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
        estado: anyAlarm ? "warning" : "online",
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
      estado: l.alm601H || l.alm602H || l.alm741H ? "warning" : "online",
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
      presL1: l.presL1,
      presL2: l.presL2,
    };
  }

  function getPozos() {
    var rows = cache.pozos.rows;
    if (!rows.length) return [];
    var map = {};
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
          r.texto === "Normal"
            ? "online"
            : r.texto === ""
              ? "offline"
              : "warning",
        ts: r.ts,
        lat: coords.lat,
        lng: coords.lng,
        latest: r,
      };
    });
  }

  function getPozoLatest(nombre) {
    var rows = cache.pozos.rows;
    for (var i = rows.length - 1; i >= 0; i--) {
      if (rows[i].pozo === nombre) return rows[i];
    }
    return null;
  }

  function getPozoHistory(nombre, hours) {
    hours = hours || 24;
    var rows = cache.pozos.rows.filter(function (r) {
      return r.pozo === nombre;
    });
    if (!rows.length) return [];
    // Try filtering by real timestamp first
    var cutoff = new Date(Date.now() - hours * 3600 * 1000);
    var filtered = rows.filter(function (row) {
      if (!row.ts) return true;
      var d = new Date(row.ts.replace(" ", "T"));
      return !isNaN(d.getTime()) && d >= cutoff;
    });
    if (!filtered.length) {
      var n = Math.min(hours * 30, rows.length);
      return rows.slice(-n);
    }
    return filtered;
  }

  function getPozoHistoryRange(nombre, fromDate, toDate) {
    var rows = cache.pozos.rows.filter(function (r) {
      return r.pozo === nombre;
    });
    if (!rows.length) return [];
    return rows.filter(function (row) {
      if (!row.ts) return false;
      var d = new Date(row.ts.replace(" ", "T"));
      return !isNaN(d.getTime()) && d >= fromDate && d <= toDate;
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

  function authenticate(correo, password) {
    var email = correo.trim().toLowerCase();
    var pwd = password.trim();
    console.log("[DB] authenticate invocado para:", email);
    console.log(
      "[DB] Total usuarios en caché para comparar:",
      cache.usuarios.rows ? cache.usuarios.rows.length : 0,
    );
    for (var i = 0; i < cache.usuarios.rows.length; i++) {
      var u = cache.usuarios.rows[i];
      if (u.correo === email && u.password === pwd) {
        console.log("[DB] Usuario coincidente encontrado:", u.nombre);
        return u;
      }
    }
    console.log("[DB] No se encontró coincidencia de correo/contraseña");
    return null;
  }

  function getUsuarios() {
    return cache.usuarios.rows;
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
    loadUsuarios,
    getEstaciones,
    getERBDetalle,
    getERBHistory,
    getERBHistoryRange,
    getLatestERB,
    getPozos,
    getPozoLatest,
    getPozoHistory,
    getPozoHistoryRange,
    authenticate,
    getUsuarios,
    getCoords,
    invalidate,
    addUsuario,
    deleteUsuario,
    updateUsuarioRole,
    addUsuariosBulk,
    invalidate,
    forceRefresh,
    GEO_ERB,
    GEO_POZOS,
  };
})();
