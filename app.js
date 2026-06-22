/* ──────────────────────────────────────────────
   SETTINGS STATE (persisted in localStorage)
────────────────────────────────────────────── */
const SETTINGS_KEY = "tn_settings";
let SETTINGS = {
  tema: "dark",
  idioma: "es",
  alertas: {
    activas: true,
    nivelAlto: true,
    nivelBajo: true,
    presion: true,
    torque: true,
    corriente: true,
    temperatura: true,
    comunicacion: true,
  },
  envio: { correo: true, sms: false, whatsapp: false, web: true },
  tanques: {
    capacidadMax: 100,
    capacidadOp: 90,
    nivelCritico: 80,
    nivelAdvertencia: 70,
    colorIndicadores: "#4d9ffc",
    factorCalibracion: 1.0,
  },
  pozos: {
    limPresionMin: 0,
    limPresionMax: 2000,
    limCorrienteMin: 0,
    limCorrienteMax: 100,
    limTorqueMin: 0,
    limTorqueMax: 5000,
    limTempMax: 120,
    frecuencia: 60,
  },
  mapa: {
    estaciones: true,
    pozos: true,
    rutas: false,
    coordenadas: false,
    satelital: true,
    callejero: false,
    agrupar: true,
  },
  reportes: { pdf: true, diarios: false, semanales: false, mensuales: true },
};
try {
  const s = JSON.parse(localStorage.getItem(SETTINGS_KEY));
  if (s) SETTINGS = Object.assign(SETTINGS, s);
} catch (_) {}
function saveSettings() {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(SETTINGS));
  } catch (_) {}
}

/* ── Apply theme ── */
function applyTheme() {
  if (SETTINGS.tema === "light") {
    document.body.classList.add("light");
  } else {
    document.body.classList.remove("light");
  }
}

/* ── Translation dictionary ── */
const TRANSLATIONS = {
  en: {
    // Sidebar
    "E.R.B": "E.R.B",
    Pozos: "Wells",
    "Mapa General": "General Map",
    Ajustes: "Settings",
    // ERB list
    Estación: "Station",
    Ubicación: "Location",
    Tanques: "Tanks",
    "Última actualización": "Last Update",
    Estado: "Status",
    "Mostrando 1 a 0 de 0 estaciones": "Showing 1 to 0 of 0 stations",
    "Mostrando 1 a {count} de {total} estaciones":
      "Showing 1 to {count} of {total} stations",
    "Mostrando 0 estaciones": "Showing 0 stations",
    "Sin resultados": "No results",
    // ERB detail
    "Resumen de tanques": "Tank Summary",
    "Vista general de tanques": "Tank Overview",
    "Detalle por tanque": "Per-Tank Detail",
    "Volver a estaciones": "Back to Stations",
    "Generar PDF": "Generate PDF",
    "Tanques totales": "Total Tanks",
    "Capacidad total": "Total Capacity",
    "Promedio de llenado": "Average Fill",
    "Volumen total actual": "Total Current Volume",
    "Tanque de Almacenamiento": "Storage Tank",
    Alarma: "Alarm",
    Capacidad: "Capacity",
    "Nivel actual": "Current Level",
    Llenado: "Fill",
    "Comportamiento del nivel (últimas {hours} horas)":
      "Level behavior (last {hours} hours)",
    // Pozos list
    "Seleccione un pozo": "Select a Well",
    "Elija el pozo que desea monitorear para visualizar su telemetría en tiempo real.":
      "Choose the well you want to monitor to view its telemetry in real time.",
    "Buscar pozo...": "Search well...",
    Pozo: "Well",
    "Área / Campo": "Area / Field",
    "Mostrando 1 a 0 de 0 pozos": "Showing 1 to 0 of 0 wells",
    "Mostrando 1 a {count} de {total} pozos":
      "Showing 1 to {count} of {total} wells",
    "Mostrando 0 pozos": "Showing 0 wells",
    // Pozo detail
    "Volver a pozos": "Back to Wells",
    "Presión en TP": "TP Pressure",
    Torque: "Torque",
    Corriente: "Current",
    "Gen - Temperatura": "Gen - Temperature",
    "Gen - Voltaje L-L": "Gen - Voltage L-L",
    "Gen - Frecuencia": "Gen - Frequency",
    "Gen - RPM": "Gen - RPM",
    Promedio: "Average",
    Generador: "Generator",
    // Chart titles
    "Presión en TP (PSI)": "TP Pressure (PSI)",
    "Torque (lb-ft)": "Torque (lb-ft)",
    "Corriente (A)": "Current (A)",
    "Temperatura (°C)": "Temperature (°C)",
    "Voltaje L-L (V)": "Voltage L-L (V)",
    "Frecuencia (Hz)": "Frequency (Hz)",
    "RPM Generador": "Generator RPM",
    // Status
    "En producción": "In Production",
    Advertencia: "Warning",
    "En línea": "Online",
    "Sin conexión": "Offline",
    // Login form
    "Iniciar sesión": "Sign In",
    "Accede a tu cuenta para continuar": "Access your account to continue",
    "Correo electrónico": "Email",
    Contraseña: "Password",
    "Ingresa tu contraseña": "Enter your password",
    Recordarme: "Remember me",
    "¿Olvidaste tu contraseña?": "Forgot your password?",
    "¿No tienes una cuenta?": "Don't have an account?",
    "Contácta al administrador": "Contact the administrator",
    "© 2026 TelNet. Todos los derechos reservados.":
      "© 2026 TelNet. All rights reserved.",
    // Settings page
    "Tema e Idioma": "Theme & Language",
    Tema: "Theme",
    Oscuro: "Dark",
    Claro: "Light",
    Idioma: "Language",
    Español: "Spanish",
    Inglés: "English",
    Chino: "Chinese",
    "Configuración de Tanques": "Tank Configuration",
    "Configuración de Pozos": "Well Configuration",
    "Usuarios y Roles": "Users & Roles",
    Seguridad: "Security",
    // Conn
    Conectado: "Connected",
    "Sin conexión": "Offline",
    // Ajustes filter
    Todos: "All",
    Filtrar: "Filter",
    // Role descriptions
    "Acceso total": "Full Access",
    "Acceso lectura/escritura": "Read/Write Access",
    "Acceso lectura limitada": "Limited Read Access",
    "Solo lectura": "Read Only",
    // Loading states
    "Cargando...": "Loading...",
    "Cargando estaciones...": "Loading stations...",
    "Cargando estación...": "Loading station...",
    "Actualizando...": "Updating...",
    "Cargando pozos...": "Loading wells...",
    "Cargando pozo...": "Loading well...",
    "Cargando mapa...": "Loading map...",
    // Header descriptions
    "Estaciones de Recolección y Bombeo": "Collection and Pumping Stations",
    "Selección de pozo para monitoreo": "Select a well for monitoring",
    "Ubicación de estaciones y pozos – Ébano, San Luis Potosí":
      "Stations and wells location – Ébano, San Luis Potosí",
    "Configuración del sistema": "System Configuration",
    // Map legend
    Leyenda: "Legend",
    "Estaciones (E.R.B)": "Stations (E.R.B)",
    "Lista de activos": "Asset List",
    "Ver todos los activos": "View all assets",
    "Seleccionar rango de fechas": "Select date range",
    "Fecha inicio": "Start Date",
    "Fecha fin": "End Date",
    Cancelar: "Cancel",
    Aplicar: "Apply",
    // User management
    "Lista de usuarios": "User List",
    "Agregar Usuario": "Add User",
    "Agregar Usuarios": "Add Users",
    Individual: "Individual",
    "Lote (Múltiple)": "Bulk (Multiple)",
    "Nombre Completo": "Full Name",
    "Correo Electrónico": "Email Address",
    "Contraseña temporal": "Temporary Password",
    "Rol del Usuario": "User Role",
    "Rol por Defecto": "Default Role",
    "Usuarios y Contraseñas (Uno por línea)":
      "Users and Passwords (One per line)",
    "Pegue una lista. Formato: Nombre y Contraseña separados por un tabulador o espacio. El correo se autogenerará.":
      "Paste a list. Format: Name and Password separated by a tab or space. Email will be auto-generated.",
    Nombre: "Name",
    Correo: "Email",
    Contraseña: "Password",
    Rol: "Role",
    "Eliminar usuario": "Delete User",
    "Usuario actual": "Current User",
    "Permisos de su rol actual": "Permissions of current role",
    "Ver datos": "View Data",
    "Editar configuraciones": "Edit Settings",
    "Exportar reportes": "Export Reports",
    "Gestionar usuarios": "Manage Users",
    Permitido: "Allowed",
    Denegado: "Denied",
    Agregar: "Add",
    Administrador: "Administrator",
    Supervisor: "Supervisor",
    Operador: "Operator",
    Visitante: "Visitor",
    // PDF Report keys
    "RESUMEN ERB E41": "ERB E41 SUMMARY",
    "Reporte generado el": "Report generated on",
    Concepto: "Concept",
    Valor: "Value",
    "Capacidad máxima": "Max Capacity",
    "Capacidad máxima:": "Max Capacity:",
    "Nivel actual (existente):": "Current Level (Existing):",
    "Utilizacion:": "Utilization:",
    "Capacidad total (maxima)": "Total Capacity (max)",
    "Volumen total actual (existente)": "Total Current Volume (existing)",
    "Tanque con mayor nivel": "Tank with highest level",
    "Tanque con menor nivel": "Tank with lowest level",
    "DISTRIBUCION DE NIVEL ACTUAL (BARRILES EXISTENTES)":
      "CURRENT LEVEL DISTRIBUTION (EXISTING BARRELS)",
    "TENDENCIA DE NIVEL  (BARRILES EXISTENTES - ULTIMAS 24 HORAS)":
      "LEVEL TREND (EXISTING BARRELS - LAST 24 HOURS)",
    "Pagina 1 de 1": "Page 1 of 1",
    "Reporte generado automaticamente. No requiere firma.":
      "Report generated automatically. Signature not required.",
    "INDICADORES CLAVE": "KEY INDICATORS",
    "(maxima)": "(max)",
    "(% de capacidad)": "(% of capacity)",
    "(barriles existentes)": "(existing barrels)",
    "RESUMEN DE INVENTARIO POR TANQUE": "TANK INVENTORY SUMMARY",
    "RESUMEN GENERAL": "GENERAL SUMMARY",
    "MENSAJES CLAVE": "KEY MESSAGES",
    "El sistema opera con un promedio de llenado del {avg}%, dentro de rangos seguros.":
      "The system operates with an average fill of {avg}%, within safe ranges.",
    "El tanque {id} presenta el mayor nivel de {vol} barriles ({pct}% de su capacidad).":
      "Tank {id} has the highest level of {vol} barrels ({pct}% of its capacity).",
    "Todos los tanques operan dentro de los rangos normales.":
      "All tanks operate within normal ranges.",
    "El tanque {id} se encuentra vacio. Se recomienda evaluar su programacion de uso.":
      "Tank {id} is empty. It is recommended to evaluate its usage scheduling.",
    "El tanque {id} presenta el menor nivel de {vol} barriles ({pct}% de su capacidad).":
      "Tank {id} has the lowest level of {vol} barrels ({pct}% of its capacity).",
    // Pozo PDF
    RESUMEN: "SUMMARY",
    "INDICADORES CLAVE (EN TIEMPO REAL)": "KEY REAL-TIME INDICATORS",
    "TENDENCIAS – ÚLTIMAS 24 HORAS": "TRENDS – LAST 24 HOURS",
    "RESUMEN OPERATIVO": "OPERATIONAL SUMMARY",
    "OBSERVACIONES CLAVE": "KEY OBSERVATIONS",
    CONCLUSIÓN: "CONCLUSION",
    Parámetro: "Parameter",
    "Valor Actual": "Current Value",
    "Variación (%)": "Variation (%)",
    "RPM Generador (RPM)": "Generator RPM (RPM)",
    "ESTADO GENERAL": "GENERAL STATUS",
    NORMAL: "NORMAL",
    ATENCION: "ATTENTION",
    "presenta una disminucion": "shows a decrease",
    "presenta un aumento": "shows an increase",
    "significativa del": "significant of",
    "respecto al promedio.": "compared to average.",
    "No se registran anomalias criticas en los parametros monitoreados.":
      "No critical anomalies registered in the monitored parameters.",
    "Voltaje y Frecuencia se mantienen estables y dentro de los rangos esperados.":
      "Voltage and Frequency remain stable and within expected ranges.",
    "El RPM del generador se mantiene estable en {val} RPM.":
      "Generator RPM remains stable at {val} RPM.",
    "El sistema de produccion y el generador operan de manera estable. Los parametros electricos (voltaje, frecuencia y RPM) se encuentran dentro de los rangos normales.\nSe recomienda continuar con el monitoreo de Torque y Corriente.":
      "The production system and generator operate stably. Electrical parameters (voltage, frequency and RPM) are within normal ranges.\nIt is recommended to continue monitoring Torque and Current.",
    "Se detectaron variaciones en: {fields}. Se recomienda revision preventiva de los equipos afectados y continuar el monitoreo intensivo.":
      "Variations detected in: {fields}. Preventive maintenance is recommended for affected equipment, and close monitoring should continue.",
  },
  zh: {
    "E.R.B": "E.R.B",
    Pozos: "油井",
    "Mapa General": "总地图",
    Ajustes: "设置",
    Estación: "站点",
    Ubicación: "位置",
    Tanques: "储罐",
    "Última actualización": "最后更新",
    Estado: "状态",
    "Mostrando 1 a 0 de 0 estaciones": "显示第 1 到 0 共 0 个站点",
    "Mostrando 1 a {count} de {total} estaciones":
      "显示第 1 到 {count} 共 {total} 个站点",
    "Mostrando 0 estaciones": "显示 0 个站点",
    "Sin resultados": "无结果",
    "Resumen de tanques": "储罐摘要",
    "Vista general de tanques": "储罐概览",
    "Detalle por tanque": "各储罐详情",
    "Volver a estaciones": "返回站点",
    "Generar PDF": "生成PDF",
    "Tanques totales": "总储罐数",
    "Capacidad total": "总容量",
    "Promedio de llenado": "平均填充率",
    "Volumen total actual": "当前总容量",
    "Tanque de Almacenamiento": "储罐",
    Alarma: "报警",
    Capacidad: "容量",
    "Nivel actual": "当前液位",
    Llenado: "填充率",
    "Comportamiento del nivel (últimas {hours} horas)":
      "液位变化趋势（最近 {hours} 小时）",
    "Seleccione un pozo": "选择油井",
    "Elija el pozo que desea monitorear para visualizar su telemetría en tiempo real.":
      "选择您要监控的油井以实时查看其遥测数据。",
    "Buscar pozo...": "搜索油井...",
    Pozo: "油井",
    "Área / Campo": "区域 / 油田",
    "Mostrando 1 a 0 de 0 pozos": "显示第 1 到 0 共 0 口油井",
    "Mostrando 1 a {count} de {total} pozos":
      "显示第 1 到 {count} 共 {total} 口油井",
    "Mostrando 0 pozos": "显示 0 口油井",
    "Volver a pozos": "返回油井",
    "Presión en TP": "油管压力",
    Torque: "扭矩",
    Corriente: "电流",
    "Gen - Temperatura": "发电机温度",
    "Gen - Voltaje L-L": "发电机线电压",
    "Gen - Frecuencia": "发电机频率",
    "Gen - RPM": "发电机转速",
    Promedio: "平均",
    Generador: "发电机",
    "Presión en TP (PSI)": "油管压力 (PSI)",
    "Torque (lb-ft)": "扭矩 (lb-ft)",
    "Corriente (A)": "电流 (A)",
    "Temperatura (°C)": "温度 (°C)",
    "Voltaje L-L (V)": "线电压 (V)",
    "Frecuencia (Hz)": "频率 (Hz)",
    "RPM Generador": "发电机转速",
    // Status
    "En producción": "生产中",
    Advertencia: "警告",
    "En línea": "在线",
    "Sin conexión": "离线",
    // Login form
    "Iniciar sesión": "登录",
    "Accede a tu cuenta para continuar": "登录您的账户以继续",
    "Correo electrónico": "电子邮件",
    Contraseña: "密码",
    "Ingresa tu contraseña": "请输入密码",
    Recordarme: "记住我",
    "¿Olvidaste tu contraseña?": "忘记密码？",
    "¿No tienes una cuenta?": "没有账户？",
    "Contácta al administrador": "联系管理员",
    "© 2026 TelNet. Todos los derechos reservados.":
      "© 2026 TelNet. 保留所有权利。",
    "Tema e Idioma": "主题与语言",
    Tema: "主题",
    Oscuro: "深色",
    Claro: "浅色",
    Idioma: "语言",
    Español: "西班牙语",
    Inglés: "英语",
    Chino: "中文",
    "Configuración de Tanques": "储罐配置",
    "Configuración de Pozos": "油井配置",
    "Usuarios y Roles": "用户和角色",
    Seguridad: "安全",
    Conectado: "已连接",
    "Sin conexión": "离线",
    Todos: "全部",
    Filtrar: "筛选",
    // Role descriptions
    "Acceso total": "完全访问",
    "Acceso lectura/escritura": "读写访问",
    "Acceso lectura limitada": "受限读取",
    "Solo lectura": "只读",
    "Cargando...": "加载中...",
    "Cargando estaciones...": "正在加载站点...",
    "Cargando estación...": "正在加载站点...",
    "Actualizando...": "正在更新...",
    "Cargando pozos...": "正在加载油井...",
    "Cargando pozo...": "正在加载油井...",
    "Cargando mapa...": "正在加载地图...",
    "Estaciones de Recolección y Bombeo": "集输泵站",
    "Selección de pozo para monitoreo": "选择要监控的油井",
    "Ubicación de estaciones y pozos – Ébano, San Luis Potosí":
      "站点与油井分布 – 埃瓦诺，圣路易斯波托西",
    "Configuración del sistema": "系统配置",
    Leyenda: "图例",
    "Estaciones (E.R.B)": "站点 (E.R.B)",
    "Lista de activos": "资产列表",
    "Ver todos los activos": "查看所有资产",
    "Seleccionar rango de fechas": "选择日期范围",
    "Fecha inicio": "开始日期",
    "Fecha fin": "结束日期",
    Cancelar: "取消",
    Aplicar: "应用",
    // PDF keys
    "RESUMEN ERB E41": "ERB E41 摘要",
    "Reporte generado el": "报告生成日期",
    Concepto: "概念",
    Valor: "数值",
    "Capacidad máxima": "最大容量",
    "Capacidad máxima:": "最大容量：",
    "Nivel actual (existente):": "当前液位（现存）：",
    "Utilizacion:": "利用率：",
    "Capacidad total (maxima)": "总容量（最大）",
    "Volumen total actual (existente)": "当前总体积（现存）",
    "Tanque con mayor nivel": "液位最高储罐",
    "Tanque con menor nivel": "液位最低储罐",
    "DISTRIBUCION DE NIVEL ACTUAL (BARRILES EXISTENTES)":
      "当前液位分布（现存桶数）",
    "TENDENCIA DE NIVEL  (BARRILES EXISTENTES - ULTIMAS 24 HORAS)":
      "液位趋势（现存桶数 - 过去24小时）",
    "Pagina 1 de 1": "第 1 页，共 1 页",
    "Reporte generado automaticamente. No requiere firma.":
      "自动生成报告，无需签名。",
    "INDICADORES CLAVE": "关键指标",
    "(maxima)": "（最大）",
    "(% de capacidad)": "（容量百分比）",
    "(barriles existentes)": "（现存桶数）",
    "RESUMEN DE INVENTARIO POR TANQUE": "各储罐库存汇总",
    "RESUMEN GENERAL": "总体汇总",
    "MENSAJES CLAVE": "关键信息",
    "El sistema opera con un promedio de llenado del {avg}%, dentro de rangos seguros.":
      "系统平均充满率为 {avg}%，在安全范围内。",
    "El tanque {id} presenta el mayor nivel de {vol} barriles ({pct}% de su capacidad).":
      "储罐 {id} 液位最高，达 {vol} 桶（容量的 {pct}%）。",
    "Todos los tanques operan dentro de los rangos normales.":
      "所有储罐均在正常范围内运行。",
    "El tanque {id} se encuentra vacio. Se recomienda evaluar su programacion de uso.":
      "储罐 {id} 为空，建议评估其使用计划。",
    "El tanque {id} presenta el menor nivel de {vol} barriles ({pct}% de su capacidad).":
      "储罐 {id} 液位最低，仅 {vol} 桶（容量的 {pct}%）。",
    // Pozo PDF zh
    RESUMEN: "摘要",
    "INDICADORES CLAVE (EN TIEMPO REAL)": "实时关键指标",
    "TENDENCIAS – ÚLTIMAS 24 HORAS": "趋势 – 最近24小时",
    "RESUMEN OPERATIVO": "运营摘要",
    "OBSERVACIONES CLAVE": "关键观察",
    CONCLUSIÓN: "结论",
    Parámetro: "参数",
    "Valor Actual": "当前值",
    "Variación (%)": "变化（%）",
    "RPM Generador (RPM)": "发电机转速 (RPM)",
    "ESTADO GENERAL": "总体状态",
    NORMAL: "正常",
    ATENCION: "注意",
    "presenta una disminucion": "出现下降",
    "presenta un aumento": "出现上升",
    "significativa del": "显著的",
    "respecto al promedio.": "相对于平均值。",
    "No se registran anomalias criticas en los parametros monitoreados.":
      "监测参数中未发现严重异常。",
    "Voltaje y Frecuencia se mantienen estables y dentro de los rangos esperados.":
      "电压和频率保持稳定，在预期范围内。",
    "El RPM del generador se mantiene estable en {val} RPM.":
      "发电机转速稳定在 {val} RPM。",
    "El sistema de produccion y el generador operan de manera estable. Los parametros electricos (voltaje, frecuencia y RPM) se encuentran dentro de los rangos normales.\nSe recomienda continuar con el monitoreo de Torque y Corriente.":
      "生产系统和发电机运行稳定。电气参数（电压、频率和转速）均在正常范围内。\n建议继续监测扭矩和电流。",
    "Se detectaron variaciones en: {fields}. Se recomienda revision preventiva de los equipos afectados y continuar el monitoreo intensivo.":
      "检测到以下参数的变化：{fields}。建议对受影响设备进行预防性检修，并继续加强监测。",
  },
};

/* ── Apply language: swap data-i18n text nodes ── */
function applyLang() {
  const lang = SETTINGS.idioma;
  const dict = TRANSLATIONS[lang] || {};

  // Translate static elements with data-i18n attribute
  document.querySelectorAll("[data-i18n]").forEach(function (node) {
    const key = node.getAttribute("data-i18n");
    // Store original Spanish text on first use
    if (!node.dataset.i18nEs) node.dataset.i18nEs = node.textContent.trim();
    if (lang === "es") {
      node.textContent = node.dataset.i18nEs;
    } else if (dict[key]) {
      node.textContent = dict[key];
    }
  });

  // Translate placeholder attributes
  document.querySelectorAll("[data-i18n-placeholder]").forEach(function (node) {
    const key = node.getAttribute("data-i18n-placeholder");
    if (!node.dataset.i18nEsPlaceholder)
      node.dataset.i18nEsPlaceholder = node.placeholder;
    if (lang === "es") node.placeholder = node.dataset.i18nEsPlaceholder;
    else if (dict[key]) node.placeholder = dict[key];
  });

  // Table header labels (static th elements in HTML)
  const thMap = {
    Estación: ["Station", "站点"],
    Ubicación: ["Location", "位置"],
    Tanques: ["Tanks", "储罐"],
    "Última actualización": ["Last Update", "最后更新"],
    Estado: ["Status", "状态"],
    Pozo: ["Well", "油井"],
    "Área / Campo": ["Area / Field", "区域 / 油田"],
  };
  const langIdx = lang === "en" ? 0 : lang === "zh" ? 1 : -1;
  document.querySelectorAll("th").forEach(function (th) {
    const txt = th.textContent.trim();
    if (!th.dataset.i18nEs) th.dataset.i18nEs = txt;
    const origKey = th.dataset.i18nEs;
    if (lang === "es") {
      th.textContent = origKey;
    } else if (thMap[origKey] && langIdx >= 0) {
      th.textContent = thMap[origKey][langIdx];
    }
  });

  // "Detalle por tanque" dynamic h3
  const dtEl =
    document.querySelector(".box-title[data-i18n-det]") ||
    (() => {
      const h = document.querySelector("#ed-details")?.previousElementSibling;
      if (h && h.tagName === "H3") {
        h.setAttribute("data-i18n-det", "1");
        return h;
      }
    })();
  if (dtEl) {
    if (!dtEl.dataset.i18nEs) dtEl.dataset.i18nEs = "Detalle por tanque";
    if (lang === "es") dtEl.textContent = "Detalle por tanque";
    else if (dict["Detalle por tanque"])
      dtEl.textContent = dict["Detalle por tanque"];
  }

  // Re-render ajustes panel if it's currently visible
  if (typeof renderAjustes === "function") {
    const ajView = document.getElementById("view-ajustes");
    if (ajView && !ajView.classList.contains("hidden")) {
      renderAjustes();
    }
  }

  // Re-translate connection status label
  const connLbls = document.querySelectorAll("#conn-label");
  connLbls.forEach(function (l) {
    const online = navigator.onLine;
    l.textContent = online ? _t("Conectado") : _t("Sin conexión");
  });

  // Re-render current dynamic views if visible
  if (
    typeof renderERBList === "function" &&
    el("view-erb") &&
    !el("view-erb").classList.contains("hidden")
  ) {
    renderERBList();
  }
  if (
    typeof renderPozosList === "function" &&
    el("view-pozos") &&
    !el("view-pozos").classList.contains("hidden")
  ) {
    renderPozosList();
  }
  if (
    typeof renderERBDetail === "function" &&
    el("view-erb-detail") &&
    !el("view-erb-detail").classList.contains("hidden")
  ) {
    const range = typeof _erbRange !== "undefined" ? _erbRange : "24H";
    renderERBDetail(
      range,
      typeof _erbCustomFrom !== "undefined" ? _erbCustomFrom : null,
      typeof _erbCustomTo !== "undefined" ? _erbCustomTo : null,
    );
  }
  if (
    typeof renderPozoDetail === "function" &&
    el("view-pozo-detail") &&
    !el("view-pozo-detail").classList.contains("hidden") &&
    typeof _pdNombre !== "undefined" &&
    _pdNombre
  ) {
    const range = typeof _pdRange !== "undefined" ? _pdRange : "24H";
    renderPozoDetail(
      _pdNombre,
      range,
      typeof _pdCustomFrom !== "undefined" ? _pdCustomFrom : null,
      typeof _pdCustomTo !== "undefined" ? _pdCustomTo : null,
    );
  }
}

/* Current logged-in user */
let CURRENT_USER = null;

/* ──────────────────────────────────────────────
   ACCESS HISTORY LOGGER & MODAL  (cross-device via Google Apps Script)
────────────────────────────────────────────── */

// ⚠ COLOCA AQUÍ LA URL de tu Apps Script desplegado:
// Extensions > Apps Script > Deploy > Web App > "Anyone" > Copy URL
const ACCESS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzvORT5f8pyrca71o73mCE8xakID5ZaIyVcI5ioYRX1rRc4sXN2wQj_wD_3MYbdp2oC/exec";
window.ACCESS_SCRIPT_URL = ACCESS_SCRIPT_URL;

const ACCESS_HISTORY_KEY  = "tn_access_history";    // localStorage cache key
const ACCESS_COOLDOWN_KEY = "tn_access_cooldown";   // timestamp of last log
const ACCESS_LOG_COOLDOWN = 5 * 60 * 1000;          // 5 min between logs per device

function parseUA(ua) {
  let browser = "Desconocido";
  let os      = "Desconocido";

  if (ua.includes("Edg/"))                             browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome/"))                     browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox/"))                    browser = "Firefox";
  else if (ua.includes("MSIE") || ua.includes("Trident")) browser = "IE";

  if      (ua.includes("Windows NT 10")) os = "Windows 10/11";
  else if (ua.includes("Windows NT 6.3")) os = "Windows 8.1";
  else if (ua.includes("Windows"))        os = "Windows";
  else if (ua.includes("iPhone"))         os = "iPhone (iOS)";
  else if (ua.includes("iPad"))           os = "iPad (iPadOS)";
  else if (ua.includes("Android")) {
    const m = ua.match(/Android ([0-9.]+)/);
    os = m ? `Android ${m[1]}` : "Android";
  } else if (ua.includes("Mac OS X"))    os = "macOS";
  else if (ua.includes("Linux"))         os = "Linux";

  const isMobile  = /Mobi|Android|iPhone|iPad/i.test(ua);
  const deviceType = isMobile ? "📱 Móvil" : "💻 Escritorio";
  return { browser, os, deviceType };
}

async function logAccessEvent(user) {
  // Cooldown: skip duplicate entries within 5 min on same device
  const lastTs = parseInt(localStorage.getItem(ACCESS_COOLDOWN_KEY) || "0", 10);
  const now    = Date.now();
  if (now - lastTs < ACCESS_LOG_COOLDOWN) return;
  localStorage.setItem(ACCESS_COOLDOWN_KEY, String(now));

  const ua = navigator.userAgent;
  const { browser, os, deviceType } = parseUA(ua);

  const entry = {
    ts:          now,
    usuario:     user.nombre  || "",
    correo:      user.correo  || "",
    rol:         user.rol     || "",
    dispositivo: `${deviceType} · ${browser}`,
    os:          os,
    ip:          "",
    ubicacion:   "",
  };

  // Fetch geolocation async then POST to Apps Script
  try {
    const geoRes = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (geoRes.ok) {
      const geo    = await geoRes.json();
      entry.ip        = geo.ip || "";
      entry.ubicacion = [geo.city, geo.region, geo.country_name].filter(Boolean).join(", ") || "";
    }
  } catch (_) { /* no geo */ }

  // POST to Google Apps Script (non-blocking)
  if (ACCESS_SCRIPT_URL && ACCESS_SCRIPT_URL !== "APPS_SCRIPT_URL_AQUI") {
    fetch(ACCESS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(entry),
      mode: "no-cors"          // Apps Script requires no-cors
    }).catch(() => {});
  }

  // Also save locally as fallback
  try {
    const local = JSON.parse(localStorage.getItem(ACCESS_HISTORY_KEY) || "[]");
    local.push(entry);
    localStorage.setItem(ACCESS_HISTORY_KEY, JSON.stringify(local.slice(-50)));
  } catch (_) {}
}

/* ── build row HTML ── */
function _ahRow(e) {
  const d     = new Date(e.ts);
  const fecha = d.toLocaleDateString("es-MX",  { day: "2-digit", month: "2-digit", year: "numeric" });
  const hora  = d.toLocaleTimeString("es-MX",  { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const ok    = (v) => v && v !== "Obteniendo..." && v !== "Sin datos" && v !== "";
  const ubicHtml = ok(e.ubicacion)
    ? `<span style="color:var(--green)">${e.ubicacion}</span>`
    : `<span style="color:var(--txt3)">${e.ubicacion || "—"}</span>`;
  const ipHtml = ok(e.ip)
    ? `<span style="font-family:monospace">${e.ip}</span>`
    : `<span style="color:var(--txt3)">—</span>`;
  return `<tr>
    <td><div style="font-weight:600;font-size:.84rem">${fecha}</div>
        <div style="color:var(--txt3);font-size:.74rem">${hora}</div></td>
    <td><div style="font-size:.83rem">${e.usuario || e.correo}</div>
        <div style="color:var(--txt3);font-size:.72rem">${e.correo}</div></td>
    <td><div style="font-size:.83rem">${e.dispositivo || "—"}</div>
        <div style="color:var(--txt3);font-size:.72rem">${e.os || ""}</div></td>
    <td style="font-size:.78rem">${ipHtml}</td>
    <td style="font-size:.78rem">${ubicHtml}</td>
  </tr>`;
}

/* ── modal skeleton (shown immediately, data loads async) ── */
function _ahModalSkeleton(modal) {
  modal.innerHTML = `
    <div class="modal-content" style="max-width:880px;max-height:90vh;display:flex;flex-direction:column;">
      <div class="modal-header" style="display:flex;align-items:center;justify-content:space-between;padding:1.2rem 1.5rem;border-bottom:1px solid var(--border);flex-shrink:0">
        <div style="display:flex;align-items:center;gap:.75rem">
          <span style="width:34px;height:34px;background:rgba(29,122,245,.12);border-radius:50%;display:flex;align-items:center;justify-content:center;color:var(--blue-l)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </span>
          <div>
            <h3 style="font-size:1rem;font-weight:700;margin:0">🔒 Historial de Accesos</h3>
            <p id="ah-subtitle" style="font-size:.74rem;color:var(--txt2);margin:0">Cargando registros de todos los dispositivos…</p>
          </div>
        </div>
        <button class="modal-close-btn" id="ah-close-btn" style="width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.3rem;color:var(--txt3)">×</button>
      </div>
      <div style="flex:1;overflow-y:auto;overflow-x:auto;padding:1.2rem 1.5rem">
        <table style="width:100%;border-collapse:collapse;font-size:.82rem;min-width:580px">
          <thead>
            <tr style="border-bottom:1px solid var(--border2)">
              <th style="text-align:left;padding:.45rem .7rem;color:var(--txt3);font-size:.71rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap">Fecha / Hora</th>
              <th style="text-align:left;padding:.45rem .7rem;color:var(--txt3);font-size:.71rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px">Usuario</th>
              <th style="text-align:left;padding:.45rem .7rem;color:var(--txt3);font-size:.71rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px">Dispositivo</th>
              <th style="text-align:left;padding:.45rem .7rem;color:var(--txt3);font-size:.71rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px;white-space:nowrap">IP</th>
              <th style="text-align:left;padding:.45rem .7rem;color:var(--txt3);font-size:.71rem;font-weight:600;text-transform:uppercase;letter-spacing:.4px">Ubicación</th>
            </tr>
          </thead>
          <tbody id="ah-tbody">
            <tr><td colspan="5" style="text-align:center;padding:2.5rem;color:var(--txt3)">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="display:block;margin:0 auto .5rem;opacity:.4;animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2" stroke-linecap="round"/></svg>
              Cargando datos…
            </td></tr>
          </tbody>
        </table>
      </div>
      <div style="flex-shrink:0;padding:.8rem 1.5rem;border-top:1px solid var(--border);display:flex;justify-content:space-between;align-items:center">
        <span id="ah-count" style="font-size:.75rem;color:var(--txt3)">—</span>
        <button class="aj-btn" id="ah-close-btn2" style="border-color:var(--blue);color:var(--blue-l)">Cerrar</button>
      </div>
    </div>
  `;
}

window.openAccessHistoryModal = async function () {
  let modal = el("access-history-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id        = "access-history-modal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  _ahModalSkeleton(modal);
  modal.classList.remove("hidden");

  // Wire close handlers
  const closeModal = () => modal.classList.add("hidden");
  el("ah-close-btn").onclick  = closeModal;
  el("ah-close-btn2").onclick = closeModal;
  modal.onclick = (ev) => { if (ev.target === modal) closeModal(); };
  const ahEsc = (ev) => { if (ev.key === "Escape") { closeModal(); document.removeEventListener("keydown", ahEsc); } };
  document.addEventListener("keydown", ahEsc);

  // Try to load from Apps Script (cloud), fall back to localStorage
  let logs = [];
  let source = "local";

  if (ACCESS_SCRIPT_URL && ACCESS_SCRIPT_URL !== "APPS_SCRIPT_URL_AQUI") {
    try {
      const res = await fetch(ACCESS_SCRIPT_URL, { cache: "no-store" });
      if (res.ok) {
        logs   = await res.json();
        source = "cloud";
      }
    } catch (_) { /* fall through */ }
  }

  // Fallback: localStorage
  if (source === "local") {
    try {
      logs = JSON.parse(localStorage.getItem(ACCESS_HISTORY_KEY) || "[]");
      logs.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    } catch (_) { logs = []; }
  }

  const tbody    = el("ah-tbody");
  const subtitle = el("ah-subtitle");
  const countEl  = el("ah-count");

  if (!tbody) return;

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--txt3);padding:2.5rem">Sin registros de acceso aún.</td></tr>`;
  } else {
    tbody.innerHTML = logs.map(_ahRow).join("");
  }

  const srcLabel = source === "cloud"
    ? "📡 Todos los dispositivos · Google Sheets"
    : "⚠ Solo este dispositivo (Apps Script no configurado)";
  if (subtitle) subtitle.textContent = srcLabel;
  if (countEl)  countEl.textContent  = `${logs.length} registro${logs.length !== 1 ? "s" : ""}`;
};



/* ═══════════════════════════════════════════════
   TELNET – SPA CONTROLLER  (app.js)
   ═══════════════════════════════════════════════ */
("use strict");

/* ──────────────────────────────────────────────
   MICRO UTILS
────────────────────────────────────────────── */
const $ = (sel, p = document) => p.querySelector(sel);
const $$ = (sel, p = document) => [...p.querySelectorAll(sel)];

function showLoad(msg = "Cargando...") {
  const o = $("loading");
  if (!o) return;
  $("loading-msg").textContent = _t(msg);
  $("loading").classList.remove("hidden");
}
// Keep inline IDs consistent
function el(id) {
  return document.getElementById(id);
}
function showLoading(msg = "Cargando...") {
  el("loading-msg").textContent = _t(msg);
  el("loading").classList.remove("hidden");
}
function hideLoading() {
  el("loading").classList.add("hidden");
}

function _t(key) {
  const dict = TRANSLATIONS[SETTINGS.idioma] || {};
  return dict[key] || key;
}

function fmtStatus(s) {
  if (s === "online")
    return `<span class="sp sp-green"><span class="sp-dot">●</span>${_t("En línea")}</span>`;
  if (s === "warning")
    return `<span class="sp sp-orange"><span class="sp-dot">●</span>${_t("Advertencia")}</span>`;
  return `<span class="sp sp-gray"><span class="sp-dot">●</span>${_t("Sin conexión")}</span>`;
}
function fmtStatusPozo(s) {
  if (s === "online")
    return `<span class="sp sp-green"><span class="sp-dot">●</span>${_t("En producción")}</span>`;
  if (s === "warning")
    return `<span class="sp sp-orange"><span class="sp-dot">●</span>${_t("Advertencia")}</span>`;
  return `<span class="sp sp-gray"><span class="sp-dot">●</span>${_t("Sin conexión")}</span>`;
}

function sampleSeries(rows, key, maxPts = 120) {
  if (!rows.length) return { labels: [], vals: [] };
  const step = Math.max(1, Math.floor(rows.length / maxPts));
  const out = rows.filter((_, i) => i % step === 0);
  return {
    labels: out.map((r) => {
      const ts = (r.ts || "").trim();
      if (!ts) return "";
      // If ts has a date part, show date+time for multi-day data
      const parts = ts.split(" ");
      if (parts.length >= 2) {
        // Show date (DD/MM) + time (HH:MM) for clarity
        const datePart = parts[0]; // e.g. 15/06/2026 or 2026-06-15
        const timePart = parts[1].substring(0, 5); // HH:MM

        // Try parsing DD/MM/YYYY
        const dMatch = datePart.match(/(\d+)[-\/](\d+)[-\/](\d+)/);
        if (dMatch) {
          // If first part is > 12, it's definitely DD, if third is > 31 it's YYYY at the end.
          // Let's just assume DD/MM/YYYY for Mexico locale, or YYYY-MM-DD.
          if (dMatch[1].length === 4) {
            // YYYY-MM-DD -> DD/MM
            return `${dMatch[3]}/${dMatch[2]} ${timePart}`;
          } else {
            // DD/MM/YYYY -> DD/MM
            return `${dMatch[1]}/${dMatch[2]} ${timePart}`;
          }
        }
        return `${datePart} ${timePart}`;
      }
      return ts.substring(0, 5);
    }),
    vals: out.map((r) => r[key] ?? 0),
  };
}

function avg(rows, key) {
  if (!rows.length) return 0;
  return rows.reduce((a, r) => a + (parseFloat(r[key]) || 0), 0) / rows.length;
}

/* ──────────────────────────────────────────────
   CHART REGISTRY
────────────────────────────────────────────── */
const CHR = {
  _map: {},
  destroy(id) {
    if (this._map[id]) {
      this._map[id].destroy();
      delete this._map[id];
    }
  },
  destroyAll() {
    Object.keys(this._map).forEach((k) => this.destroy(k));
  },
  create(id, cfg) {
    this.destroy(id);
    const ctx = document.getElementById(id)?.getContext("2d");
    if (!ctx) return;
    this._map[id] = new Chart(ctx, cfg);
  },
};

const CHART_OPTS = (color) => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: "index", intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(13,21,32,.95)",
      borderColor: "rgba(255,255,255,.1)",
      borderWidth: 1,
      titleColor: "#7b8ea8",
      bodyColor: "#e8edf5",
      padding: 10,
      callbacks: {
        title: (items) => {
          const l = items[0]?.label || "";
          return `10:${l}`; // enrich if possible
        },
      },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(255,255,255,.04)" },
      ticks: { color: "#4a5a6e", font: { size: 10 }, maxTicksLimit: 7 },
    },
    y: {
      grid: { color: "rgba(255,255,255,.05)" },
      ticks: { color: "#4a5a6e", font: { size: 10 } },
      beginAtZero: false,
    },
  },
  animation: { duration: 500 },
});

function makeDataset(vals, color) {
  return {
    data: vals,
    borderColor: color,
    backgroundColor: color + "14",
    fill: true,
    borderWidth: 2,
    tension: 0.4,
    pointRadius: 0,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: color,
  };
}

/* ──────────────────────────────────────────────
   ROUTER
────────────────────────────────────────────── */
const VIEWS = [
  "home",
  "erb",
  "erb-detail",
  "pozos",
  "pozo-detail",
  "mapa",
  "ajustes",
];
const ROOT_NAV = {
  home: "home",
  erb: "erb",
  "erb-detail": "erb",
  pozos: "pozos",
  "pozo-detail": "pozos",
  mapa: "mapa",
  ajustes: "ajustes",
};
const TOPBAR_INFO = {
  home: {
    title: "Inicio",
    sub: "Monitoreo en tiempo real de operaciones y mantenimiento",
  },
  erb: { title: "E.R.B", sub: "Estaciones de Recolección y Bombeo" },
  "erb-detail": { title: "E.R.B", sub: "Estaciones de Recolección y Bombeo" },
  pozos: { title: "Pozos", sub: "Selección de pozo para monitoreo" },
  "pozo-detail": { title: "Pozos", sub: "Monitoreo en tiempo real" },
  mapa: {
    title: "Mapa General",
    sub: "Ubicación de estaciones y pozos – Ébano, San Luis Potosí",
  },
  ajustes: { title: "Ajustes", sub: "Configuración del sistema" },
};

let _cur = null;
const _handlers = {};
const _params = {};

function navigate(view, params = {}) {
  if (_cur === view) return;
  _cur = view;
  Object.assign(_params, params);

  VIEWS.forEach((v) => {
    const el_ = el(`view-${v}`);
    if (el_) el_.classList.toggle("hidden", v !== view);
  });

  // Update breadcrumb in topbar
  const info = TOPBAR_INFO[view] || { title: view, sub: "" };
  if (view === "erb-detail" && params.nombre) {
    el("topbar-title").innerHTML =
      `<span style="color:var(--txt2);cursor:pointer" id="bc-erb">${_t("E.R.B")}</span> <span style="color:var(--txt3)">›</span> ${params.nombre}`;
    setTimeout(
      () => el("bc-erb")?.addEventListener("click", () => navigate("erb")),
      0,
    );
  } else if (view === "pozo-detail" && params.nombre) {
    el("topbar-title").innerHTML =
      `<span style="color:var(--txt2);cursor:pointer" id="bc-pz">${_t("Pozos")}</span> <span style="color:var(--txt3)">›</span> ${params.nombre}`;
    setTimeout(
      () => el("bc-pz")?.addEventListener("click", () => navigate("pozos")),
      0,
    );
  } else {
    el("topbar-title").textContent = _t(info.title);
  }
  el("topbar-sub").textContent = _t(info.sub);

  // Update nav active
  const rootView = ROOT_NAV[view] || view;
  $$(".nav-btn[data-view]").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === rootView),
  );
  $$(".tab-btn[data-view]").forEach((b) =>
    b.classList.toggle("active", b.dataset.view === rootView),
  );

  if (_handlers[view]) _handlers[view](params);
}

function on(view, fn) {
  _handlers[view] = fn;
}

/* ──────────────────────────────────────────────
   VIEW: ERB LIST
────────────────────────────────────────────── */
let _erbFilter = "all",
  _erbSearch = "";

on("erb", async () => {
  showLoading("Cargando estaciones...");
  await DB.loadERB().catch(() => {});
  hideLoading();
  renderERBList();

  el("erb-search").oninput = (e) => {
    _erbSearch = e.target.value.toLowerCase();
    renderERBList();
  };
  el("erb-filter-btn").onclick = (e) => {
    e.stopPropagation();
    el("erb-filter-menu").classList.toggle("hidden");
  };
  $$(".dropdown-item", el("erb-filter-menu")).forEach((b) =>
    b.addEventListener("click", () => {
      _erbFilter = b.dataset.f;
      $$(".dropdown-item", el("erb-filter-menu")).forEach((x) =>
        x.classList.toggle("active", x === b),
      );
      el("erb-filter-menu").classList.add("hidden");
      renderERBList();
    }),
  );
});

function renderERBList() {
  let list = DB.getEstaciones();
  if (_erbFilter !== "all") list = list.filter((s) => s.estado === _erbFilter);
  if (_erbSearch)
    list = list.filter((s) => s.nombre.toLowerCase().includes(_erbSearch));

  const tbody = el("erb-tbody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--txt3);padding:2rem">${_t("Sin resultados")}</td></tr>`;
    el("erb-count").textContent = _t("Mostrando 0 estaciones");
    return;
  }

  tbody.innerHTML = list
    .map(
      (s) => `
    <tr data-id="${s.id}" data-nombre="${s.nombre}">
      <td>
        <div class="row-icon-wrap">
          <span class="row-derrick">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <rect x="4" y="10" width="16" height="11" rx="1"/>
              <path d="M8 10V7a4 4 0 0 1 8 0v3"/>
              <ellipse cx="12" cy="15.5" rx="3" ry="1.8"/>
              <line x1="12" y1="2" x2="12" y2="4"/>
            </svg>
          </span>
          <span class="row-name">${s.nombre}</span>
        </div>
      </td>
      <td>${s.ubicacion}</td>
      <td style="text-align:center">${s.tanques}</td>
      <td>${s.ts || "—"}</td>
      <td>${fmtStatus(s.estado)}</td>
      <td class="td-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </td>
    </tr>`,
    )
    .join("");

  tbody.querySelectorAll("tr").forEach((tr) =>
    tr.addEventListener("click", () =>
      navigate("erb-detail", {
        id: tr.dataset.id,
        nombre: tr.dataset.nombre,
      }),
    ),
  );

  el("erb-count").textContent = _t(
    "Mostrando 1 a {count} de {total} estaciones",
  )
    .replace("{count}", list.length)
    .replace("{total}", list.length);
  renderPagination("erb-pagination", list.length, 1);
}

/* ──────────────────────────────────────────────
   DATE RANGE PICKER MODAL
────────────────────────────────────────────── */
let _dateRangeCallback = null;

function openDateRangePicker(callback) {
  _dateRangeCallback = callback;
  // Create or show the modal
  let modal = el("date-range-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "date-range-modal";
    modal.style.cssText =
      "position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.6);backdrop-filter:blur(4px)";
    modal.innerHTML = `
      <div style="background:#111b2b;border:1px solid rgba(255,255,255,.12);border-radius:14px;padding:2rem;min-width:320px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,.6)">
        <h3 style="font-size:1rem;font-weight:700;margin-bottom:1.25rem;color:#e8edf5">${_t("Seleccionar rango de fechas")}</h3>
        <div style="display:flex;flex-direction:column;gap:1rem;margin-bottom:1.5rem">
          <div>
            <label style="font-size:.8rem;color:#7b8ea8;display:block;margin-bottom:.4rem">${_t("Fecha inicio")}</label>
            <input type="datetime-local" id="dr-from" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:.6rem .8rem;color:#e8edf5;font-size:.88rem;outline:none;">
          </div>
          <div>
            <label style="font-size:.8rem;color:#7b8ea8;display:block;margin-bottom:.4rem">${_t("Fecha fin")}</label>
            <input type="datetime-local" id="dr-to" style="width:100%;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:.6rem .8rem;color:#e8edf5;font-size:.88rem;outline:none;">
          </div>
        </div>
        <div style="display:flex;gap:.75rem;justify-content:flex-end">
          <button id="dr-cancel" style="padding:.6rem 1.2rem;border-radius:8px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:#7b8ea8;font-size:.85rem;cursor:pointer">${_t("Cancelar")}</button>
          <button id="dr-apply" style="padding:.6rem 1.2rem;border-radius:8px;background:#1d7af5;border:none;color:#fff;font-size:.85rem;font-weight:600;cursor:pointer">${_t("Aplicar")}</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }
  // Set default dates: from = 7 days ago, to = now
  const now = new Date();
  const weekAgo = new Date(now - 7 * 24 * 3600 * 1000);
  const toLocal = (d) =>
    new Date(d.getTime() - d.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  el("dr-from").value = toLocal(weekAgo);
  el("dr-to").value = toLocal(now);
  modal.style.display = "flex";

  el("dr-cancel").onclick = () => {
    modal.style.display = "none";
  };
  modal.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
  };
  el("dr-apply").onclick = () => {
    const fromVal = el("dr-from").value;
    const toVal = el("dr-to").value;
    if (!fromVal || !toVal) {
      el("dr-from").style.borderColor = fromVal ? "" : "#e74c3c";
      el("dr-to").style.borderColor = toVal ? "" : "#e74c3c";
      return;
    }
    el("dr-from").style.borderColor = "";
    el("dr-to").style.borderColor = "";
    const fromDate = new Date(fromVal);
    const toDate = new Date(toVal);
    if (fromDate >= toDate) {
      el("dr-from").style.borderColor = "#e74c3c";
      return;
    }
    modal.style.display = "none";
    if (_dateRangeCallback) _dateRangeCallback(fromDate, toDate);
  };
}

/* ──────────────────────────────────────────────
   VIEW: ERB DETAIL
────────────────────────────────────────────── */
let _erbRange = "24H";
let _erbCustomFrom = null,
  _erbCustomTo = null;

on("erb-detail", async (params) => {
  showLoading("Cargando estación...");
  await DB.loadERB().catch(() => {});
  hideLoading();
  _erbRange = "24H";
  _erbCustomFrom = null;
  _erbCustomTo = null;
  renderERBDetail(_erbRange);

  el("ed-back-btn").onclick = () => navigate("erb");
  el("ed-pdf-btn").onclick = () => {
    el("ed-pdf-btn").textContent =
      SETTINGS.idioma === "en"
        ? "Generating..."
        : SETTINGS.idioma === "zh"
          ? "生成中..."
          : "Generando...";
    setTimeout(() => {
      try {
        generateERBPDF();
      } catch (e) {
        console.error(e);
        alert("Error al generar PDF: " + e.message);
      }
      el("ed-pdf-btn").innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> ' +
        _t("Generar PDF");
    }, 50);
  };
  el("ed-refresh-btn").onclick = async () => {
    DB.forceRefresh();
    showLoading("Actualizando desde Google Sheets...");
    await DB.loadERB();
    hideLoading();
    renderERBDetail(_erbRange, _erbCustomFrom, _erbCustomTo);
  };

  // time range preset buttons
  $$(".tr-btn[data-r]", el("ed-time-ranges")).forEach((b) =>
    b.addEventListener("click", () => {
      $$(".tr-btn", el("ed-time-ranges")).forEach((x) =>
        x.classList.remove("active"),
      );
      b.classList.add("active");
      _erbRange = b.dataset.r;
      _erbCustomFrom = null;
      _erbCustomTo = null;
      CHR.destroyAll();
      renderERBDetail(_erbRange);
    }),
  );

  // Calendar button
  const calBtn = el("ed-cal-btn");
  if (calBtn) {
    calBtn.onclick = () => {
      openDateRangePicker((from, to) => {
        _erbCustomFrom = from;
        _erbCustomTo = to;
        _erbRange = "CUSTOM";
        $$(".tr-btn", el("ed-time-ranges")).forEach((x) =>
          x.classList.remove("active"),
        );
        calBtn.classList.add("active");
        CHR.destroyAll();
        renderERBDetail("CUSTOM", from, to);
      });
    };
  }
});

function rangeHours(r) {
  const map = { "1H": 1, "6H": 6, "12H": 12, "24H": 24, "7D": 168, "30D": 720 };
  return map[r] || 24;
}

function renderERBDetail(range, customFrom, customTo) {
  CHR.destroyAll();
  const d = DB.getERBDetalle();
  if (!d) return;

  // Header
  el("ed-title").textContent = d.nombre;
  el("ed-status").textContent =
    d.estado === "online" ? "● " + _t("En línea") : "● " + _t("Advertencia");
  el("ed-status").className =
    "status-pill " + (d.estado === "online" ? "green" : "orange");
  el("ed-loc").textContent = d.sector;
  el("ed-update").textContent = `${_t("Última actualización")}: ${d.ts || "—"}`;

  const now = new Date();
  el("ed-date").textContent = now.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  el("ed-time").textContent = now.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const hours = rangeHours(range);
  const history =
    range === "CUSTOM" && customFrom && customTo
      ? DB.getERBHistoryRange(customFrom, customTo)
      : DB.getERBHistory(hours);

  // Metrics – tanks
  const tanks = d.tanks;
  const factors = [1092.953, 1066.058202, 840.1914];
  let totalCap = 0;
  let totalVol = 0;

  tanks.forEach((t, i) => {
    t.capMax = t.altMax * factors[i] || 0;
    t.volActual = t.nivel * factors[i] || 0;
    t.pct = Math.max(0, Math.min(100, t.pct));
    totalCap += t.capMax;
    totalVol += t.volActual;
  });
  const avgPct =
    tanks.length > 0
      ? tanks.reduce((sum, t) => sum + t.pct, 0) / tanks.length
      : 0;
  const fmt = (n) => n.toLocaleString("en-US", { maximumFractionDigits: 0 });

  // 1) Resumen – fila horizontal compacta (imagen 2)
  el("ed-resumen").innerHTML = `
    <div class="res-card">
      <svg class="res-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><ellipse cx="12" cy="7" rx="9" ry="4"/><path d="M3 7v5c0 2.2 4 4 9 4s9-1.8 9-4V7"/><path d="M3 12v5c0 2.2 4 4 9 4s9-1.8 9-4v-5"/></svg>
      <span class="res-val">${tanks.length}</span>
      <span class="res-lbl">${_t("Tanques totales")}</span>
    </div>
    <div class="res-card">
      <svg class="res-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
      <span class="res-val">${fmt(totalCap)} <span style="font-size:0.72rem;font-weight:400;color:var(--txt2)">bbl</span></span>
      <span class="res-lbl">${_t("Capacidad total")}</span>
    </div>
    <div class="res-card">
      <div class="circle-chart" style="width:48px;height:48px;margin-bottom:.15rem">
        <svg viewBox="0 0 24 24"><circle class="circle-bg" cx="12" cy="12" r="10" stroke-width="2.5"/><circle class="circle-fg" cx="12" cy="12" r="10" stroke-dasharray="${avgPct * 0.628} 62.8" stroke-width="2.5" style="stroke:#2ecc71"/></svg>
        <span class="circle-val" style="font-size:.85rem">${avgPct.toFixed(0)}%</span>
      </div>
      <span class="res-lbl">${_t("Promedio de llenado")}</span>
    </div>
    <div class="res-card">
      <svg class="res-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
      <span class="res-val">${fmt(totalVol)} <span style="font-size:0.72rem;font-weight:400;color:var(--txt2)">bbl</span></span>
      <span class="res-lbl">${_t("Volumen total actual")}</span>
    </div>
  `;

  // 2) Vista general – industrial tanks
  el("ed-visuals").innerHTML = tanks
    .map((t, i) => {
      const P = Math.max(0, Math.min(100, t.pct));
      const liquidClass =
        P <= (SETTINGS.tanques.nivelCritico || 10)
          ? "danger"
          : P <= (SETTINGS.tanques.nivelAdvertencia || 20)
            ? "warn"
            : "";
      return `
    <article class="tank-item">
      <div class="tank-title">${t.nombre}</div>
      <div class="industrial-tank" style="--level:${P}">
        <div class="rail"><i></i><i></i><i></i><i></i><i></i></div>
        <div class="tank-top"></div>
        <div class="ladder"></div>
        <div class="stairs"></div>
        <div class="pipe"></div>
        <div class="tank-body">
          <div class="liquid ${liquidClass}" data-percent="${P.toFixed(0)}%"></div>
        </div>
        <div class="tank-base"></div>
      </div>
      <div class="tank-info">
        ${_t("Capacidad")}: ${fmt(t.capMax)} bbl<br>
        ${_t("Nivel actual")}: ${fmt(t.volActual)} bbl
      </div>
    </article>`;
    })
    .join("");

  // 3) Detalle por tanque
  el("ed-details").innerHTML = tanks
    .map(
      (t, i) => `
    <div class="tank-det-card" onclick="window.openTankChartModal(${i})">
      <div class="tdc-head">
        <div><h4>${t.nombre}</h4><span>${_t("Tanque de Almacenamiento")} ${t.nombre}</span></div>
        <span class="status-pill ${t.alarmH ? "orange" : "green"}">● ${t.alarmH ? _t("Alarma") : _t("En línea")}</span>
      </div>
      <div class="tdc-metrics">
        <div style="display:flex;gap:1.5rem">
          <div class="tdc-col"><span class="tdc-lbl">${_t("Capacidad")}</span><span class="tdc-val">${fmt(t.capMax)} <span style="font-size:0.75rem;font-weight:400;color:var(--txt2)">bbl</span></span></div>
          <div class="tdc-col"><span class="tdc-lbl">${_t("Nivel actual")}</span><span class="tdc-val">${fmt(t.volActual)} <span style="font-size:0.75rem;font-weight:400;color:var(--txt2)">bbl</span></span></div>
        </div>
        <div class="circle-chart">
          <svg><circle class="circle-bg" cx="37" cy="37" r="32"/><circle class="circle-fg" cx="37" cy="37" r="32" stroke-dasharray="${t.pct * 2.01} 201"/></svg>
          <span class="circle-val">${t.pct.toFixed(1)}%</span>
          <span class="circle-lbl">${_t("Llenado")}</span>
        </div>
      </div>
      <div class="tdc-chart-wrap">
        <div class="tdc-chart-lbl">${_t("Comportamiento del nivel (últimas {hours} horas)").replace("{hours}", hours)}</div>
        <canvas id="tchart-${i}" class="tdc-chart"></canvas>
      </div>
    </div>
  `,
    )
    .join("");

  // Draw Charts for each tank
  const chartKeys = ["pct601", "pct602", "pct741"];
  chartKeys.forEach((key, i) => {
    if (i >= tanks.length) return;
    const { labels, vals } = sampleSeries(history, key);
    setTimeout(() => {
      CHR.create(`tchart-${i}`, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: "Nivel %",
              data: vals,
              borderColor: "#1d7af5",
              backgroundColor: "rgba(29,122,245,0.1)",
              borderWidth: 2,
              fill: true,
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              display: true,
              ticks: { maxTicksLimit: 6, color: "#7b8ea8", font: { size: 10 } },
              grid: { display: false },
            },
            y: {
              display: true,
              min: 0,
              max: 100,
              ticks: {
                stepSize: 25,
                color: "#7b8ea8",
                font: { size: 10 },
                callback: (v) => v + "%",
              },
              grid: { color: "rgba(255,255,255,0.05)" },
            },
          },
        },
      });
    }, 50 * i);
  });
}

/* ──────────────────────────────────────────────
   VIEW: POZOS LIST
────────────────────────────────────────────── */
let _pzFilter = "all",
  _pzSearch = "";

on("pozos", async () => {
  showLoading("Cargando pozos...");
  await DB.loadPozos().catch(() => {});
  hideLoading();
  renderPozosList();

  el("pz-search").oninput = (e) => {
    _pzSearch = e.target.value.toLowerCase();
    renderPozosList();
  };
  el("pz-filter-btn").onclick = (e) => {
    e.stopPropagation();
    el("pz-filter-menu").classList.toggle("hidden");
  };
  $$(".dropdown-item", el("pz-filter-menu")).forEach((b) =>
    b.addEventListener("click", () => {
      _pzFilter = b.dataset.f;
      $$(".dropdown-item", el("pz-filter-menu")).forEach((x) =>
        x.classList.toggle("active", x === b),
      );
      el("pz-filter-menu").classList.add("hidden");
      renderPozosList();
    }),
  );
});

function renderPozosList() {
  let list = DB.getPozos();
  if (_pzFilter !== "all") list = list.filter((p) => p.estado === _pzFilter);
  if (_pzSearch)
    list = list.filter((p) => p.nombre.toLowerCase().includes(_pzSearch));

  const tbody = el("pz-tbody");
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--txt3);padding:2rem">${_t("Sin resultados")}</td></tr>`;
    el("pz-count").textContent = _t("Mostrando 0 pozos");
    return;
  }

  tbody.innerHTML = list
    .map(
      (p) => `
    <tr data-nombre="${p.nombre}">
      <td>
        <div class="row-icon-wrap">
          <span class="row-derrick" style="color:var(--green)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
              <line x1="12" y1="2" x2="12" y2="22"/>
              <path d="M5 8h14M8 12h8"/>
              <path d="M7 5l5-3 5 3"/>
              <rect x="9" y="15" width="6" height="4" rx="1"/>
            </svg>
          </span>
          <span class="row-name">${p.nombre}</span>
        </div>
      </td>
      <td>${p.sector}</td>
      <td>${p.campo}</td>
      <td>${p.ts || "—"}</td>
      <td>${fmtStatusPozo(p.estado)}</td>
      <td class="td-arrow">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
      </td>
    </tr>`,
    )
    .join("");

  tbody
    .querySelectorAll("tr")
    .forEach((tr) =>
      tr.addEventListener("click", () =>
        navigate("pozo-detail", { nombre: tr.dataset.nombre }),
      ),
    );

  el("pz-count").textContent = _t("Mostrando 1 a {count} de {total} pozos")
    .replace("{count}", list.length)
    .replace("{total}", list.length);
  renderPagination("pz-pagination", list.length, 1);
}

/* ──────────────────────────────────────────────
   VIEW: POZO DETAIL
────────────────────────────────────────────── */
let _pdRange = "24H",
  _pdNombre = null;
let _pdCustomFrom = null,
  _pdCustomTo = null;

on("pozo-detail", async (params) => {
  _pdNombre = params.nombre;
  _pdRange = "24H";
  _pdCustomFrom = null;
  _pdCustomTo = null;
  showLoading("Cargando pozo...");
  await DB.loadPozos().catch(() => {});
  hideLoading();
  renderPozoDetail(_pdNombre, _pdRange);

  el("pd-back-btn").onclick = () => navigate("pozos");
  el("pd-pdf-btn").onclick = () => {
    el("pd-pdf-btn").textContent =
      SETTINGS.idioma === "en"
        ? "Generating..."
        : SETTINGS.idioma === "zh"
          ? "生成中..."
          : "Generando...";
    setTimeout(() => {
      try {
        generatePozoPDF(_pdNombre);
      } catch (e) {
        console.error(e);
        alert("Error al generar PDF: " + e.message);
      }
      el("pd-pdf-btn").innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg> ' +
        _t("Generar PDF");
    }, 50);
  };
  el("pd-refresh-btn").onclick = async () => {
    DB.forceRefresh();
    showLoading("Actualizando desde Google Sheets...");
    await DB.loadPozos();
    hideLoading();
    renderPozoDetail(_pdNombre, _pdRange, _pdCustomFrom, _pdCustomTo);
  };
  $$(".tr-btn[data-r]", el("pd-time-ranges")).forEach((b) =>
    b.addEventListener("click", () => {
      $$(".tr-btn", el("pd-time-ranges")).forEach((x) =>
        x.classList.remove("active"),
      );
      b.classList.add("active");
      _pdRange = b.dataset.r;
      _pdCustomFrom = null;
      _pdCustomTo = null;
      CHR.destroyAll();
      renderPozoDetail(_pdNombre, _pdRange);
    }),
  );

  // Calendar button
  const calBtn = el("pd-cal-btn");
  if (calBtn) {
    calBtn.onclick = () => {
      openDateRangePicker((from, to) => {
        _pdCustomFrom = from;
        _pdCustomTo = to;
        _pdRange = "CUSTOM";
        $$(".tr-btn", el("pd-time-ranges")).forEach((x) =>
          x.classList.remove("active"),
        );
        calBtn.classList.add("active");
        CHR.destroyAll();
        renderPozoDetail(_pdNombre, "CUSTOM", from, to);
      });
    };
  }
});

function renderPozoDetail(nombre, range, customFrom, customTo) {
  CHR.destroyAll();
  const latest = DB.getPozoLatest(nombre);
  if (!latest) {
    el("pd-metrics").innerHTML =
      '<p style="color:var(--txt3)">Sin datos disponibles.</p>';
    el("pd-charts").innerHTML = "";
    return;
  }

  const hours = rangeHours(range);
  const hist =
    range === "CUSTOM" && customFrom && customTo
      ? DB.getPozoHistoryRange(nombre, customFrom, customTo)
      : DB.getPozoHistory(nombre, hours);
  const isNormal = latest.texto === "Normal";

  // Header
  el("pd-title").textContent = nombre;
  el("pd-status").textContent = isNormal
    ? "● " + _t("En producción")
    : "● " + _t("Advertencia");
  el("pd-status").className = "status-pill " + (isNormal ? "green" : "orange");
  const geo = DB.GEO_POZOS[nombre];
  el("pd-loc").textContent = geo ? geo.sector : "Ébano";
  el("pd-update").textContent =
    `${_t("Última actualización")}: ${latest.ts || "—"}`;
  const now = new Date();
  el("pd-date").textContent = now.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  el("pd-time").textContent = now.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // 7 Metric cards (PTP, Torque, Corriente, Temperatura, Voltaje L-L, Frecuencia, RPM)
  const avgPTP = avg(hist, "ptp");
  const avgPAR = avg(hist, "par");
  const avgI = avg(hist, "I");
  const avgTemp = avg(hist, "temp");
  const avgVLL = avg(hist, "vll");
  const avgFreq = avg(hist, "freq");
  const avgGRPM = avg(hist, "gRPM");

  function trend(cur, mean) {
    const pct = mean ? (((cur - mean) / mean) * 100).toFixed(1) : 0;
    const cls = pct >= 0 ? "up" : "dn";
    return `<span class="mc-trend ${cls}">↑ ${Math.abs(pct)}%</span>`;
  }

  el("pd-metrics").innerHTML = `
    <div class="metric-card">
      <div class="mc-top">
        <span class="mc-icon mc-presion">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
        </span>
        <span class="mc-label">${_t("Presión en TP")}</span>
      </div>
      <div class="mc-val">${latest.ptp.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<span>PSI</span></div>
      <div class="mc-bottom"><span class="mc-avg">${_t("Promedio")}: ${avgPTP.toFixed(0)} PSI</span>${trend(latest.ptp, avgPTP)}</div>
    </div>
    <div class="metric-card">
      <div class="mc-top">
        <span class="mc-icon mc-torque">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
        </span>
        <span class="mc-label">${_t("Torque")}</span>
      </div>
      <div class="mc-val">${latest.par.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<span>lb-ft</span></div>
      <div class="mc-bottom"><span class="mc-avg">${_t("Promedio")}: ${avgPAR.toFixed(0)} lb-ft</span>${trend(latest.par, avgPAR)}</div>
    </div>
    <div class="metric-card">
      <div class="mc-top">
        <span class="mc-icon mc-corriente">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/></svg>
        </span>
        <span class="mc-label">${_t("Corriente")}</span>
      </div>
      <div class="mc-val">${latest.I.toFixed(1)}<span>A</span></div>
      <div class="mc-bottom"><span class="mc-avg">${_t("Promedio")}: ${avgI.toFixed(1)} A</span>${trend(latest.I, avgI)}</div>
    </div>
    <div class="metric-card">
      <div class="mc-top">
        <span class="mc-icon mc-temp">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/></svg>
        </span>
        <span class="mc-label">${_t("Gen - Temperatura")}</span>
      </div>
      <div class="mc-val">${latest.temp.toFixed(1)}<span>°C</span></div>
      <div class="mc-bottom"><span class="mc-avg">${_t("Promedio")}: ${avgTemp.toFixed(1)} °C</span>${trend(latest.temp, avgTemp)}</div>
    </div>
    <div class="metric-card">
      <div class="mc-top">
        <span class="mc-icon mc-vll">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="10" rx="2" ry="2"/><line x1="22" y1="12" x2="22" y2="12"/><line x1="6" y1="11" x2="10" y2="11"/><line x1="14" y1="11" x2="18" y2="11"/></svg>
        </span>
        <span class="mc-label">${_t("Gen - Voltaje L-L")}</span>
      </div>
      <div class="mc-val">${latest.vll.toFixed(1)}<span>V</span></div>
      <div class="mc-bottom"><span class="mc-avg">${_t("Promedio")}: ${avgVLL.toFixed(1)} V</span>${trend(latest.vll, avgVLL)}</div>
    </div>
    <div class="metric-card">
      <div class="mc-top">
        <span class="mc-icon mc-freq">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
        </span>
        <span class="mc-label">${_t("Gen - Frecuencia")}</span>
      </div>
      <div class="mc-val">${latest.freq.toFixed(1)}<span>Hz</span></div>
      <div class="mc-bottom"><span class="mc-avg">${_t("Promedio")}: ${avgFreq.toFixed(1)} Hz</span>${trend(latest.freq, avgFreq)}</div>
    </div>
    <div class="metric-card">
      <div class="mc-top">
        <span class="mc-icon mc-gRPM">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
        </span>
        <span class="mc-label">${_t("Gen - RPM")}</span>
      </div>
      <div class="mc-val">${latest.gRPM.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}<span>RPM</span></div>
      <div class="mc-bottom"><span class="mc-avg">${_t("Promedio")}: ${avgGRPM.toFixed(0)} RPM</span>${trend(latest.gRPM, avgGRPM)}</div>
    </div>`;

  // Process charts (2x2)
  const chartDefs = [
    { title: "Presión en TP (PSI)", key: "ptp", color: "#4d9ffc" },
    { title: "Torque (lb-ft)", key: "par", color: "#c084fc" },
    { title: "Corriente (A)", key: "I", color: "#2ecc71" },
    { title: "Temperatura (°C)", key: "temp", color: "#f5a623" },
  ];

  // Generator charts
  const genChartDefs = [
    { title: "Voltaje L-L (V)", key: "vll", color: "#f1c40f" },
    { title: "Frecuencia (Hz)", key: "freq", color: "#00d2d3" },
    { title: "RPM Generador", key: "gRPM", color: "#f368e0" },
  ];

  const processHTML = chartDefs
    .map(
      (c, i) =>
        `<div class="chart-card">
      <div class="chart-card-title">${_t(c.title)}</div>
      <canvas id="pc-${i}" class="main-chart" height="200"></canvas>
      <div class="chart-legend">
        <span class="chart-legend-line" style="background:${c.color}"></span>
        ${_t(c.title)}
      </div>
    </div>`,
    )
    .join("");

  const genHTML = genChartDefs
    .map(
      (c, i) =>
        `<div class="chart-card">
      <div class="chart-card-title">${_t(c.title)}</div>
      <canvas id="gc-${i}" class="main-chart" height="200"></canvas>
      <div class="chart-legend">
        <span class="chart-legend-line" style="background:${c.color}"></span>
        ${_t(c.title)}
      </div>
    </div>`,
    )
    .join("");

  el("pd-charts").innerHTML =
    processHTML +
    `<div class="chart-section-header">${_t("Generador")}</div>` +
    `<div class="charts-3col">${genHTML}</div>`;

  chartDefs.forEach((c, i) => {
    const { labels, vals } = sampleSeries(hist, c.key);
    setTimeout(() => {
      CHR.create(`pc-${i}`, {
        type: "line",
        data: { labels, datasets: [makeDataset(vals, c.color)] },
        options: CHART_OPTS(c.color),
      });
    }, 50 * i);
  });

  genChartDefs.forEach((c, i) => {
    const { labels, vals } = sampleSeries(hist, c.key);
    setTimeout(
      () => {
        CHR.create(`gc-${i}`, {
          type: "line",
          data: { labels, datasets: [makeDataset(vals, c.color)] },
          options: CHART_OPTS(c.color),
        });
      },
      50 * (chartDefs.length + i),
    );
  });
}

/* ──────────────────────────────────────────────
   VIEW: MAPA
────────────────────────────────────────────── */
let _map = null;

on("mapa", async () => {
  showLoading("Cargando mapa...");
  await Promise.all([DB.loadERB(), DB.loadPozos(), DB.loadCoords()]).catch(
    () => {},
  );
  hideLoading();
  setTimeout(initMap, 120);
  el("ver-todos-btn").onclick = () => navigate("pozos");
});

function initMap() {
  const container = el("map-el");
  if (!container) return;

  if (_map) {
    _map.invalidateSize();
    renderMapMarkers();
    return;
  }

  _map = L.map("map-el", {
    center: [22.01, -98.4],
    zoom: 11,
    zoomControl: false,
  });
  L.control.zoom({ position: "bottomleft" }).addTo(_map);

  // Satellite tile (Google Hybrid: satellite + streets + labels)
  L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}", {
    attribution: "© Google Maps",
    maxZoom: 20,
  }).addTo(_map);

  renderMapMarkers();
}

function renderMapMarkers() {
  if (!_map) return;
  _map.eachLayer((l) => {
    if (l instanceof L.Marker) _map.removeLayer(l);
  });

  const estaciones = DB.getEstaciones();
  const pozos = DB.getPozos();

  let assetHTML = "";
  let count = 0;
  const bounds = L.latLngBounds();

  estaciones.forEach((s) => {
    const dot = s.estado === "online" ? "#2ecc71" : "#f39c12";
    const statusTxt = s.estado === "online" ? "En línea" : "Advertencia";
    const icon = L.divIcon({
      className: "",
      iconAnchor: [0, 0],
      html: `<div class="mkr-pill mkr-erb">
        <svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        ${s.nombre}
      </div>`,
    });
    const mk = L.marker([s.lat, s.lng], { icon }).addTo(_map);
    mk.bindPopup(
      `<b style="color:#4d9ffc">${s.nombre}</b><br/>${s.ubicacion}<br/>Estado: ${statusTxt}`,
    );
    mk.on("click", () =>
      navigate("erb-detail", { id: s.id, nombre: s.nombre }),
    );
    assetHTML += `<div class="asset-row" onclick="navigate('erb-detail',{id:'${s.id}',nombre:'${s.nombre}'})">
      <span class="asset-name">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4d9ffc" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        ${s.nombre}
      </span>
      <span class="asset-status" style="color:${dot}"><span class="asset-dot">●</span> ${statusTxt}</span>
    </div>`;
    bounds.extend([s.lat, s.lng]);
    count++;
  });

  pozos.forEach((p) => {
    const dot =
      p.estado === "online"
        ? "#2ecc71"
        : p.estado === "warning"
          ? "#f39c12"
          : "#4a5a6e";
    const statusTxt =
      p.estado === "online"
        ? "En producción"
        : p.estado === "warning"
          ? "Advertencia"
          : "En evaluación";
    const icon = L.divIcon({
      className: "",
      iconAnchor: [0, 0],
      html: `<div class="mkr-pill mkr-pz">
        <svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 8h14"/><path d="M7 5l5-3 5 3"/></svg>
        ${p.nombre}
      </div>`,
    });
    const mk = L.marker([p.lat, p.lng], { icon }).addTo(_map);
    const lt = p.latest || {};
    const popupRows = [
      lt.ptp != null
        ? `<tr><td>Presión TP</td><td><b>${lt.ptp.toFixed(0)} PSI</b></td></tr>`
        : "",
      lt.temp != null
        ? `<tr><td>Temperatura Gen.</td><td><b>${lt.temp.toFixed(1)} °C</b></td></tr>`
        : "",
      lt.vll != null
        ? `<tr><td>Voltaje L-L</td><td><b>${lt.vll.toFixed(1)} V</b></td></tr>`
        : "",
      lt.freq != null
        ? `<tr><td>Frecuencia</td><td><b>${lt.freq.toFixed(1)} Hz</b></td></tr>`
        : "",
      lt.gRPM != null
        ? `<tr><td>RPM Gen.</td><td><b>${lt.gRPM.toFixed(0)}</b></td></tr>`
        : "",
      lt.I != null
        ? `<tr><td>Corriente</td><td><b>${lt.I.toFixed(1)} A</b></td></tr>`
        : "",
      lt.par != null
        ? `<tr><td>Torque</td><td><b>${lt.par.toFixed(0)} lb-ft</b></td></tr>`
        : "",
    ]
      .filter(Boolean)
      .join("");
    mk.bindPopup(
      `<div class="map-popup">
        <div class="mp-head" style="color:#2ecc71">${p.nombre}</div>
        <div class="mp-sub">${p.sector} &bull; <span style="color:${dot}">● ${statusTxt}</span></div>
        ${popupRows ? `<table class="mp-table">${popupRows}</table>` : ""}
        <div style="margin-top:.5rem;text-align:right">
          <span class="mp-link" onclick="navigate('pozo-detail',{nombre:'${p.nombre}'})">Ver detalle →</span>
        </div>
      </div>`,
      { maxWidth: 260 },
    );
    mk.on("click", () => navigate("pozo-detail", { nombre: p.nombre }));
    assetHTML += `<div class="asset-row" onclick="navigate('pozo-detail',{nombre:'${p.nombre}'})">
      <span class="asset-name">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 8h14"/><path d="M7 5l5-3 5 3"/></svg>
        ${p.nombre}
      </span>
      <span class="asset-status" style="color:${dot}"><span class="asset-dot">●</span> ${statusTxt}</span>
    </div>`;
    bounds.extend([p.lat, p.lng]);
    count++;
  });

  if (count > 0) {
    _map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
  } else {
    // Default to Ebano, SLP
    _map.setView([22.215, -98.384], 11);
  }

  el("asset-list").innerHTML = assetHTML;
  el("asset-count").textContent = count;
}

/* ──────────────────────────────────────────────
   VIEW: AJUSTES
────────────────────────────────────────────── */
on("ajustes", () => renderAjustes());

function renderAjustes() {
  const s = SETTINGS;
  const t = (val) => (val ? "checked" : "");
  const sel = (val, opt) => (val === opt ? "selected" : "");
  // Translation helper
  const tr = (key) => {
    const dict = TRANSLATIONS[SETTINGS.idioma] || {};
    return dict[key] || key;
  };

  const isAdmin = CURRENT_USER && CURRENT_USER.rol === "administrador";

  el("ajustes-content").innerHTML = `

    <!-- ── TOP ROW: config cards ── -->
    <div class="aj-top-row">

      <!-- Tema e Idioma -->
      <div class="aj-card">
        <div class="aj-card-head">
          <span class="aj-card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg></span>
          <h3>${tr("Tema e Idioma")}</h3>
        </div>
        <div class="aj-row">
          <span class="aj-lbl">${tr("Tema")}</span>
          <select class="aj-select" onchange="SETTINGS.tema=this.value;saveSettings();applyTheme();">
            <option value="dark" ${sel(s.tema, "dark")}>${tr("Oscuro")}</option>
            <option value="light" ${sel(s.tema, "light")}>${tr("Claro")}</option>
          </select>
        </div>
        <div class="aj-row">
          <span class="aj-lbl">${tr("Idioma")}</span>
          <select class="aj-select" onchange="SETTINGS.idioma=this.value;saveSettings();applyLang();">
            <option value="es" ${sel(s.idioma, "es")}>${tr("Español")}</option>
            <option value="en" ${sel(s.idioma, "en")}>${tr("Inglés")}</option>
            <option value="zh" ${sel(s.idioma, "zh")}>${tr("Chino")}</option>
          </select>
        </div>
      </div>

      ${
        isAdmin
          ? `
      <!-- Configuración de Tanques -->
      <div class="aj-card">
        <div class="aj-card-head">
          <span class="aj-card-icon" style="color:#4d9ffc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="7" rx="9" ry="4"/><path d="M3 7v5c0 2.2 4 4 9 4s9-1.8 9-4V7"/><path d="M3 12v5c0 2.2 4 4 9 4s9-1.8 9-4v-5"/></svg></span>
          <h3>🛢️ ${tr("Configuración de Tanques")}</h3>
        </div>
        <div class="aj-row"><span class="aj-lbl">Capacidad máxima</span><input type="number" class="aj-input" style="width:75px" value="${s.tanques.capacidadMax}" onchange="SETTINGS.tanques.capacidadMax=parseFloat(this.value)||0;saveSettings()"></div>
        <div class="aj-row"><span class="aj-lbl">Capacidad operativa</span><input type="number" class="aj-input" style="width:75px" value="${s.tanques.capacidadOp}" onchange="SETTINGS.tanques.capacidadOp=parseFloat(this.value)||0;saveSettings()"></div>
        <div class="aj-row"><span class="aj-lbl">Nivel crítico</span><input type="number" class="aj-input" style="width:75px" value="${s.tanques.nivelCritico}" onchange="SETTINGS.tanques.nivelCritico=parseFloat(this.value)||0;saveSettings()"></div>
        <div class="aj-row"><span class="aj-lbl">Nivel de advertencia</span><input type="number" class="aj-input" style="width:75px" value="${s.tanques.nivelAdvertencia}" onchange="SETTINGS.tanques.nivelAdvertencia=parseFloat(this.value)||0;saveSettings()"></div>
        <div class="aj-row"><span class="aj-lbl">Color de indicadores</span><input type="color" class="aj-input" style="padding:2px;width:44px;height:26px;cursor:pointer" value="${s.tanques.colorIndicadores}" onchange="SETTINGS.tanques.colorIndicadores=this.value;saveSettings()"></div>
      </div>
      `
          : ""
      }
    </div>

    <!-- ── FULL-WIDTH: Usuarios y Roles ── -->
    <div class="aj-card" style="padding:1.25rem 1.3rem">
      <div class="aj-card-head">
        <span class="aj-card-icon" style="color:#e74c3c"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></span>
        <h3>👥 ${tr("Usuarios y Roles")}</h3>
        <span style="margin-left:auto;font-size:.8rem;color:var(--txt2)">${tr("Usuario actual")}: <strong style="color:var(--txt)">${CURRENT_USER ? CURRENT_USER.nombre : "Invitado"}</strong> <span style="color:var(--txt3)">(${CURRENT_USER ? tr(CURRENT_USER.rol.charAt(0).toUpperCase() + CURRENT_USER.rol.slice(1)) : "Sin rol"})</span></span>
      </div>

      ${
        CURRENT_USER && CURRENT_USER.rol === "administrador"
          ? `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem">
          <h4 style="font-size:.85rem;font-weight:600;color:var(--txt2)">${tr("Lista de usuarios")}</h4>
          <button class="aj-btn" style="background:var(--blue);color:#fff;border:none;padding:.4rem .9rem" onclick="window.openAddUsersModal()">+ ${tr("Agregar Usuario")}</button>
        </div>
        <div class="user-list-container">
          <table class="user-table">
            <thead>
              <tr>
                <th>${tr("Nombre")}</th>
                <th>${tr("Correo")}</th>
                <th>${tr("Contraseña")}</th>
                <th>${tr("Rol")}</th>
                <th style="width:50px;text-align:center"></th>
              </tr>
            </thead>
            <tbody>
              ${DB.getUsuarios()
                .map(
                  (u) => `
                <tr>
                  <td><strong>${u.nombre}</strong></td>
                  <td>${u.correo}</td>
                  <td><span style="font-family:monospace;letter-spacing:1px" title="${u.password}">${u.password}</span></td>
                  <td>
                    <select class="user-role-select" onchange="DB.updateUsuarioRole('${u.correo}', this.value); renderAjustes(); applyLang();">
                      <option value="administrador" ${sel(u.rol, "administrador")}>${tr("Administrador")}</option>
                      <option value="supervisor" ${sel(u.rol, "supervisor")}>${tr("Supervisor")}</option>
                      <option value="operador" ${sel(u.rol, "operador")}>${tr("Operador")}</option>
                      <option value="visitante" ${sel(u.rol, "visitante")}>${tr("Visitante")}</option>
                    </select>
                  </td>
                  <td style="text-align:center">
                    <button class="btn-delete-user" ${u.correo === CURRENT_USER.correo ? "disabled" : ""} onclick="if(confirm('¿Eliminar usuario ${u.nombre}?')) { DB.deleteUsuario('${u.correo}'); renderAjustes(); applyLang(); }" title="${tr("Eliminar usuario")}">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `
          : `
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem 2rem">
          <div class="aj-row"><span class="aj-lbl">${tr("Administrador")}</span><span class="aj-val" style="color:var(--txt3)">${tr("Acceso total") || "Acceso total"}</span></div>
          <div class="aj-row"><span class="aj-lbl">${tr("Supervisor")}</span><span class="aj-val" style="color:var(--txt3)">${tr("Acceso lectura/escritura") || "Acceso lectura/escritura"}</span></div>
          <div class="aj-row"><span class="aj-lbl">${tr("Operador")}</span><span class="aj-val" style="color:var(--txt3)">${tr("Acceso lectura limitada") || "Acceso lectura limitada"}</span></div>
          <div class="aj-row"><span class="aj-lbl">${tr("Visitante")}</span><span class="aj-val" style="color:var(--txt3)">${tr("Solo lectura") || "Solo lectura"}</span></div>
        </div>

        <div style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border)">
          <h4 style="font-size:.85rem;font-weight:600;color:var(--txt2);margin-bottom:.6rem">${tr("Permisos de su rol actual")}:</h4>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem 2rem">
            <div class="aj-row"><span class="aj-lbl">${tr("Ver datos")}</span><span class="aj-val" style="color:var(--green)">✓ ${tr("Permitido")}</span></div>
            <div class="aj-row"><span class="aj-lbl">${tr("Editar configuraciones")}</span><span class="aj-val" style="color:${CURRENT_USER && CURRENT_USER.rol === "administrador" ? 'var(--green)">✓ ' + tr("Permitido") : 'var(--red)">✗ ' + tr("Denegado")}</span></div>
            <div class="aj-row"><span class="aj-lbl">${tr("Exportar reportes")}</span><span class="aj-val" style="color:var(--green)">✓ ${tr("Permitido")}</span></div>
            <div class="aj-row"><span class="aj-lbl">${tr("Gestionar usuarios")}</span><span class="aj-val" style="color:${CURRENT_USER && CURRENT_USER.rol === "administrador" ? 'var(--green)">✓ ' + tr("Permitido") : 'var(--red)">✗ ' + tr("Denegado")}</span></div>
          </div>
        </div>
      `
      }
    </div>

    <!-- ── FULL-WIDTH: Seguridad ── -->
    ${
      isAdmin
        ? `
    <div class="aj-card" style="padding:1.25rem 1.3rem">
      <div class="aj-card-head">
        <span class="aj-card-icon" style="color:#9e9e9e"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>
        <h3>🔒 ${tr("Seguridad")}</h3>
      </div>
      <div class="aj-row"><span class="aj-lbl">Historial de accesos</span><button class="aj-btn" style="background:rgba(29,122,245,.1);border-color:var(--blue);color:var(--blue-l);font-weight:600" onclick="window.openAccessHistoryModal()">🔍 Ver historial</button></div>
      <div class="aj-row"><span class="aj-lbl">Versión del sistema</span><span class="aj-val" style="color:var(--txt3)">1.0.0</span></div>
      <div class="aj-row">
        <span class="aj-lbl" style="color:var(--red);font-weight:600">${tr("Cerrar sesión") || "Cerrar sesión"}</span>
        <button class="aj-btn" style="border-color:var(--red);color:var(--red);font-weight:600" onclick="if(confirm(SETTINGS.idioma==='en'?'Do you want to sign out?':SETTINGS.idioma==='zh'?'您要退出登录吗？':'¿Desea cerrar sesión?')){localStorage.removeItem('tn_logged_user');window.location.reload();}">Salir</button>
      </div>
    </div>
    `
        : `
    <div class="aj-card" style="padding:1.25rem 1.3rem">
      <div class="aj-card-head">
        <span class="aj-card-icon" style="color:#9e9e9e"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></span>
        <h3>${tr("Cerrar sesión") || "Cerrar sesión"}</h3>
      </div>
      <div class="aj-row">
        <span class="aj-lbl" style="color:var(--red);font-weight:600">${tr("Cerrar sesión") || "Cerrar sesión"}</span>
        <button class="aj-btn" style="border-color:var(--red);color:var(--red);font-weight:600" onclick="if(confirm(SETTINGS.idioma==='en'?'Do you want to sign out?':SETTINGS.idioma==='zh'?'您要退出登录吗？':'¿Desea cerrar sesión?')){localStorage.removeItem('tn_logged_user');window.location.reload();}">Salir</button>
      </div>
    </div>
    `
    }
  `;
}

/* ─── ADD USERS MODAL AND HANDLERS ─── */

window.openAddUsersModal = function () {
  const tr = (key) => {
    const dict = TRANSLATIONS[SETTINGS.idioma] || {};
    return dict[key] || key;
  };

  let modal = el("add-users-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "add-users-modal";
    modal.className = "modal-overlay";
    modal.innerHTML = `
      <div class="modal-content" style="max-width:500px">
        <div class="modal-header">
          <h3 id="mu-title">${tr("Agregar Usuarios")}</h3>
          <button class="modal-close-btn" onclick="el('add-users-modal').classList.add('hidden')">&times;</button>
        </div>
        <div class="modal-body" style="padding:1.25rem">
          <div class="user-form-tabs">
            <button class="user-form-tab active" id="tab-single" onclick="window.switchUserFormTab('single')">${tr("Individual")}</button>
            <button class="user-form-tab" id="tab-bulk" onclick="window.switchUserFormTab('bulk')">${tr("Lote (Múltiple)")}</button>
          </div>
          
          <!-- Single User Form -->
          <div id="form-single" style="display:flex;flex-direction:column;gap:0.75rem">
            <div>
              <label style="font-size:0.78rem;color:var(--txt2);display:block;margin-bottom:0.25rem">${tr("Nombre Completo")}</label>
              <input type="text" id="mu-name" class="aj-input" style="width:100%" placeholder="Ej. Juan Pérez">
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--txt2);display:block;margin-bottom:0.25rem">${tr("Correo Electrónico")}</label>
              <input type="email" id="mu-email" class="aj-input" style="width:100%" placeholder="ejemplo@deppg.com">
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--txt2);display:block;margin-bottom:0.25rem">${tr("Contraseña")}</label>
              <input type="text" id="mu-pass" class="aj-input" style="width:100%" placeholder="${tr("Contraseña temporal")}">
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--txt2);display:block;margin-bottom:0.25rem">${tr("Rol del Usuario")}</label>
              <select id="mu-role" class="aj-select" style="width:100%">
                <option value="supervisor" selected>${tr("Supervisor")}</option>
                <option value="administrador">${tr("Administrador")}</option>
                <option value="operador">${tr("Operador")}</option>
                <option value="visitante">${tr("Visitante")}</option>
              </select>
            </div>
          </div>
          
          <!-- Bulk User Form -->
          <div id="form-bulk" style="display:none;flex-direction:column;gap:0.75rem">
            <div>
              <label style="font-size:0.78rem;color:var(--txt2);display:block;margin-bottom:0.25rem">${tr("Rol por Defecto")}</label>
              <select id="mub-role" class="aj-select" style="width:100%">
                <option value="supervisor" selected>${tr("Supervisor")}</option>
                <option value="administrador">${tr("Administrador")}</option>
                <option value="operador">${tr("Operador")}</option>
                <option value="visitante">${tr("Visitante")}</option>
              </select>
            </div>
            <div>
              <label style="font-size:0.78rem;color:var(--txt2);display:block;margin-bottom:0.25rem">${tr("Usuarios y Contraseñas (Uno por línea)")}</label>
              <textarea id="mub-text" class="bulk-textarea" placeholder="Lupita Borrego    ContraseñaPru&#10;Edgar Gomez       ContraseñaOtro"></textarea>
              <p class="bulk-desc">${tr("Pegue una lista. Formato: Nombre y Contraseña separados por un tabulador o espacio. El correo se autogenerará.")}</p>
            </div>
          </div>

          <div id="add-users-feedback"></div>

          <div style="display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1.25rem;border-top:1px solid var(--border);padding-top:1rem">
            <button class="aj-btn" onclick="el('add-users-modal').classList.add('hidden')">${tr("Cancelar")}</button>
            <button class="aj-btn" style="background:var(--blue);color:#fff;border:none" onclick="window.saveUsersFromModal()">${tr("Agregar")}</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  // Reset fields
  el("mu-name").value = "";
  el("mu-email").value = "";
  el("mu-pass").value = "";
  el("mu-role").value = "supervisor";
  el("mub-role").value = "supervisor";
  el("mub-text").value = "";
  el("add-users-feedback").innerHTML = "";

  window.switchUserFormTab("single");
  modal.classList.remove("hidden");
};

window.switchUserFormTab = function (type) {
  const tr = (key) => {
    const dict = TRANSLATIONS[SETTINGS.idioma] || {};
    return dict[key] || key;
  };
  if (type === "single") {
    el("tab-single").classList.add("active");
    el("tab-bulk").classList.remove("active");
    el("form-single").style.display = "flex";
    el("form-bulk").style.display = "none";
    window._addUsersType = "single";
  } else {
    el("tab-single").classList.remove("active");
    el("tab-bulk").classList.add("active");
    el("form-single").style.display = "none";
    el("form-bulk").style.display = "flex";
    window._addUsersType = "bulk";
  }
};

window.saveUsersFromModal = function () {
  const feedback = el("add-users-feedback");
  feedback.innerHTML = "";

  if (window._addUsersType === "single") {
    const nombre = el("mu-name").value.trim();
    const email = el("mu-email").value.trim();
    const pass = el("mu-pass").value.trim();
    const role = el("mu-role").value;

    if (!nombre || !email || !pass) {
      feedback.innerHTML = `<div class="user-errors-box">Por favor, rellene todos los campos.</div>`;
      return;
    }

    try {
      DB.addUsuario({ nombre, correo: email, password: pass, rol: role });
      renderAjustes();
      applyLang();
      el("add-users-modal").classList.add("hidden");
    } catch (e) {
      feedback.innerHTML = `<div class="user-errors-box">${e.message}</div>`;
    }
  } else {
    const text = el("mub-text").value;
    const defaultRole = el("mub-role").value;

    if (!text.trim()) {
      feedback.innerHTML = `<div class="user-errors-box">Por favor, ingrese el texto de los usuarios.</div>`;
      return;
    }

    const res = DB.addUsuariosBulk(text, defaultRole);
    renderAjustes();
    applyLang();

    if (res.errors.length > 0) {
      feedback.innerHTML = `
        <div class="user-errors-box">
          <h4>Errores (${res.errors.length}):</h4>
          <ul>
            ${res.errors.map((err) => `<li>${err}</li>`).join("")}
          </ul>
        </div>
        ${res.added.length > 0 ? `<div class="user-success-box">Se agregaron con éxito ${res.added.length} usuarios.</div>` : ""}
      `;
    } else {
      el("add-users-modal").classList.add("hidden");
    }
  }
};

/* ──────────────────────────────────────────────
   PAGINATION
────────────────────────────────────────────── */
function renderPagination(containerId, total, current) {
  const el_ = el(containerId);
  if (!el_) return;
  const pageSvgL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15,18 9,12 15,6"/></svg>`;
  const pageSvgR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"/></svg>`;
  const pageSvgLL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11,17 6,12 11,7"/><polyline points="18,17 13,12 18,7"/></svg>`;
  const pageSvgRR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13,17 18,12 13,7"/><polyline points="6,17 11,12 6,7"/></svg>`;

  el_.innerHTML = `
    <button class="pg-btn" ${current <= 1 ? "disabled" : ""}>${pageSvgLL}</button>
    <button class="pg-btn" ${current <= 1 ? "disabled" : ""}>${pageSvgL}</button>
    <button class="pg-btn active">${current}</button>
    <button class="pg-btn" ${total <= 1 ? "disabled" : ""}>${pageSvgR}</button>
    <button class="pg-btn" ${total <= 1 ? "disabled" : ""}>${pageSvgRR}</button>
  `;
}

/* ──────────────────────────────────────────────
   TANK DETAILS MODAL
────────────────────────────────────────────── */
function openTankChartModal(index) {
  const d = DB.getERBDetalle();
  if (!d) return;
  const t = d.tanks[index];
  if (!t) return;

  const modal = el("chart-modal");
  el("modal-title").textContent = `Histórico de Nivel - Tanque ${t.nombre}`;
  modal.classList.remove("hidden");

  const hours = rangeHours(_erbRange);
  const history = DB.getERBHistory(hours);
  const chartKeys = ["pct601", "pct602", "pct741"];
  const key = chartKeys[index];
  const { labels, vals } = sampleSeries(history, key);

  CHR.create("modal-chart", {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: `Nivel % (${t.nombre})`,
          data: vals,
          borderColor: "#1d7af5",
          backgroundColor: "rgba(29,122,245,0.15)",
          borderWidth: 3,
          fill: true,
          tension: 0.3,
          pointRadius: 2,
          pointHoverRadius: 6,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, labels: { color: "#7b8ea8" } },
      },
      scales: {
        x: {
          display: true,
          ticks: { color: "#7b8ea8", font: { size: 11 } },
          grid: { color: "rgba(255,255,255,0.03)" },
        },
        y: {
          display: true,
          min: 0,
          max: 100,
          ticks: {
            color: "#7b8ea8",
            font: { size: 11 },
            callback: (v) => v + "%",
          },
          grid: { color: "rgba(255,255,255,0.06)" },
        },
      },
    },
  });

  const close = () => {
    modal.classList.add("hidden");
    CHR.destroy("modal-chart");
  };
  el("modal-close-btn").onclick = close;
  modal.onclick = (e) => {
    if (e.target === modal) close();
  };

  const escHandler = (e) => {
    if (e.key === "Escape") {
      close();
      document.removeEventListener("keydown", escHandler);
    }
  };
  document.addEventListener("keydown", escHandler);
}
window.openTankChartModal = openTankChartModal;

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
async function init() {
  /* Apply persisted theme/language immediately */
  applyTheme();
  applyLang();

  // Restore saved session if exists
  try {
    const savedUser = JSON.parse(localStorage.getItem("tn_logged_user"));
    if (savedUser) {
      CURRENT_USER = savedUser;
      el("topbar-user").innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>${savedUser.nombre.split(" ")[0]}</span>
      `;
      el("view-login").style.display = "none";
      el("app").classList.remove("hidden");

      DB.loadUsuarios().then((users) => {
        const latestUser = users.find(u => u.correo.toLowerCase() === savedUser.correo.toLowerCase());
        if (latestUser) {
          CURRENT_USER = latestUser;
          localStorage.setItem("tn_logged_user", JSON.stringify(latestUser));
          el("topbar-user").innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>${latestUser.nombre.split(" ")[0]}</span>
          `;
        }
      }).catch(console.warn);

      Promise.all([DB.loadCoords(), DB.loadERB(), DB.loadPozos()]).catch(
        console.warn,
      );
      navigate("home");
      logAccessEvent(savedUser);
    }
  } catch (e) {
    console.error("[Session] Error restoring session:", e);
  }

  // Bind logout / profile click handler
  el("topbar-user").onclick = (e) => {
    e.preventDefault();
    if (!CURRENT_USER) return;
    const msg =
      SETTINGS.idioma === "en"
        ? `User Profile:\n\nName: ${CURRENT_USER.nombre}\nRole: ${CURRENT_USER.rol}\n\nDo you want to sign out?`
        : SETTINGS.idioma === "zh"
          ? `用户个人资料：\n\n姓名：${CURRENT_USER.nombre}\n角色：${CURRENT_USER.rol}\n\n您要退出登录吗？`
          : `Perfil de Usuario:\n\nNombre: ${CURRENT_USER.nombre}\nRol: ${CURRENT_USER.rol}\n\n¿Desea cerrar sesión?`;

    if (confirm(msg)) {
      localStorage.removeItem("tn_logged_user");
      window.location.reload();
    }
  };

  /* Login */
  el("eye-btn").onclick = () => {
    const i = el("l-pass");
    i.type = i.type === "password" ? "text" : "password";
  };

  el("btn-login").onclick = async () => {
    console.log("[Login] Inicio de sesión iniciado");
    const btn = el("btn-login");
    const email = el("l-email").value.trim();
    const pass = el("l-pass").value.trim();
    console.log("[Login] Email ingresado:", email);

    // Clear any previous error
    const prevErr = document.getElementById("login-err-msg");
    if (prevErr) prevErr.remove();

    const showErr = (msg) => {
      btn.textContent = "Iniciar sesión";
      btn.disabled = false;
      btn.insertAdjacentHTML(
        "afterend",
        `<p id="login-err-msg" style="color:#e74c3c;font-size:.85rem;margin-top:.75rem;text-align:center">${msg}</p>`,
      );
    };

    if (!email || !pass) {
      showErr(
        SETTINGS.idioma === "en"
          ? "Please enter email and password."
          : SETTINGS.idioma === "zh"
            ? "请输入邮箱和密码。"
            : "Por favor ingrese correo y contraseña.",
      );
      return;
    }

    btn.innerHTML = `<span style="display:inline-flex;align-items:center;gap:.5rem">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation:spin 1s linear infinite">
        <path d="M21 12a9 9 0 1 1-9-9"/>
      </svg>
      Verificando...
    </span>`;
    btn.disabled = true;

    try {
      console.log("[Login] Llamando a DB.loadUsuarios...");
      await DB.loadUsuarios();
      console.log("[Login] DB.loadUsuarios cargado");
    } catch (e) {
      console.error("[Login] Error cargando usuarios:", e);
    }

    let users = [];
    try {
      users = DB.getUsuarios();
      console.log("[Login] Usuarios obtenidos:", users ? users.length : 0);
    } catch (e) {
      console.error("[Login] Error al obtener usuarios de DB:", e);
    }

    if (!users || users.length === 0) {
      showErr(
        SETTINGS.idioma === "en"
          ? "⚠ Could not connect to database. Please try again."
          : SETTINGS.idioma === "zh"
            ? "⚠ 无法连接数据库，请重试。"
            : "⚠ No se pudo conectar con la base de datos. Intente de nuevo.",
      );
      return;
    }

    let user = null;
    try {
      user = DB.authenticate(email, pass);
      console.log("[Login] Resultado autenticación:", user ? "Éxito" : "Fallo");
    } catch (e) {
      console.error("[Login] Error en DB.authenticate:", e);
    }
    if (!user) {
      showErr(
        SETTINGS.idioma === "en"
          ? "Incorrect email or password."
          : SETTINGS.idioma === "zh"
            ? "邮箱或密码错误。"
            : "Correo o contraseña incorrectos.",
      );
      return;
    }

    // Success
    CURRENT_USER = user;
    try {
      localStorage.setItem("tn_logged_user", JSON.stringify(user));
    } catch (e) {
      console.error("[Session] Error saving user session:", e);
    }

    el("topbar-user").innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
      <span>${user.nombre.split(" ")[0]}</span>
    `;

    el("view-login").style.display = "none";
    el("app").classList.remove("hidden");

    // Preload coords and data in background
    Promise.all([DB.loadCoords(), DB.loadERB(), DB.loadPozos()]).catch(
      console.warn,
    );

    navigate("home");
    logAccessEvent(user);
  };

  el("l-pass").addEventListener("keydown", (e) => {
    if (e.key === "Enter") el("btn-login").click();
  });
  el("l-email").addEventListener("keydown", (e) => {
    if (e.key === "Enter") el("l-pass").focus();
  });

  /* Nav */
  $$(".nav-btn[data-view], .tab-btn[data-view]").forEach((b) =>
    b.addEventListener("click", () => {
      closeSidebar();
      navigate(b.dataset.view);
    }),
  );

  // Bind logo click to navigate to home view
  const logoWrap = document.querySelector(".sidebar-logo-wrap");
  if (logoWrap) {
    logoWrap.style.cursor = "pointer";
    logoWrap.onclick = () => {
      closeSidebar();
      navigate("home");
    };
  }

  /* Mobile sidebar */
  const sb = el("sidebar");
  const overlay = el("sb-overlay");
  el("hamburger-btn").onclick = () => {
    sb.classList.toggle("open");
    overlay.classList.toggle("hidden");
  };
  overlay.onclick = closeSidebar;
  function closeSidebar() {
    sb.classList.remove("open");
    overlay.classList.add("hidden");
  }

  /* Close dropdowns on outside click */
  document.addEventListener("click", () => {
    document
      .querySelectorAll(".dropdown-menu")
      .forEach((m) => m.classList.add("hidden"));
  });

  /* Connection status */
  function updateConn() {
    const dots = document.querySelectorAll(".conn-dot");
    const lbls = document.querySelectorAll("#conn-label");
    const online = navigator.onLine;
    dots.forEach(
      (d) => (d.style.background = online ? "var(--green)" : "var(--txt3)"),
    );
    lbls.forEach(
      (l) => (l.textContent = online ? _t("Conectado") : _t("Sin conexión")),
    );
  }
  window.addEventListener("online", updateConn);
  window.addEventListener("offline", updateConn);
  updateConn();

  /* Service Worker */
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .catch((e) => console.warn("[SW]", e));
  }

  /* Track last rendered timestamps to prevent unnecessary redrawing and chart resetting */
  let lastRenderedErbTs = null;
  let lastRenderedPozosTs = null;

  /* Auto-refresh active view every 30s to keep live telemetry updated */
  setInterval(async () => {
    if (document.hidden || !CURRENT_USER) return;
    DB.invalidate(); // Invalidate cache safely without deleting rows, preventing data loss on slow/failed fetches

    try {
      if (_cur === "erb") {
        await DB.loadERB().catch(() => {});
        const latest = DB.getLatestERB();
        const ts = latest ? latest.ts : null;
        if (ts !== lastRenderedErbTs) {
          lastRenderedErbTs = ts;
          renderERBList();
        }
      } else if (_cur === "erb-detail") {
        await DB.loadERB().catch(() => {});
        const latest = DB.getLatestERB();
        const ts = latest ? latest.ts : null;
        if (ts !== lastRenderedErbTs) {
          lastRenderedErbTs = ts;
          renderERBDetail(_erbRange, _erbCustomFrom, _erbCustomTo);
        }
      } else if (_cur === "pozos") {
        await DB.loadPozos().catch(() => {});
        const latest = DB.getPozos();
        const ts = latest.length ? latest.map((p) => p.ts).join("|") : null;
        if (ts !== lastRenderedPozosTs) {
          lastRenderedPozosTs = ts;
          renderPozosList();
        }
      } else if (_cur === "pozo-detail" && _pdNombre) {
        await DB.loadPozos().catch(() => {});
        const latest = DB.getPozoLatest(_pdNombre);
        const ts = latest ? latest.ts : null;
        if (ts !== lastRenderedPozosTs) {
          lastRenderedPozosTs = ts;
          renderPozoDetail(_pdNombre, _pdRange, _pdCustomFrom, _pdCustomTo);
        }
      } else if (_cur === "mapa") {
        await Promise.all([
          DB.loadERB(),
          DB.loadPozos(),
          DB.loadCoords(),
        ]).catch(() => {});
        if (typeof renderMapMarkers === "function") renderMapMarkers();
      }
    } catch (e) {
      console.warn("[AutoRefresh] Failed to auto-update view:", e);
    }
  }, 30_000);
}

document.addEventListener("DOMContentLoaded", init);
