# TelNet – Portal de Telemetría PWA

TelNet es una aplicación web progresiva (PWA) diseñada para el monitoreo y visualización en tiempo real de la telemetría en **Estaciones de Recolección y Bombeo (E.R.B.)** y **Pozos Petroleros** (campo Ébano, San Luis Potosí).

La aplicación funciona de manera offline-first, sincronizándose de forma dinámica con bases de datos en la nube hospedadas en **Google Sheets**, y ofrece herramientas avanzadas para la generación de reportes y administración de usuarios.

---

## 🚀 Características Clave

- **Monitoreo en Tiempo Real**: 
  - Visualización del estado operativo y niveles de tanques industriales (TV-601, TV-602, TV-741).
  - Telemetría en vivo para pozos (Presión TP, Torque, Corriente, Temperatura, Voltaje L-L, Frecuencia y RPM del Generador).
- **Sincronización Inteligente (Google Sheets)**:
  - Actualización automática en segundo plano cada 30 segundos.
  - Evasión de caché de CDN mediante parámetros dinámicos (`cache-busting`).
  - Filtro antirretroceso de tiempo para prevenir inconsistencias cuando el CDN de Google devuelve datos desactualizados.
- **Gráficas de Tendencia Histórica**: Visualización interactiva mediante **Chart.js** para rangos preestablecidos (1H, 6H, 12H, 24H, 7D, 30D) y rangos personalizados a través de un selector de fechas.
- **PWA (Progressive Web App)**: Instalable en dispositivos móviles y de escritorio. Soporte offline-first mediante **Service Workers** (`sw.js`).
- **Generador de Reportes PDF**: Generación en cliente de reportes técnicos con diseño responsivo y gráficos vectoriales usando **jsPDF** para auditorías e informes de inventario.
- **Control de Acceso Basado en Roles (RBAC)**:
  - **Administrador**: Acceso completo, edición de umbrales/parámetros de tanques y pozos, y gestión de usuarios (alta individual y por lote).
  - **Supervisor / Operador / Visitante**: Acceso limitado a visualización y descargas de reportes, restringiendo las pestañas críticas de configuración y seguridad.

---

## 🛠️ Tecnologías Utilizadas

- **Core**: HTML5 semántico y JavaScript ES6 vanilla (sin frameworks pesados para garantizar máxima velocidad y compatibilidad en móviles antiguos).
- **Estilos**: Vanilla CSS con diseño moderno, soporte para temas (Oscuro/Claro), layouts en CSS Grid y Flexbox.
- **Gráficos**: [Chart.js](https://www.chartjs.org/) para las curvas históricas y tendencias de nivel.
- **Mapas**: [Leaflet.js](https://leafletjs.com/) para geolocalización satelital de activos.
- **Reportes**: [jsPDF](https://github.com/parallax/jsPDF) para generación dinámica en el lado del cliente.

---

## 💻 Instalación y Desarrollo Local

### Requisitos previos
Solo necesitas un servidor web local sencillo. Por ejemplo, utilizando **Python** (que viene instalado por defecto en la mayoría de sistemas operativos).

### Instrucciones paso a paso

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/NtroDdios/TelNet.git
   cd TelNet
   ```

2. **Iniciar el servidor local**:
   Si usas Python:
   ```bash
   python -m http.server 8000
   ```

3. **Abrir en el navegador**:
   Visita `http://localhost:8000` en tu navegador preferido.

4. **Instalación como PWA**:
   Haz clic en el icono de instalación de la barra de direcciones de tu navegador (Chrome/Edge/Safari) para instalarla como una aplicación nativa en tu escritorio o pantalla de inicio móvil.

---

## 🔒 Estructura de Roles del Sistema

| Rol | Ver Datos | Exportar PDF | Editar Ajustes | Gestionar Usuarios |
| :--- | :---: | :---: | :---: | :---: |
| **Administrador** | ✓ | ✓ | ✓ | ✓ |
| **Supervisor** | ✓ | ✓ | ✗ | ✗ |
| **Operador** | ✓ | ✓ | ✗ | ✗ |
| **Visitante** | ✓ | ✓ | ✗ | ✗ |

---

## 📂 Estructura del Proyecto

- `index.html` – Estructura base de la aplicación Single Page Application (SPA).
- `index.css` – Sistema de diseño, temas oscuro/claro y layouts responsivos.
- `app.js` – Controlador SPA, enrutamiento interno, lógica de UI y auto-actualizaciones.
- `data.js` – Servicio de datos, consultas a Google Sheets, parseador y control de caché.
- `pdf.js` – Lógica de renderizado y formateo de reportes exportables en PDF.
- `sw.js` – Service Worker para soporte offline y almacenamiento en caché de activos estáticos.
- `manifest.json` – Metadatos de la PWA para instalación nativa.
- `/assets` – Recursos gráficos, iconos y logos.
- `/scratch` – Scripts de prueba y utilidades de depuración del proyecto.
