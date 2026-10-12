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
    // Home view stats
    activos: "active",
    total: "total",
    Hace: "ago",
    Hoy: "Today",
    "Sin datos": "No data",
    "Hace un momento": "Just now",
    "Cambiar mi contraseña": "Change my password",
    "Contraseña actual": "Current password",
    "Nueva contraseña (mín. 8)": "New password (min. 8)",
    "Confirmar contraseña": "Confirm password",
    Actualizar: "Update",
    "Restablecer contraseña": "Reset password",
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
    // Home view stats
    activos: "活跃",
    total: "总计",
    Hace: "前",
    Hoy: "今天",
    "Sin datos": "无数据",
    "Hace un momento": "刚刚",
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

/* Escape text before interpolating it into HTML. Anything that comes from the
   spreadsheets or the backend must go through this. */
function esc(v) {
  return String(v == null ? "" : v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ACCESS_HISTORY_KEY = "tn_access_history"; // localStorage cache key
const ACCESS_COOLDOWN_KEY = "tn_access_cooldown"; // timestamp of last log
const ACCESS_LOG_COOLDOWN = 5 * 60 * 1000; // 5 min between logs per device

function parseUA(ua) {
  let browser = "Desconocido";
  let os = "Desconocido";

  if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("OPR/") || ua.includes("Opera")) browser = "Opera";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/") && !ua.includes("Chrome")) browser = "Safari";
  else if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("MSIE") || ua.includes("Trident")) browser = "IE";

  if (ua.includes("Windows NT 10")) os = "Windows 10/11";
  else if (ua.includes("Windows NT 6.3")) os = "Windows 8.1";
  else if (ua.includes("Windows")) os = "Windows";
  else if (ua.includes("iPhone")) os = "iPhone (iOS)";
  else if (ua.includes("iPad")) os = "iPad (iPadOS)";
  else if (ua.includes("Android")) {
    const m = ua.match(/Android ([0-9.]+)/);
    os = m ? `Android ${m[1]}` : "Android";
  } else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Linux")) os = "Linux";

  const isMobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  const deviceType = isMobile ? "📱 Móvil" : "💻 Escritorio";
  return { browser, os, deviceType };
}

async function logAccessEvent(user) {
  // Cooldown: skip duplicate entries within 5 min on same device
  const lastTs = parseInt(localStorage.getItem(ACCESS_COOLDOWN_KEY) || "0", 10);
  const now = Date.now();
  if (now - lastTs < ACCESS_LOG_COOLDOWN) return;
  localStorage.setItem(ACCESS_COOLDOWN_KEY, String(now));

  const ua = navigator.userAgent;
  const { browser, os, deviceType } = parseUA(ua);

  const entry = {
    ts: now,
    usuario: user.nombre || "",
    correo: user.correo || "",
    rol: user.rol || "",
    dispositivo: `${deviceType} · ${browser}`,
    os: os,
    ip: "",
    ubicacion: "",
  };

  // Fetch geolocation async then POST to Apps Script
  try {
    const geoRes = await fetch("https://ipapi.co/json/", { cache: "no-store" });
    if (geoRes.ok) {
      const geo = await geoRes.json();
      entry.ip = geo.ip || "";
      entry.ubicacion =
        [geo.city, geo.region, geo.country_name].filter(Boolean).join(", ") ||
        "";
    }
  } catch (_) {
    /* no geo */
  }

  // POST to Google Apps Script (non-blocking). The server takes the identity
  // from the session token, not from this payload.
  API.call("logAcceso", {
    dispositivo: entry.dispositivo,
    os: entry.os,
    ip: entry.ip,
    ubicacion: entry.ubicacion,
  }).catch(() => {});

  // Also save locally as fallback
  try {
    const local = JSON.parse(localStorage.getItem(ACCESS_HISTORY_KEY) || "[]");
    local.push(entry);
    localStorage.setItem(ACCESS_HISTORY_KEY, JSON.stringify(local.slice(-50)));
  } catch (_) {}
}

/* ── build row HTML ── */
function _ahRow(e) {
  const d = new Date(e.ts);
  const fecha = d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const hora = d.toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const ok = (v) => v && v !== "Obteniendo..." && v !== "Sin datos" && v !== "";
  const ubicHtml = ok(e.ubicacion)
    ? `<span style="color:var(--green)">${esc(e.ubicacion)}</span>`
    : `<span style="color:var(--txt3)">${esc(e.ubicacion || "—")}</span>`;
  const ipHtml = ok(e.ip)
    ? `<span style="font-family:monospace">${esc(e.ip)}</span>`
    : `<span style="color:var(--txt3)">—</span>`;
  return `<tr>
    <td><div style="font-weight:600;font-size:.84rem">${fecha}</div>
        <div style="color:var(--txt3);font-size:.74rem">${hora}</div></td>
    <td><div style="font-size:.83rem">${esc(e.usuario || e.correo)}</div>
        <div style="color:var(--txt3);font-size:.72rem">${esc(e.correo)}</div></td>
    <td><div style="font-size:.83rem">${esc(e.dispositivo || "—")}</div>
        <div style="color:var(--txt3);font-size:.72rem">${esc(e.os || "")}</div></td>
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
    modal.id = "access-history-modal";
    modal.className = "modal-overlay";
    document.body.appendChild(modal);
  }

  _ahModalSkeleton(modal);
  modal.classList.remove("hidden");

  // Wire close handlers
  const closeModal = () => modal.classList.add("hidden");
  el("ah-close-btn").onclick = closeModal;
  el("ah-close-btn2").onclick = closeModal;
  modal.onclick = (ev) => {
    if (ev.target === modal) closeModal();
  };
  const ahEsc = (ev) => {
    if (ev.key === "Escape") {
      closeModal();
      document.removeEventListener("keydown", ahEsc);
    }
  };
  document.addEventListener("keydown", ahEsc);

  // Try to load from Apps Script (cloud), fall back to localStorage
  let logs = [];
  let source = "local";

  try {
    const res = await API.call("getAccesos");
    logs = res.accesos || [];
    source = "cloud";
  } catch (_) {
    /* fall through */
  }

  // Fallback: localStorage
  if (source === "local") {
    try {
      logs = JSON.parse(localStorage.getItem(ACCESS_HISTORY_KEY) || "[]");
      logs.sort((a, b) => (b.ts || 0) - (a.ts || 0));
    } catch (_) {
      logs = [];
    }
  }

  const tbody = el("ah-tbody");
  const subtitle = el("ah-subtitle");
  const countEl = el("ah-count");

  if (!tbody) return;

  if (logs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--txt3);padding:2.5rem">Sin registros de acceso aún.</td></tr>`;
  } else {
    tbody.innerHTML = logs.map(_ahRow).join("");
  }

  const srcLabel =
    source === "cloud"
      ? "📡 Todos los dispositivos · Google Sheets"
      : "⚠ Solo este dispositivo (sin conexión con el servidor)";
  if (subtitle) subtitle.textContent = srcLabel;
  if (countEl)
    countEl.textContent = `${logs.length} registro${logs.length !== 1 ? "s" : ""}`;
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

/* ERB E41: barriles por metro de nivel de TV-601, TV-602 y TV-741 */
const ERB_BBL_POR_M = [1092.953, 1066.058202, 840.1914];
const ERB_NIV_KEYS = ["niv601", "niv602", "niv741"];

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

  const welcomeEl = el("topbar-welcome");
  if (welcomeEl) {
    welcomeEl.classList.toggle("hidden", view !== "home");
  }

  // Update breadcrumb in topbar
  const info = TOPBAR_INFO[view] || { title: view, sub: "" };
  if (view === "erb-detail" && params.nombre) {
    el("topbar-title").innerHTML =
      `<span style="color:var(--txt2);cursor:pointer" id="bc-erb">${_t("E.R.B")}</span> <span style="color:var(--txt3)">›</span> ${esc(params.nombre)}`;
    setTimeout(
      () => el("bc-erb")?.addEventListener("click", () => navigate("erb")),
      0,
    );
  } else if (view === "pozo-detail" && params.nombre) {
    el("topbar-title").innerHTML =
      `<span style="color:var(--txt2);cursor:pointer" id="bc-pz">${_t("Pozos")}</span> <span style="color:var(--txt3)">›</span> ${esc(params.nombre)}`;
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
   VIEW: HOME
────────────────────────────────────────────── */
on("home", async () => {
  // Load data in background (don't block the view)
  Promise.all([
    DB.loadERB().catch(() => {}),
    DB.loadPozos().catch(() => {}),
  ]).then(() => {
    updateHomeStats();
  });

  // Show whatever is cached immediately while fresh data loads
  updateHomeStats();
});

function updateHomeStats() {
  const lastUpdateEl = document.getElementById("home-last-update");
  const devicesEl = document.getElementById("home-devices-count");
  if (!lastUpdateEl || !devicesEl) return;

  // ── Dispositivos conectados ──
  // Count unique active pozos + ERB stations
  const pozos = DB.getPozos();
  const estaciones = DB.getEstaciones();
  const activePozos = pozos.filter((p) => p.estado === "online").length;
  const activeERB = estaciones.filter(
    (e) => e.estado === "online" || e.estado === "warning"
  ).length;
  const totalActive = activePozos + activeERB;
  const totalAll = pozos.length + estaciones.length;

  if (totalAll === 0) {
    devicesEl.textContent = _t("Sin datos");
  } else {
    devicesEl.textContent = `${totalActive} ${_t("activos")} / ${totalAll} ${_t("total")}`;
  }

  // ── Última actualización ──
  // Pick the most recent timestamp from ERB or Pozos
  let latestDate = null;

  const latestERB = DB.getLatestERB();
  if (latestERB && latestERB.ts) {
    const d = DB.parseDate(latestERB.ts);
    if (d) latestDate = d;
  }

  pozos.forEach((p) => {
    if (p.ts) {
      const d = DB.parseDate(p.ts);
      if (d && (!latestDate || d > latestDate)) {
        latestDate = d;
      }
    }
  });

  if (!latestDate) {
    lastUpdateEl.textContent = _t("Sin datos");
  } else {
    const now = new Date();
    const diffMs = now - latestDate;
    const diffMin = Math.floor(diffMs / 60000);

    let timeStr;
    if (diffMin < 1) {
      timeStr = _t("Hace un momento");
    } else if (diffMin < 60) {
      timeStr = `${_t("Hace")} ${diffMin} min`;
    } else {
      // Format: "Hoy, 14:32" or "24 Jun, 14:32"
      const isToday =
        latestDate.getDate() === now.getDate() &&
        latestDate.getMonth() === now.getMonth() &&
        latestDate.getFullYear() === now.getFullYear();
      const hh = String(latestDate.getHours()).padStart(2, "0");
      const mm = String(latestDate.getMinutes()).padStart(2, "0");
      if (isToday) {
        timeStr = `${_t("Hoy")}, ${hh}:${mm}`;
      } else {
        const day = latestDate.getDate();
        const months = [
          "Ene","Feb","Mar","Abr","May","Jun",
          "Jul","Ago","Sep","Oct","Nov","Dic",
        ];
        timeStr = `${day} ${months[latestDate.getMonth()]}, ${hh}:${mm}`;
      }
    }
    lastUpdateEl.textContent = timeStr;
  }
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
    <tr data-id="${esc(s.id)}" data-nombre="${esc(s.nombre)}">
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
          <span class="row-name">${esc(s.nombre)}</span>
        </div>
      </td>
      <td>${esc(s.ubicacion)}</td>
      <td style="text-align:center">${esc(s.tanques)}</td>
      <td>${esc(s.ts || "—")}</td>
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
  await Promise.all([DB.loadERB().catch(() => {}), DB.loadResumen()]);
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
    await Promise.all([DB.loadERB().catch(() => {}), DB.loadResumen()]);
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

/* Rangos de más de 48 h salen del resumen por hora: pesa mucho menos que la
   telemetría cruda y cubre toda la historia. Si aún no carga, se usa la cruda. */
function erbHistorial(range, customFrom, customTo) {
  const custom = range === "CUSTOM" && customFrom && customTo;
  const to = custom ? customTo : new Date();
  const from = custom ? customFrom : new Date(to - rangeHours(range) * 3600e3);
  if (to - from > 48 * 3600e3) {
    const h = DB.getERBResumenHora(from, to);
    if (h.length) return h;
  }
  return custom
    ? DB.getERBHistoryRange(customFrom, customTo)
    : DB.getERBHistory(rangeHours(range));
}

function renderERBDetail(range, customFrom, customTo) {
  CHR.destroyAll();
  const d = DB.getERBDetalle();
  if (!d) return;

  // Header
  el("ed-title").textContent = d.nombre;
  const edStatus = {
    online: [_t("En línea"), "green"],
    warning: [_t("Advertencia"), "orange"],
    offline: [_t("Sin conexión"), "gray"],
  }[d.estado];
  el("ed-status").textContent = "● " + edStatus[0];
  el("ed-status").className = "status-pill " + edStatus[1];
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

  const history = erbHistorial(range, customFrom, customTo);
  const fresco = !DB.isStale(d.ts);
  const ultimas = DB.getERBUltimas(90);
  const tanks = d.tanks.map((t, i) => erbTanque(t, i, d, ultimas));

  renderERBAlarmas(tanks, fresco, d.ts);
  renderERBKpis(tanks, DB.getERBDiaEnCurso());
  el("ed-mimic").innerHTML = erbMimico(tanks, d, fresco);
  el("ed-faces").innerHTML = tanks.map(erbPlaca).join("");
  renderERBTendencia(history);
  renderERBCierre();
}

/* ── SCADA E41 ──
   Estilo HMI de alto desempeño: equipos en gris, color solo para lo anormal.
   Plumas validadas (contraste y daltonismo) sobre el fondo oscuro de la app. */
const ERB_PLUMAS = ["#3987e5", "#d95926", "#199e70"];
const ERB_NIVEL_MAX_M = 15; // lecturas fuera de (0, 15] m son falla del radar

const fmtBbl = (n) =>
  n == null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: 0 });
const fmtSigno = (n) => (n == null ? "—" : (n > 0 ? "+" : n < 0 ? "−" : "") + fmtBbl(Math.abs(n)));
const fmtHoras = (h) =>
  h < 1 ? `${Math.max(1, Math.round(h * 60))} min` : `${h.toFixed(h < 10 ? 1 : 0)} h`;

/* Tasa de cambio del tanque en bbl/h con la última hora de lecturas */
function erbTasa(rows, i) {
  const key = ERB_NIV_KEYS[i];
  const pts = rows
    .map((r) => ({ t: DB.parseDate(r.ts), v: r[key] }))
    .filter((p) => p.t && p.v > 0 && p.v <= ERB_NIVEL_MAX_M);
  if (pts.length < 10) return null;
  const fin = pts[pts.length - 1];
  const ini = pts.find((p) => fin.t - p.t <= 65 * 60e3);
  const horas = (fin.t - ini.t) / 3600e3;
  if (horas < 0.5) return null;
  return ((fin.v - ini.v) * ERB_BBL_POR_M[i]) / horas;
}

function erbTanque(t, i, d, ultimas) {
  const f = ERB_BBL_POR_M[i];
  const falla = !(t.nivel > 0 && t.nivel <= ERB_NIVEL_MAX_M);
  const umbH = d.umbH;
  const umbL = d.umbL;
  const cap = t.altMax * f;
  const bbl = falla ? null : t.nivel * f;
  const pct = falla ? null : (t.nivel / t.altMax) * 100;
  const tasa = falla ? null : erbTasa(ultimas, i);
  let estado = "normal";
  if (falla) estado = "falla";
  else if (t.alarmH || pct >= umbH) estado = "alta";
  else if (t.alarmL || pct <= umbL) estado = "baja";
  // Cuánto falta para llegar a un nivel de alarma al ritmo actual
  let eta = null;
  if (tasa != null && Math.abs(tasa) >= 20) {
    if (tasa > 0 && pct < umbH) eta = { a: "alto", h: ((umbH / 100) * cap - bbl) / tasa };
    if (tasa < 0 && pct > umbL) eta = { a: "bajo", h: (bbl - (umbL / 100) * cap) / -tasa };
    if (eta && eta.h > 48) eta = null; // a más de dos días no orienta la operación
  }
  return { ...t, i, color: ERB_PLUMAS[i], cap, bbl, pct, tasa, estado, eta, umbH, umbL, falla };
}

function renderERBAlarmas(tanks, fresco, ts) {
  const items = [];
  if (!fresco)
    items.push(["critica", `${_t("Sin datos de la estación desde")} ${ts || "—"}`]);
  tanks.forEach((t) => {
    if (t.estado === "alta")
      items.push(["alta", `${t.nombre}: ${_t("nivel alto")} — ${t.pct.toFixed(0)} % (AH ${t.umbH} %)`]);
    if (t.estado === "baja")
      items.push(["baja", `${t.nombre}: ${_t("nivel bajo")} — ${t.pct.toFixed(0)} % (AL ${t.umbL} %)`]);
    if (t.estado === "falla")
      items.push([
        "falla",
        `${t.nombre}: ${_t("sin lectura de nivel")} (${_t("el equipo reporta")} ${t.nivel} m). ${_t("Revisar sensor.")}`,
      ]);
  });
  const icono =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  el("ed-alarms").innerHTML = items.length
    ? items.map(([c, txt]) => `<div class="alm alm-${c}" role="status">${icono}<span>${esc(txt)}</span></div>`).join("")
    : `<div class="alm alm-ok" role="status">${_t("Sin alarmas activas")}</div>`;
}

function renderERBKpis(tanks, dia) {
  const vivos = tanks.filter((t) => !t.falla);
  const inv = vivos.reduce((a, t) => a + t.bbl, 0);
  const cap = vivos.reduce((a, t) => a + t.cap, 0);
  const conTasa = vivos.filter((t) => t.tasa != null);
  const neto = conTasa.length ? conTasa.reduce((a, t) => a + t.tasa, 0) : null;
  const tendencia =
    neto == null ? _t("Sin lecturas suficientes") : Math.abs(neto) < 20 ? _t("Estable") : neto > 0 ? _t("Llenando") : _t("Vaciando");
  el("ed-kpis").innerHTML = `
    <div class="kpi">
      <span class="kpi-lbl">${_t("Inventario en tanques")}</span>
      <span class="kpi-val">${fmtBbl(inv)}<small>bbl</small></span>
      <span class="kpi-sub">${cap ? ((inv / cap) * 100).toFixed(0) : "—"} % ${_t("de")} ${fmtBbl(cap)} bbl ${_t("con lectura")}</span>
    </div>
    <div class="kpi">
      <span class="kpi-lbl">${_t("Balance neto, última hora")}</span>
      <span class="kpi-val">${fmtSigno(neto)}<small>bbl/h</small></span>
      <span class="kpi-sub">${tendencia}</span>
    </div>
    <div class="kpi">
      <span class="kpi-lbl">${_t("Día operativo desde las 05:00")}</span>
      <span class="kpi-val kpi-pair">
        <span>${fmtBbl(dia && dia.recibido)}<small>${_t("recibido")}</small></span>
        <span>${fmtBbl(dia && dia.enviado)}<small>${_t("enviado")}</small></span>
      </span>
      <span class="kpi-sub">bbl, ${_t("por balance de nivel")}</span>
    </div>`;
}

/* Mímico: tanques a escala (alto = altura configurada, ancho ∝ √(bbl/m), es decir al diámetro) */
function erbMimico(tanks, d, fresco) {
  const W = 900;
  const base = 296;
  const mPx = 21;
  const cx = [185, 410, 630];
  const yRecibo = 40;
  const yBombeo = 344;
  let s = `<svg viewBox="0 0 ${W} 380" class="mimic-svg${fresco ? "" : " mimic-stale"}" role="img" aria-label="${_t("Esquema de la ERB E41 con el nivel de cada tanque")}">
    <defs>
      <pattern id="mimic-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <line x1="0" y1="0" x2="0" y2="9" class="mimic-hatch-line"/>
      </pattern>
    </defs>
    <path class="mimic-pipe" d="M24 ${yRecibo} H ${cx[2]}"/>
    <path class="mimic-arrow" d="M58 ${yRecibo - 6} l11 6 l-11 6 z"/>
    <text class="mimic-note" x="24" y="${yRecibo - 14}">${_t("Recibo de estaciones")}</text>`;

  let xMin = W;
  tanks.forEach((t, k) => {
    const w = Math.sqrt(ERB_BBL_POR_M[t.i]) * 5.2;
    const h = t.altMax * mPx;
    const x = cx[k] - w / 2;
    const y = base - h;
    const xs = x + w + 16;
    xMin = Math.min(xMin, xs);
    s += `<path class="mimic-pipe" d="M${cx[k]} ${yRecibo} V ${y - 12}"/>
      <path class="mimic-pipe" d="M${x + w} ${base - 12} H ${xs} V ${yBombeo}"/>
      <g class="mimic-tank est-${t.estado}">
        <path class="mimic-roof" d="M${x} ${y} L${cx[k]} ${y - 12} L${x + w} ${y} Z"/>
        <rect class="mimic-body" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
    if (t.falla) {
      s += `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" fill="url(#mimic-hatch)"/>
        <text class="mimic-val mimic-val-falla" x="${cx[k]}" y="${y + h / 2 + 6}" text-anchor="middle">${_t("SIN LECTURA")}</text>`;
    } else {
      const lh = h * Math.min(1, t.pct / 100);
      s += `<rect class="mimic-liquid" x="${x + 1.5}" y="${base - lh}" width="${w - 3}" height="${lh}"/>
        <line class="mimic-surface" x1="${x + 1.5}" x2="${x + w - 1.5}" y1="${base - lh}" y2="${base - lh}"/>
        <text class="mimic-val" x="${cx[k]}" y="${Math.min(base - 12, Math.max(y + 34, base - lh / 2 + 10))}" text-anchor="middle">${t.pct.toFixed(0)}<tspan class="mimic-unit"> %</tspan></text>`;
    }
    [["AH", t.umbH], ["AL", t.umbL]].forEach(([lbl, p]) => {
      const yy = base - (h * p) / 100;
      s += `<line class="mimic-limit" x1="${x - 9}" x2="${x}" y1="${yy}" y2="${yy}"/>
        <text class="mimic-limit-txt" x="${x - 13}" y="${yy + 4}" text-anchor="end">${lbl}</text>`;
    });
    s += `<circle cx="${cx[k] - 34}" cy="${base + 22}" r="5" fill="${t.color}"/>
        <text class="mimic-tag" x="${cx[k] - 24}" y="${base + 28}">${esc(t.nombre)}</text>
      </g>`;
  });

  s += `<path class="mimic-pipe" d="M${xMin} ${yBombeo} H ${W - 24}"/>
    <path class="mimic-arrow" d="M${W - 36} ${yBombeo - 6} l11 6 l-11 6 z"/>
    <text class="mimic-note" x="${W - 24}" y="${yBombeo + 26}" text-anchor="end">${_t("Bombeo a Cab. Cacalilao")}</text>`;

  // Indicadores de presión (símbolo ISA): 0 kg/cm² se toma como sin señal
  [["L1", d.presL1, 786], ["L2", d.presL2, 856]].forEach(([tag, v, x]) => {
    const ok = v > 0;
    s += `<g class="mimic-inst${ok ? "" : " sin-senal"}">
        <line class="mimic-tap" x1="${x}" x2="${x}" y1="${yBombeo}" y2="${yBombeo - 34}"/>
        <circle cx="${x}" cy="${yBombeo - 56}" r="22"/>
        <line class="mimic-inst-div" x1="${x - 22}" x2="${x + 22}" y1="${yBombeo - 56}" y2="${yBombeo - 56}"/>
        <text class="mimic-inst-txt" x="${x}" y="${yBombeo - 61}" text-anchor="middle">PI</text>
        <text class="mimic-inst-txt" x="${x}" y="${yBombeo - 41}" text-anchor="middle">${tag}</text>
        <text class="mimic-inst-val" x="${x}" y="${yBombeo - 88}" text-anchor="middle">${ok ? v.toFixed(1) + " kg/cm²" : _t("sin señal")}</text>
      </g>`;
  });
  return s + "</svg>";
}

function erbPlaca(t) {
  const chip = {
    normal: _t("Normal"),
    alta: _t("Nivel alto"),
    baja: _t("Nivel bajo"),
    falla: _t("Sin lectura"),
  }[t.estado];
  let tasa;
  if (t.falla) tasa = `<span class="face-rate">${_t("El sensor reporta")} ${t.nivel} m</span>`;
  else if (t.tasa == null) tasa = `<span class="face-rate">${_t("Tasa sin lecturas suficientes")}</span>`;
  else if (Math.abs(t.tasa) < 20)
    tasa = `<span class="face-rate">${_t("Estable")} <b>${fmtSigno(t.tasa)} bbl/h</b></span>`;
  else
    tasa = `<span class="face-rate ${t.tasa > 0 ? "sube" : "baja"}">${t.tasa > 0 ? "▲" : "▼"} <b>${fmtSigno(t.tasa)} bbl/h</b>${
      t.eta ? ` · ${_t(t.eta.a === "alto" ? "nivel alto en" : "nivel bajo en")} ~${fmtHoras(t.eta.h)}` : ""
    }</span>`;
  return `<article class="face est-${t.estado}">
    <header>
      <span class="face-sw" style="background:${t.color}"></span>
      <h4>${esc(t.nombre)}</h4>
      <span class="face-chip">${chip}</span>
    </header>
    <div class="face-main">${t.falla ? "—" : fmtBbl(t.bbl)}<small>bbl</small></div>
    <div class="face-sub">${t.falla ? `${_t("Capacidad")} ${fmtBbl(t.cap)} bbl` : `${t.nivel.toFixed(2)} m · ${t.pct.toFixed(0)} % ${_t("de")} ${t.altMax} m`}</div>
    ${tasa}
    <dl class="face-meta">
      <div><dt>${_t("Capacidad")}</dt><dd>${fmtBbl(t.cap)}</dd></div>
      <div><dt>AH ${t.umbH} %</dt><dd>${fmtBbl((t.cap * t.umbH) / 100)}</dd></div>
      <div><dt>AL ${t.umbL} %</dt><dd>${fmtBbl((t.cap * t.umbL) / 100)}</dd></div>
    </dl>
  </article>`;
}

/* Tendencia multipluma con uPlot (cursor y leyenda con valores al pasar el mouse) */
let _erbPlot = null;
let _erbPlotRO = null;
function renderERBTendencia(history) {
  const box = el("ed-trend");
  if (_erbPlotRO) _erbPlotRO.disconnect();
  if (_erbPlot) _erbPlot.destroy();
  _erbPlot = _erbPlotRO = null;
  box.innerHTML = "";
  const horaria = history.length && history[0].muestras != null;
  el("ed-trend-sub").textContent = horaria
    ? _t("Lectura al final de cada hora")
    : _t("Lectura por minuto");
  if (typeof uPlot === "undefined") {
    box.innerHTML = `<p class="cierre-nota">${_t("No se pudo cargar la librería de gráficas. Revise la conexión y recargue.")}</p>`;
    return;
  }
  const xs = [];
  const ys = ERB_NIV_KEYS.map(() => []);
  history.forEach((r) => {
    const t = DB.parseDate(r.ts);
    if (!t) return;
    xs.push(t.getTime() / 1000);
    ERB_NIV_KEYS.forEach((k, i) => {
      const v = r[k];
      ys[i].push(v > 0 && v <= ERB_NIVEL_MAX_M ? Math.round(v * ERB_BBL_POR_M[i]) : null);
    });
  });
  if (!xs.length) {
    box.innerHTML = `<p class="cierre-nota">${_t("Sin lecturas en este rango.")}</p>`;
    return;
  }
  const css = getComputedStyle(document.body);
  const tinta = css.getPropertyValue("--txt2").trim();
  const reja = css.getPropertyValue("--border2").trim();
  const fuente = '11px "Barlow Semi Condensed", Inter, sans-serif';
  const alto = window.innerWidth < 660 ? 220 : 300;
  const eje = { stroke: tinta, font: fuente, grid: { stroke: reja, width: 1 }, ticks: { show: false } };
  _erbPlot = new uPlot(
    {
      width: box.clientWidth,
      height: alto,
      cursor: { y: false, points: { size: 8 } },
      scales: { y: { range: (u, min, max) => [0, Math.max(1000, Math.ceil((max * 1.08) / 500) * 500)] } },
      axes: [
        {
          ...eje,
          // 24 h en español: hora dentro del día, fecha en la medianoche o en rangos largos
          values: (u, vals) => {
            const largo = u.scales.x.max - u.scales.x.min > 2 * 86400;
            return vals.map((v) => {
              const f = new Date(v * 1000);
              const dia = `${String(f.getDate()).padStart(2, "0")}/${String(f.getMonth() + 1).padStart(2, "0")}`;
              if (largo || (f.getHours() === 0 && f.getMinutes() === 0)) return dia;
              return `${String(f.getHours()).padStart(2, "0")}:${String(f.getMinutes()).padStart(2, "0")}`;
            });
          },
        },
        { ...eje, size: 52, values: (u, vals) => vals.map((v) => fmtBbl(v)) },
      ],
      series: [
        {
          label: _t("Hora"),
          // Sin cursor encima, la leyenda muestra la última lectura
          value: (u, v, si, idx) => {
            const x = idx == null ? xs[xs.length - 1] : v;
            return x == null ? "—" : new Date(x * 1000).toLocaleString("es-MX", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
          },
        },
        ...["TV-601", "TV-602", "TV-741"].map((n, i) => ({
          label: n,
          stroke: ERB_PLUMAS[i],
          width: 2,
          value: (u, v, si, idx) => {
            const y = idx == null ? ys[i][ys[i].length - 1] : v;
            return y == null ? "—" : fmtBbl(y);
          },
        })),
      ],
    },
    [xs, ...ys],
    box,
  );
  _erbPlotRO = new ResizeObserver(() => {
    if (_erbPlot && box.clientWidth) _erbPlot.setSize({ width: box.clientWidth, height: alto });
  });
  _erbPlotRO.observe(box);
}

/* Cierre del día operativo (05:00 → 05:00), como en el parte diario */
function renderERBCierre() {
  const box = el("ed-cierre");
  if (!box) return;
  const cierres = DB.getERBCierres();
  const enCurso = DB.getERBDiaEnCurso();
  if (!cierres.length && !enCurso) {
    box.innerHTML = `<p class="cierre-nota">${_t("Resumen no disponible por ahora.")}</p>`;
    return;
  }
  const fmt = (n) =>
    n == null ? "—" : n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const fmtS = (n) => (n == null ? "—" : (n > 0 ? "+" : "") + fmt(n));
  const fechaCorta = (f) => (f ? f.split("-").reverse().join("/") : "—");
  const kpis = (x) => `
      <div class="cierre-kpis">
        <div><span class="cierre-val">${fmt(x.totalExistencia)}</span><span class="cierre-lbl">${_t("Existencia")} (bbl)</span></div>
        <div><span class="cierre-val">${fmtS(x.totalCambio)}</span><span class="cierre-lbl">${_t("Cambio")} (bbl)</span></div>
        <div><span class="cierre-val">${fmt(x.recibido)}</span><span class="cierre-lbl">${_t("Recibido")} (bbl)</span></div>
        <div><span class="cierre-val">${fmt(x.enviado)}</span><span class="cierre-lbl">${_t("Enviado")} (bbl)</span></div>
      </div>`;
  const avisos = (c) =>
    c.tanques
      .filter((t) => t.estado && t.estado !== "OK")
      .map((t) => `${esc(t.nombre)}: ${esc(t.estado)}`)
      .join(", ");
  const ult = cierres[cierres.length - 1];
  const recientes = cierres.slice(-10).reverse();

  box.innerHTML = `
    <div class="cierre-cols">
      ${
        enCurso
          ? `<div class="cierre-card">
        <div class="cierre-head"><strong>${_t("Día en curso")}</strong>
          <span>${_t("Desde 05:00 hasta")} ${esc((enCurso.hasta || "").slice(11))} · ${enCurso.horas} h</span></div>
        ${kpis(enCurso)}
      </div>`
          : ""
      }
      ${
        ult
          ? `<div class="cierre-card">
        <div class="cierre-head"><strong>${_t("Último cierre")}: ${fechaCorta(ult.fecha)} 05:00</strong>
          <span>${ult.horas} ${_t("h con datos")}${avisos(ult) ? " · " + avisos(ult) : ""}</span></div>
        ${kpis(ult)}
      </div>`
          : ""
      }
    </div>
    <div class="cierre-chart-wrap"><canvas id="cierre-chart"></canvas></div>
    <div class="cierre-table-wrap">
      <table class="cierre-table">
        <thead><tr>
          <th>${_t("Cierre")}</th><th>${_t("Existencia")}</th><th>${_t("Cambio")}</th>
          <th>${_t("Recibido")}</th><th>${_t("Enviado")}</th><th>${_t("Horas")}</th><th>${_t("Avisos")}</th>
        </tr></thead>
        <tbody>
          ${recientes
            .map(
              (c) => `<tr>
            <td>${fechaCorta(c.fecha)}</td><td>${fmt(c.totalExistencia)}</td><td>${fmtS(c.totalCambio)}</td>
            <td>${fmt(c.recibido)}</td><td>${fmt(c.enviado)}</td><td>${c.horas}</td>
            <td class="cierre-aviso">${avisos(c) || "—"}</td></tr>`,
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <p class="cierre-nota">${_t("Recibido y enviado se calculan por balance de nivel de los tanques (los trasiegos entre tanques se cancelan); no sustituyen la medición.")}</p>
  `;

  const ult30 = cierres.slice(-30);
  setTimeout(() => {
    CHR.create("cierre-chart", {
      type: "bar",
      data: {
        labels: ult30.map((c) => fechaCorta(c.fecha).slice(0, 5)),
        datasets: [
          {
            label: _t("Recibido"),
            data: ult30.map((c) => c.recibido),
            backgroundColor: "#2ecc71",
          },
          {
            label: _t("Enviado"),
            data: ult30.map((c) => c.enviado),
            backgroundColor: "#4d9ffc",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#7b8ea8" } } },
        scales: {
          x: {
            ticks: { color: "#7b8ea8", font: { size: 10 }, maxRotation: 0 },
            grid: { display: false },
          },
          y: {
            ticks: {
              color: "#7b8ea8",
              font: { size: 10 },
              callback: (v) => fmt(v),
            },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
        },
      },
    });
  }, 200);
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
    <tr data-nombre="${esc(p.nombre)}">
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
          <span class="row-name">${esc(p.nombre)}</span>
        </div>
      </td>
      <td>${esc(p.sector)}</td>
      <td>${esc(p.campo)}</td>
      <td>${esc(p.ts || "—")}</td>
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
  await Promise.all([DB.loadPozos().catch(() => {}), DB.loadPozosResumen()]);
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
    await Promise.all([DB.loadPozos().catch(() => {}), DB.loadPozosResumen()]);
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
  renderPozoDisp(nombre);
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
  const stale = DB.isStale(latest.ts);
  const isNormal = latest.texto === "Normal";

  // Header
  el("pd-title").textContent = nombre;
  el("pd-status").textContent = stale
    ? "● " + _t("Sin conexión")
    : isNormal
      ? "● " + _t("En producción")
      : "● " + latest.texto;
  el("pd-status").className =
    "status-pill " + (stale ? "gray" : isNormal ? "green" : "orange");
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

  const stats = pozoEstadisticas(nombre);
  const enParo = latest.tipo === "ALARMA";
  renderPozoEstado(nombre, latest, stale, enParo, stats);

  // Con el pozo en paro o sin comunicación los gauges muestran la última lectura, atenuados
  const inactivo = enParo || stale;
  const nota =
    latest.valsTs && latest.valsTs !== latest.ts
      ? `<p class="pz-nota">${_t("Valores de la última lectura con el pozo operando")}: ${esc(latest.valsTs)}</p>`
      : "";
  el("pd-metrics").innerHTML =
    POZO_GRUPOS.map(
      (g) => `<section class="pz-group">
        <h3 class="box-title">${_t(g.titulo)}</h3>
        <div class="gauges">${g.vars.map((v) => pozoGauge(v, latest[v.key], stats[v.key], inactivo)).join("")}</div>
      </section>`,
    ).join("") + nota;

  renderPozoTendencias(hist, stats);
}

/* ── SCADA de pozo ── */
const POZO_GRUPOS = [
  {
    titulo: "Variador y bomba",
    vars: [
      { key: "rpm", nombre: "Velocidad", unidad: "RPM", d: 1 },
      { key: "par", nombre: "Torque", unidad: "lb-ft", d: 0 },
      { key: "I", nombre: "Corriente", unidad: "A", d: 1 },
      { key: "V", nombre: "Voltaje de salida", unidad: "V", d: 0 },
      { key: "ptp", nombre: "Presión en TP", unidad: "PSI", d: 0 },
    ],
  },
  {
    titulo: "Generador",
    vars: [
      { key: "freq", nombre: "Frecuencia", unidad: "Hz", d: 1, escala: [55, 65] },
      { key: "vll", nombre: "Voltaje L-L", unidad: "V", d: 0, escala: [400, 480] },
      { key: "gRPM", nombre: "Velocidad", unidad: "RPM", d: 0, escala: [1700, 1900] },
      { key: "temp", nombre: "Temperatura", unidad: "°C", d: 0, escala: [0, 110] },
    ],
  },
];
const POZO_VARS = POZO_GRUPOS.flatMap((g) => g.vars.map((v) => ({ ...v, grupo: g.titulo })));

/* Rango habitual de cada variable: percentiles 5–95 de los últimos 30 días con el pozo operando.
   Una variable que en 30 días casi siempre reportó 0 (menos del 1 % de lecturas distintas de 0)
   se toma como señal no conectada. */
function pozoEstadisticas(nombre) {
  const filas = DB.getPozoHistory(nombre, 720).filter((r) => r.tipo !== "ALARMA");
  const out = {};
  POZO_VARS.forEach((v) => {
    const vals = filas.map((r) => r[v.key]).filter((x) => x != null).sort((a, b) => a - b);
    const q = (p) => vals[Math.min(vals.length - 1, Math.floor(vals.length * p))];
    out[v.key] = {
      senal: vals.filter((x) => x !== 0).length >= Math.max(1, vals.length * 0.01),
      p5: vals.length ? q(0.05) : null,
      p95: vals.length ? q(0.95) : null,
      p99: vals.length ? q(0.99) : null,
    };
  });
  return out;
}

function renderPozoEstado(nombre, latest, stale, enParo, stats) {
  const items = [];
  const hoy = DB.getPozoHoy(nombre);
  if (stale) items.push(["critica", `${_t("Sin comunicación desde")} ${latest.ts}`]);
  else if (enParo) {
    const desde = hoy && /^PARO desde /.test(hoy.estado) ? hoy.estado.replace("PARO desde ", "") : latest.ts;
    items.push(["alta", `${_t("En paro desde")} ${desde}: ${latest.texto || _t("paro")}`]);
  }
  const sinSenal = POZO_VARS.filter((v) => !stats[v.key].senal).map((v) => `${_t(v.nombre)} (${_t(v.grupo).toLowerCase()})`);
  if (sinSenal.length)
    items.push(["falla", `${_t("Señales que no reportan en 30 días")}: ${sinSenal.join(", ")}`]);
  const icono =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16" aria-hidden="true"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
  const operando =
    !stale && !enParo
      ? `<div class="alm alm-ok" role="status"><span class="pz-dot"></span>${_t("Operando")} · ${_t("última lectura")} ${esc(latest.ts)}</div>`
      : "";
  el("pd-state").innerHTML =
    operando + items.map(([c, txt]) => `<div class="alm alm-${c}" role="status">${icono}<span>${esc(txt)}</span></div>`).join("");
}

/* Redondea hacia arriba a 1, 2, 2.5 o 5 × 10ⁿ */
function techoRedondo(x) {
  if (!(x > 0)) return 1;
  const e = Math.pow(10, Math.floor(Math.log10(x)));
  return [1, 2, 2.5, 5, 10].map((m) => m * e).find((m) => m >= x);
}

/* Gauge de 240°: pista gris, rango habitual sombreado, aguja neutra; color solo fuera de rango */
function pozoGauge(v, valor, st, inactivo) {
  const [min, max] = v.escala || [0, techoRedondo(Math.max(st.p99 || 0, valor || 0) * 1.25)];
  const cx = 60, cy = 58, r = 44;
  const ang = (x) => 210 - (240 * (Math.min(max, Math.max(min, x)) - min)) / (max - min);
  const pto = (a, rr) => [cx + rr * Math.cos((a * Math.PI) / 180), cy - rr * Math.sin((a * Math.PI) / 180)];
  const arco = (a0, a1) => {
    const [x0, y0] = pto(a0, r);
    const [x1, y1] = pto(a1, r);
    return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 ${a0 - a1 > 180 ? 1 : 0} 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  };
  const fmtN = (x, d) => (x == null ? "—" : x.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }));
  let cls = "gauge";
  let cuerpo = `<path class="g-track" d="${arco(210, -30)}"/>`;
  let pie;
  if (!st.senal) {
    cls += " sin-senal";
    cuerpo += `<text class="g-val g-val-sin" x="${cx}" y="${cy + 6}" text-anchor="middle">${_t("sin señal")}</text>`;
    pie = _t("No reporta en 30 días");
  } else {
    if (st.p5 != null && st.p95 > st.p5) cuerpo += `<path class="g-band" d="${arco(ang(st.p5), ang(st.p95))}"/>`;
    const fuera = valor != null && st.p5 != null && (valor < st.p5 - (max - min) * 0.01 || valor > st.p95 + (max - min) * 0.01);
    if (fuera && !inactivo) cls += " fuera";
    if (valor != null) {
      const [nx, ny] = pto(ang(valor), r - 8);
      cuerpo += `<line class="g-needle" x1="${cx}" y1="${cy}" x2="${nx.toFixed(1)}" y2="${ny.toFixed(1)}"/><circle class="g-hub" cx="${cx}" cy="${cy}" r="4"/>`;
    }
    cuerpo += `<text class="g-val" x="${cx}" y="${cy + 30}" text-anchor="middle">${fmtN(valor, v.d)}</text>`;
    pie = st.p5 != null ? `${_t("Habitual")} ${fmtN(st.p5, v.d)}–${fmtN(st.p95, v.d)}` : "";
    if (fuera && !inactivo) pie = `${_t("Fuera de lo habitual")} (${fmtN(st.p5, v.d)}–${fmtN(st.p95, v.d)})`;
  }
  if (inactivo) cls += " inactivo";
  const [mx0, my0] = pto(210, r + 2);
  const [mx1, my1] = pto(-30, r + 2);
  return `<figure class="${cls}">
    <figcaption><span>${_t(v.nombre)}</span><small>${v.unidad}</small></figcaption>
    <svg viewBox="0 0 120 104" role="img" aria-label="${_t(v.nombre)}: ${fmtN(valor, v.d)} ${v.unidad}">
      ${cuerpo}
      <text class="g-lim" x="${mx0.toFixed(1)}" y="${(my0 + 14).toFixed(1)}" text-anchor="middle">${fmtN(min, 0)}</text>
      <text class="g-lim" x="${mx1.toFixed(1)}" y="${(my1 + 14).toFixed(1)}" text-anchor="middle">${fmtN(max, 0)}</text>
    </svg>
    <p class="g-pie">${pie}</p>
  </figure>`;
}

/* Pequeños múltiplos con uPlot: una gráfica por variable, cursor sincronizado */
let _pzPlots = [];
let _pzPlotsRO = null;
function renderPozoTendencias(hist, stats) {
  const box = el("pd-charts");
  if (_pzPlotsRO) _pzPlotsRO.disconnect();
  _pzPlots.forEach((p) => p.destroy());
  _pzPlots = [];
  _pzPlotsRO = null;
  box.innerHTML = "";
  el("pd-trend-sub").textContent = _t("Los huecos son paros o pérdidas de comunicación");
  if (typeof uPlot === "undefined") {
    box.innerHTML = `<p class="cierre-nota">${_t("No se pudo cargar la librería de gráficas. Revise la conexión y recargue.")}</p>`;
    return;
  }
  const xs = [];
  const filas = [];
  hist.forEach((r) => {
    const t = DB.parseDate(r.ts);
    if (!t) return;
    xs.push(t.getTime() / 1000);
    filas.push(r);
  });
  if (!xs.length) {
    box.innerHTML = `<p class="cierre-nota">${_t("Sin lecturas en este rango.")}</p>`;
    return;
  }
  const css = getComputedStyle(document.body);
  const tinta = css.getPropertyValue("--txt2").trim();
  const reja = css.getPropertyValue("--border2").trim();
  const fuente = '11px "Barlow Semi Condensed", Inter, sans-serif';
  const eje = { stroke: tinta, font: fuente, grid: { stroke: reja, width: 1 }, ticks: { show: false } };
  const largo = xs[xs.length - 1] - xs[0] > 2 * 86400;
  const dosDig = (n) => String(n).padStart(2, "0");
  const ejeX = {
    ...eje,
    values: (u, vals) =>
      vals.map((v) => {
        const f = new Date(v * 1000);
        if (largo || (f.getHours() === 0 && f.getMinutes() === 0)) return `${dosDig(f.getDate())}/${dosDig(f.getMonth() + 1)}`;
        return `${dosDig(f.getHours())}:${dosDig(f.getMinutes())}`;
      }),
  };

  POZO_VARS.filter((v) => stats[v.key].senal).forEach((v) => {
    const ys = filas.map((r) => r[v.key]);
    const card = document.createElement("div");
    card.className = "pz-trend";
    const ultimo = [...ys].reverse().find((y) => y != null);
    card.innerHTML = `<div class="pz-trend-head"><span>${_t(v.nombre)} <small>${v.unidad} · ${_t(v.grupo).toLowerCase()}</small></span><b class="pz-trend-val">${ultimo == null ? "—" : ultimo.toFixed(v.d)}</b></div><div class="pz-trend-plot"></div>`;
    box.appendChild(card);
    const plotBox = card.querySelector(".pz-trend-plot");
    const valEl = card.querySelector(".pz-trend-val");
    const plot = new uPlot(
      {
        width: plotBox.clientWidth || 300,
        height: 130,
        legend: { show: false },
        cursor: { sync: { key: "pozo" }, y: false, points: { size: 7 } },
        // Escala mínima de ±5 % del valor para no convertir en "ruido" variaciones de décimas
        scales: {
          y: {
            range: v.escala
              ? v.escala
              : (u, min, max) => {
                  const medio = (min + max) / 2;
                  const media = Math.max((max - min) / 2 * 1.15, Math.abs(medio) * 0.05, 0.5);
                  return [Math.max(0, medio - media), medio + media];
                },
          },
        },
        axes: [ejeX, { ...eje, size: 46 }],
        series: [{}, { stroke: ERB_PLUMAS[0], width: 1.75 }],
        hooks: {
          // El valor del encabezado sigue al cursor; sin cursor muestra la última lectura
          setCursor: [
            (u) => {
              const i = u.cursor.idx;
              const y = i == null ? ultimo : ys[i];
              valEl.textContent = y == null ? "—" : y.toFixed(v.d);
            },
          ],
        },
      },
      [xs, ys],
      plotBox,
    );
    _pzPlots.push(plot);
  });
  _pzPlotsRO = new ResizeObserver(() => {
    _pzPlots.forEach((p) => {
      const w = p.root.parentElement.clientWidth;
      if (w && Math.abs(w - p.width) > 1) p.setSize({ width: w, height: 130 });
    });
  });
  _pzPlotsRO.observe(box);
}

/* Disponibilidad del pozo por día operativo (05:00 → 05:00) y eventos de paro */
function renderPozoDisp(nombre) {
  const box = el("pd-disp");
  if (!box) return;
  const dias = DB.getPozoDias(nombre);
  const hoy = DB.getPozoHoy(nombre);
  const eventos = DB.getPozoEventos(nombre);
  if (!dias.length && !hoy) {
    box.innerHTML = `<p class="cierre-nota">${_t("Resumen no disponible por ahora.")}</p>`;
    return;
  }
  const h = (n) => (n == null ? "—" : n.toFixed(1));
  const fechaCorta = (f) => (f ? f.split("-").reverse().join("/") : "—");
  const barra = (x) => {
    const tot = x.operando + x.paro + x.sinCom || 1;
    const pct = (v) => ((v / tot) * 100).toFixed(1);
    return `<div class="disp-bar" title="${h(x.operando)} h / ${h(x.paro)} h / ${h(x.sinCom)} h">
        <i class="op" style="width:${pct(x.operando)}%"></i><i class="paro" style="width:${pct(x.paro)}%"></i><i class="sc" style="width:${pct(x.sinCom)}%"></i>
      </div>`;
  };
  const tarjeta = (titulo, sub, x) => `
    <div class="cierre-card">
      <div class="cierre-head"><strong>${titulo}</strong><span>${sub}</span></div>
      <div class="cierre-kpis">
        <div><span class="cierre-val">${x.disponibilidad.toFixed(0)}%</span><span class="cierre-lbl">${_t("Disponibilidad")}</span></div>
        <div><span class="cierre-val">${x.paros}</span><span class="cierre-lbl">${_t("Paros")}</span></div>
      </div>
      ${barra(x)}
      <div class="disp-leyenda">
        <span><i class="op"></i>${_t("Operando")} ${h(x.operando)} h</span>
        <span><i class="paro"></i>${_t("Paro")} ${h(x.paro)} h</span>
        <span><i class="sc"></i>${_t("Sin comunicación")} ${h(x.sinCom)} h</span>
      </div>
    </div>`;
  const ult = dias[dias.length - 1];
  const ult30 = dias.slice(-30);
  const recientes = eventos.slice(-15).reverse();

  box.innerHTML = `
    <div class="cierre-cols">
      ${hoy ? tarjeta(_t("Día en curso"), `${_t("Desde 05:00 hasta")} ${esc(((hoy.ultima || "").split(" ")[1] || "").split(":").slice(0, 2).join(":"))}`, hoy) : ""}
      ${ult ? tarjeta(`${_t("Último cierre")}: ${fechaCorta(ult.fecha)} 05:00`, `${_t("Última lectura")}: ${esc(ult.ultima)}`, ult) : ""}
    </div>
    <div class="cierre-chart-wrap"><canvas id="disp-chart"></canvas></div>
    <h4 class="disp-sub">${_t("Eventos recientes")}</h4>
    ${
      recientes.length
        ? `<div class="cierre-table-wrap"><table class="cierre-table">
        <thead><tr><th>${_t("Tipo")}</th><th>${_t("Inicio")}</th><th>${_t("Fin")}</th><th>${_t("Horas")}</th><th>${_t("Detalle")}</th></tr></thead>
        <tbody>${recientes
          .map(
            (e) => `<tr>
          <td class="${e.tipo === "PARO" ? "cierre-aviso" : ""}">${esc(e.tipo)}</td>
          <td>${esc(e.inicio)}</td><td>${esc(e.fin)}</td><td>${h(e.horas)}</td><td>${esc(e.detalle) || "—"}</td></tr>`,
          )
          .join("")}</tbody></table></div>`
        : `<p class="cierre-nota">${_t("Sin paros ni pérdidas de comunicación registradas.")}</p>`
    }
    <p class="cierre-nota">${_t("Paro = el variador reporta frecuencia 0. Sin comunicación = más de 30 min sin datos del pozo. Se listan paros de 15 min o más y pérdidas de comunicación de 1 h o más.")}</p>
  `;

  setTimeout(() => {
    CHR.create("disp-chart", {
      type: "bar",
      data: {
        labels: ult30.map((d) => fechaCorta(d.fecha).slice(0, 5)),
        datasets: [
          { label: _t("Operando"), data: ult30.map((d) => d.operando), backgroundColor: "#2ecc71" },
          { label: _t("Paro"), data: ult30.map((d) => d.paro), backgroundColor: "#f39c12" },
          { label: _t("Sin comunicación"), data: ult30.map((d) => d.sinCom), backgroundColor: "#5b6b80" },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#7b8ea8" } } },
        scales: {
          x: {
            stacked: true,
            ticks: { color: "#7b8ea8", font: { size: 10 }, maxRotation: 0 },
            grid: { display: false },
          },
          y: {
            stacked: true,
            min: 0,
            max: 24,
            ticks: { color: "#7b8ea8", font: { size: 10 }, stepSize: 6 },
            grid: { color: "rgba(255,255,255,0.05)" },
          },
        },
      },
    });
  }, 200);
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
    const dot =
      s.estado === "online"
        ? "#2ecc71"
        : s.estado === "warning"
          ? "#f39c12"
          : "#4a5a6e";
    const statusTxt =
      s.estado === "online"
        ? "En línea"
        : s.estado === "warning"
          ? "Advertencia"
          : "Sin conexión";
    const icon = L.divIcon({
      className: "",
      iconAnchor: [0, 0],
      html: `<div class="mkr-pill mkr-erb">
        <svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        ${esc(s.nombre)}
      </div>`,
    });
    const mk = L.marker([s.lat, s.lng], { icon }).addTo(_map);
    mk.bindPopup(
      `<b style="color:#4d9ffc">${esc(s.nombre)}</b><br/>${esc(s.ubicacion)}<br/>Estado: ${statusTxt}`,
    );
    mk.on("click", () =>
      navigate("erb-detail", { id: s.id, nombre: s.nombre }),
    );
    assetHTML += `<div class="asset-row" data-view="erb-detail" data-id="${esc(s.id)}" data-nombre="${esc(s.nombre)}">
      <span class="asset-name">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4d9ffc" stroke-width="2"><rect x="4" y="10" width="16" height="10" rx="1"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
        ${esc(s.nombre)}
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
          : "Sin conexión";
    const icon = L.divIcon({
      className: "",
      iconAnchor: [0, 0],
      html: `<div class="mkr-pill mkr-pz">
        <svg class="mi" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 8h14"/><path d="M7 5l5-3 5 3"/></svg>
        ${esc(p.nombre)}
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
        <div class="mp-head" style="color:#2ecc71">${esc(p.nombre)}</div>
        <div class="mp-sub">${esc(p.sector)} &bull; <span style="color:${dot}">● ${statusTxt}</span></div>
        ${popupRows ? `<table class="mp-table">${popupRows}</table>` : ""}
        <div style="margin-top:.5rem;text-align:right">
          <span class="mp-link" data-view="pozo-detail" data-nombre="${esc(p.nombre)}">Ver detalle →</span>
        </div>
      </div>`,
      { maxWidth: 260 },
    );
    mk.on("click", () => navigate("pozo-detail", { nombre: p.nombre }));
    assetHTML += `<div class="asset-row" data-view="pozo-detail" data-nombre="${esc(p.nombre)}">
      <span class="asset-name">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 8h14"/><path d="M7 5l5-3 5 3"/></svg>
        ${esc(p.nombre)}
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
  el("asset-list").onclick = (e) => {
    const row = e.target.closest(".asset-row[data-view]");
    if (row) navigate(row.dataset.view, { id: row.dataset.id, nombre: row.dataset.nombre });
  };
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
        <span style="margin-left:auto;font-size:.8rem;color:var(--txt2)">${tr("Usuario actual")}: <strong style="color:var(--txt)">${CURRENT_USER ? esc(CURRENT_USER.nombre) : "Invitado"}</strong> <span style="color:var(--txt3)">(${CURRENT_USER ? esc(tr(CURRENT_USER.rol.charAt(0).toUpperCase() + CURRENT_USER.rol.slice(1))) : "Sin rol"})</span></span>
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
                <th>${tr("Rol")}</th>
                <th style="width:90px;text-align:center"></th>
              </tr>
            </thead>
            <tbody id="aj-users-tbody">${renderUserRows(tr)}</tbody>
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

    <!-- ── FULL-WIDTH: Cambiar contraseña ── -->
    <div class="aj-card" style="padding:1.25rem 1.3rem">
      <div class="aj-card-head">
        <span class="aj-card-icon" style="color:#f5a623"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg></span>
        <h3>${tr("Cambiar mi contraseña")}</h3>
      </div>
      <div class="aj-pass-grid">
        <input type="password" id="cp-actual" class="aj-input" autocomplete="current-password" placeholder="${tr("Contraseña actual")}">
        <input type="password" id="cp-nueva" class="aj-input" autocomplete="new-password" placeholder="${tr("Nueva contraseña (mín. 8)")}">
        <input type="password" id="cp-confirma" class="aj-input" autocomplete="new-password" placeholder="${tr("Confirmar contraseña")}">
        <button class="aj-btn" data-act="change-pass" style="background:var(--blue);color:#fff;border:none">${tr("Actualizar")}</button>
      </div>
      <p id="cp-msg" style="font-size:.8rem;margin-top:.6rem"></p>
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
        <button class="aj-btn" style="border-color:var(--red);color:var(--red);font-weight:600" onclick="if(confirm(SETTINGS.idioma==='en'?'Do you want to sign out?':SETTINGS.idioma==='zh'?'您要退出登录吗？':'¿Desea cerrar sesión?')){logout();}">Salir</button>
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
        <button class="aj-btn" style="border-color:var(--red);color:var(--red);font-weight:600" onclick="if(confirm(SETTINGS.idioma==='en'?'Do you want to sign out?':SETTINGS.idioma==='zh'?'您要退出登录吗？':'¿Desea cerrar sesión?')){logout();}">Salir</button>
      </div>
    </div>
    `
    }
  `;

  const root = el("ajustes-content");
  root.onclick = onAjustesClick;
  root.onchange = onAjustesChange;
  if (isAdmin && _adminUsers === null) loadAdminUsers();
}

/* ─── USER ADMINISTRATION (server-side via API) ─── */
let _adminUsers = null; // null = not loaded yet
let _adminUsersError = "";

function renderUserRows(tr) {
  if (_adminUsersError)
    return `<tr><td colspan="4" style="text-align:center;color:var(--red);padding:1.5rem">${esc(_adminUsersError)}</td></tr>`;
  if (_adminUsers === null)
    return `<tr><td colspan="4" style="text-align:center;color:var(--txt3);padding:1.5rem">${tr("Cargando...")}</td></tr>`;
  const sel = (val, opt) => (val === opt ? "selected" : "");
  const me = CURRENT_USER ? CURRENT_USER.correo : "";
  return _adminUsers
    .map((u) => {
      const self = u.correo === me;
      return `
      <tr data-correo="${esc(u.correo)}" data-nombre="${esc(u.nombre)}">
        <td><strong>${esc(u.nombre)}</strong></td>
        <td>${esc(u.correo)}</td>
        <td>
          <select class="user-role-select" ${self ? "disabled" : ""}>
            <option value="administrador" ${sel(u.rol, "administrador")}>${tr("Administrador")}</option>
            <option value="supervisor" ${sel(u.rol, "supervisor")}>${tr("Supervisor")}</option>
            <option value="operador" ${sel(u.rol, "operador")}>${tr("Operador")}</option>
            <option value="visitante" ${sel(u.rol, "visitante")}>${tr("Visitante")}</option>
          </select>
        </td>
        <td style="text-align:center;white-space:nowrap">
          <button class="btn-delete-user btn-reset-pass" data-act="reset-pass" title="${tr("Restablecer contraseña")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/></svg>
          </button>
          <button class="btn-delete-user" data-act="delete-user" ${self ? "disabled" : ""} title="${tr("Eliminar usuario")}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </td>
      </tr>`;
    })
    .join("");
}

function refreshUserRows() {
  const tbody = el("aj-users-tbody");
  if (tbody) tbody.innerHTML = renderUserRows(_t);
}

async function loadAdminUsers() {
  _adminUsersError = "";
  try {
    const res = await API.call("listUsuarios");
    _adminUsers = res.usuarios || [];
  } catch (e) {
    if (e.auth) return handleAuthError();
    _adminUsers = [];
    _adminUsersError = e.message;
  }
  refreshUserRows();
}

/* Random temporary password without ambiguous characters */
function tempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const buf = new Uint32Array(10);
  crypto.getRandomValues(buf);
  return Array.from(buf, (n) => chars[n % chars.length]).join("");
}

async function onAjustesClick(e) {
  const btn = e.target.closest("[data-act]");
  if (!btn || btn.disabled) return;
  const row = btn.closest("tr[data-correo]");
  const correo = row ? row.dataset.correo : "";
  const nombre = row ? row.dataset.nombre : "";
  try {
    if (btn.dataset.act === "delete-user") {
      if (!confirm(`¿Eliminar usuario ${nombre}?`)) return;
      btn.disabled = true;
      await API.call("deleteUsuario", { correo });
      await loadAdminUsers();
    } else if (btn.dataset.act === "reset-pass") {
      const pwd = tempPassword();
      if (
        !confirm(
          `Se asignará a ${nombre} la contraseña temporal:\n\n${pwd}\n\nAnótela antes de continuar. ¿Aplicar?`,
        )
      )
        return;
      btn.disabled = true;
      await API.call("resetPassword", { correo, password: pwd });
      btn.disabled = false;
      alert(`Contraseña de ${nombre} restablecida.`);
    } else if (btn.dataset.act === "change-pass") {
      await changeOwnPassword(btn);
    }
  } catch (err) {
    btn.disabled = false;
    if (err.auth) return handleAuthError();
    alert("Error: " + err.message);
    loadAdminUsers();
  }
}

async function onAjustesChange(e) {
  const select = e.target.closest(".user-role-select");
  if (!select) return;
  const correo = select.closest("tr[data-correo]").dataset.correo;
  select.disabled = true;
  try {
    await API.call("updateUsuarioRole", { correo, rol: select.value });
  } catch (err) {
    if (err.auth) return handleAuthError();
    alert("Error: " + err.message);
  }
  loadAdminUsers();
}

async function changeOwnPassword(btn) {
  const msg = el("cp-msg");
  const actual = el("cp-actual").value;
  const nueva = el("cp-nueva").value;
  const confirma = el("cp-confirma").value;
  const show = (text, ok) => {
    msg.textContent = text;
    msg.style.color = ok ? "var(--green)" : "var(--red)";
  };
  if (!actual || !nueva) return show("Complete todos los campos.");
  if (nueva.length < 8)
    return show("La nueva contraseña debe tener al menos 8 caracteres.");
  if (nueva !== confirma) return show("Las contraseñas no coinciden.");
  btn.disabled = true;
  try {
    const user = await API.changePassword(actual, nueva);
    CURRENT_USER = user;
    el("cp-actual").value = el("cp-nueva").value = el("cp-confirma").value = "";
    show("Contraseña actualizada.", true);
  } catch (err) {
    show(err.message);
  }
  btn.disabled = false;
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
            <button class="aj-btn" id="mu-save-btn" style="background:var(--blue);color:#fff;border:none" onclick="window.saveUsersFromModal()">${tr("Agregar")}</button>
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

/* Parses "Nombre<TAB or 2+ spaces>Contraseña" lines; the email is derived from the name */
function parseBulkUsers(text) {
  const usuarios = [];
  const errors = [];
  text.split(/\r?\n/).forEach((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    let parts = trimmed.split(/[\t]+| {2,}/);
    if (parts.length < 2) {
      const single = trimmed.split(/\s+/);
      if (single.length !== 2) {
        errors.push(`Línea ${index + 1}: Formato incorrecto. Use: Nombre [Espacio] Contraseña`);
        return;
      }
      parts = single;
    }
    const nombre = parts[0].trim();
    const password = parts[1].trim();
    const clean = nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9\s]/g, "")
      .trim();
    usuarios.push({ nombre, password, correo: clean.replace(/\s+/g, ".") + "@deppg.com" });
  });
  return { usuarios, errors };
}

window.saveUsersFromModal = async function () {
  const feedback = el("add-users-feedback");
  feedback.innerHTML = "";
  const showResult = (added, errors) => {
    feedback.innerHTML = `
      ${errors.length ? `<div class="user-errors-box"><h4>Errores (${errors.length}):</h4><ul>${errors.map((e) => `<li>${esc(e)}</li>`).join("")}</ul></div>` : ""}
      ${added ? `<div class="user-success-box">Se agregaron con éxito ${added} usuarios.</div>` : ""}`;
  };

  let payload;
  let localErrors = [];
  if (window._addUsersType === "single") {
    const nombre = el("mu-name").value.trim();
    const correo = el("mu-email").value.trim();
    const password = el("mu-pass").value.trim();
    const rol = el("mu-role").value;
    if (!nombre || !correo || !password) {
      feedback.innerHTML = `<div class="user-errors-box">Por favor, rellene todos los campos.</div>`;
      return;
    }
    payload = { usuarios: [{ nombre, correo, password, rol }] };
  } else {
    const text = el("mub-text").value;
    if (!text.trim()) {
      feedback.innerHTML = `<div class="user-errors-box">Por favor, ingrese el texto de los usuarios.</div>`;
      return;
    }
    const parsed = parseBulkUsers(text);
    const rol = el("mub-role").value;
    localErrors = parsed.errors;
    payload = { usuarios: parsed.usuarios.map((u) => Object.assign(u, { rol })) };
  }

  const btn = el("mu-save-btn");
  if (btn) btn.disabled = true;
  try {
    const res = payload.usuarios.length
      ? await API.call("addUsuariosBulk", payload)
      : { added: [], errors: [] };
    const errors = localErrors.concat(res.errors || []);
    await loadAdminUsers();
    if (errors.length) showResult(res.added.length, errors);
    else el("add-users-modal").classList.add("hidden");
  } catch (e) {
    if (e.auth) return handleAuthError();
    feedback.innerHTML = `<div class="user-errors-box">${esc(e.message)}</div>`;
  } finally {
    if (btn) btn.disabled = false;
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
   SESSION
────────────────────────────────────────────── */
function renderTopbarUser(user) {
  el("topbar-user").innerHTML = `
    <span class="user-avatar">${esc(user.nombre.charAt(0).toUpperCase())}</span>
    <span class="user-name">${esc(user.nombre.split(" ")[0])}</span>
    <svg class="user-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
  `;
}

function startApp(user) {
  CURRENT_USER = user;
  _adminUsers = null;
  renderTopbarUser(user);
  el("view-login").style.display = "none";
  el("app").classList.remove("hidden");
  Promise.all([DB.loadCoords(), DB.loadERB(), DB.loadPozos()]).catch(console.warn);
  navigate("home");
  logAccessEvent(user);
}

function logout() {
  API.clearSession();
  window.location.reload();
}

/* The server rejected the token (expired, revoked, password changed) */
function handleAuthError() {
  alert(
    SETTINGS.idioma === "en"
      ? "Your session has expired. Please sign in again."
      : "Su sesión expiró. Inicie sesión nuevamente.",
  );
  logout();
}

/* ──────────────────────────────────────────────
   INIT
────────────────────────────────────────────── */
async function init() {
  /* Apply persisted theme/language immediately */
  applyTheme();
  applyLang();

  // Restore saved session; the server re-validates the token and the current role
  const session = API.readSession();
  if (session) {
    startApp(session.user);
    API.call("me")
      .then((res) => {
        CURRENT_USER = res.user;
        API.updateSession(session.token, res.user);
        renderTopbarUser(res.user);
        if (_cur === "ajustes") renderAjustes();
      })
      .catch((e) => {
        if (e.auth) handleAuthError();
      });
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

    if (confirm(msg)) logout();
  };

  /* Login */
  el("eye-btn").onclick = () => {
    const i = el("l-pass");
    i.type = i.type === "password" ? "text" : "password";
  };

  el("btn-login").onclick = async () => {
    const btn = el("btn-login");
    const email = el("l-email").value.trim();
    const pass = el("l-pass").value;

    // Clear any previous error
    const prevErr = document.getElementById("login-err-msg");
    if (prevErr) prevErr.remove();

    const showErr = (msg) => {
      btn.innerHTML = `<span data-i18n="Iniciar sesión">Iniciar sesión</span><span class="btn-arrow">&nbsp;→</span>`;
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
      const user = await API.login(email, pass, el("remember")?.checked);
      el("l-pass").value = "";
      startApp(user);
    } catch (e) {
      const offline = !e.message || /fetch|HTTP|network/i.test(e.message);
      showErr(
        offline
          ? SETTINGS.idioma === "en"
            ? "⚠ Could not connect to the server. Please try again."
            : "⚠ No se pudo conectar con el servidor. Intente de nuevo."
          : esc(e.message),
      );
    }
  };

  el("l-pass").addEventListener("keydown", (e) => {
    if (e.key === "Enter") el("btn-login").click();
  });
  el("l-email").addEventListener("keydown", (e) => {
    if (e.key === "Enter") el("l-pass").focus();
  });

  /* ══════════════════════════════════════════════
     CONTACT ADMIN OVERLAY LOGIC
  ══════════════════════════════════════════════ */
  const caOverlay = el("contact-admin-overlay");
  const caLink = el("contact-admin-link");
  const caCancelForm = el("ca-cancel-form");
  const caSubmitBtn = el("ca-submit-btn");
  const caCancelSending = el("ca-cancel-sending");
  
  let caTimeout1 = null;
  let caTimeout2 = null;
  let caTimeout3 = null;

  function closeCaOverlay() {
    if (caOverlay) {
      caOverlay.classList.add("hidden");
    }
    clearTimeout(caTimeout1);
    clearTimeout(caTimeout2);
    clearTimeout(caTimeout3);
  }

  if (caLink && caOverlay) {
    caLink.onclick = (e) => {
      e.preventDefault();
      caOverlay.classList.remove("hidden");
      el("ca-step-form").classList.remove("hidden");
      el("ca-step-sending").classList.add("hidden");
      
      el("ca-nombre").value = "";
      el("ca-correo").value = "";
      el("ca-mensaje").value = "";
      
      const err = el("ca-form-err");
      if (err) {
        err.classList.add("hidden");
        err.textContent = "";
      }
    };
  }

  if (caCancelForm) {
    caCancelForm.onclick = (e) => {
      e.preventDefault();
      closeCaOverlay();
    };
  }

  if (caCancelSending) {
    caCancelSending.onclick = (e) => {
      e.preventDefault();
      closeCaOverlay();
    };
  }

  if (caSubmitBtn) {
    caSubmitBtn.onclick = (e) => {
      e.preventDefault();
      const nombre = el("ca-nombre").value.trim();
      const correo = el("ca-correo").value.trim();
      const mensaje = el("ca-mensaje").value.trim();
      const errEl = el("ca-form-err");

      if (!nombre || !correo || !mensaje) {
        if (errEl) {
          errEl.textContent = SETTINGS.idioma === "en" 
            ? "Please fill in all fields." 
            : SETTINGS.idioma === "zh" 
              ? "请填写所有字段。" 
              : "Por favor, complete todos los campos.";
          errEl.classList.remove("hidden");
        }
        return;
      }

      if (errEl) errEl.classList.add("hidden");

      el("ca-step-form").classList.add("hidden");
      el("ca-step-sending").classList.remove("hidden");

      const st1 = el("ca-st-1");
      const st2 = el("ca-st-2");
      const st3 = el("ca-st-3");
      
      st1.className = "ca-step-item active";
      st1.querySelector(".ca-step-icon").className = "ca-step-icon blue";
      
      st2.className = "ca-step-item";
      st2.querySelector(".ca-step-icon").className = "ca-step-icon";
      
      st3.className = "ca-step-item";
      st3.querySelector(".ca-step-icon").className = "ca-step-icon";

      el("ca-status-msg").textContent = SETTINGS.idioma === "en" ? "Sending message..." : "Enviando mensaje...";
      el("ca-status-sub").textContent = SETTINGS.idioma === "en" ? "Please wait a few seconds" : "Por favor espera unos segundos";
      
      el("ca-dot-1").className = "ca-dot active";
      el("ca-dot-2").className = "ca-dot";
      el("ca-dot-3").className = "ca-dot";

      caTimeout1 = setTimeout(() => {
        st1.className = "ca-step-item done";
        st2.className = "ca-step-item active";
        st2.querySelector(".ca-step-icon").className = "ca-step-icon blue";

        el("ca-status-msg").textContent = SETTINGS.idioma === "en" ? "Awaiting admin receipt..." : "En espera de recepción...";
        el("ca-dot-1").className = "ca-dot";
        el("ca-dot-2").className = "ca-dot active";
      }, 1500);

      caTimeout2 = setTimeout(() => {
        st2.className = "ca-step-item done";
        st3.className = "ca-step-item active";
        st3.querySelector(".ca-step-icon").className = "ca-step-icon blue";

        el("ca-status-msg").textContent = SETTINGS.idioma === "en" ? "Request sent!" : "¡Solicitud enviada!";
        el("ca-status-sub").textContent = SETTINGS.idioma === "en" ? "Opening mail client..." : "Abriendo cliente de correo...";
        el("ca-dot-2").className = "ca-dot";
        el("ca-dot-3").className = "ca-dot active";
      }, 3000);

      caTimeout3 = setTimeout(() => {
        const subject = encodeURIComponent("Solicitud de Acceso TelNet - " + nombre);
        const body = encodeURIComponent(
          "Hola Alfredo,\n\n" +
          "Solicito acceso al sistema TelNet.\n\n" +
          "Detalles de contacto:\n" +
          "Nombre: " + nombre + "\n" +
          "Correo: " + correo + "\n\n" +
          "Mensaje:\n" + mensaje + "\n\n" +
          "Saludos."
        );
        window.location.href = `mailto:alfredo.netro@deppg.com?subject=${subject}&body=${body}`;
        
        setTimeout(() => {
          closeCaOverlay();
        }, 1000);
      }, 4500);
    };
  }

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

  /* "Ver detalle" links inside Leaflet popups */
  document.addEventListener("click", (e) => {
    const link = e.target.closest(".mp-link[data-view]");
    if (link) navigate(link.dataset.view, { nombre: link.dataset.nombre });
  });

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
      if (_cur === "home") {
        await Promise.all([
          DB.loadERB().catch(() => {}),
          DB.loadPozos().catch(() => {}),
        ]);
        updateHomeStats();
      } else if (_cur === "erb") {
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
