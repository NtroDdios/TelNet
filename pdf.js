/* ═══════════════════════════════════════════════
   TELNET – PDF GENERATOR  v3  (pixel-perfect)
   Matches prototypes exactly.
   ═══════════════════════════════════════════════ */

/* ─── jsPDF accessor ─── */
function _jsPDF() {
  if (window.jspdf && window.jspdf.jsPDF) return window.jspdf.jsPDF;
  if (typeof jsPDF !== "undefined") return jsPDF;
  alert("La librería PDF no cargó. Verifica tu conexión."); return null;
}

function _tr(key) {
  if (typeof _t === 'function') return _t(key);
  if (typeof SETTINGS !== 'undefined' && typeof TRANSLATIONS !== 'undefined') {
    var dict = TRANSLATIONS[SETTINGS.idioma] || {};
    return dict[key] || key;
  }
  return key;
}

function getCanvasColor(doc) {
  var c = doc.getTextColor();
  if (!c) return '#000000';
  if (typeof c === 'string') {
    var parts = c.split(' ');
    if (parts.length === 3) {
      var r = Math.round(parseFloat(parts[0]) * 255);
      var g = Math.round(parseFloat(parts[1]) * 255);
      var b = Math.round(parseFloat(parts[2]) * 255);
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    return c;
  }
  return '#000000';
}

function patchDocText(doc) {
  var originalText = doc.text;
  doc.text = function(text, x, y, options) {
    if (text === null || text === undefined) return doc;
    
    var str = "";
    if (Array.isArray(text)) {
      str = text.join("\n");
    } else {
      str = String(text);
    }
    
    // Check if contains non-ASCII characters
    if (/[^\x00-\x7F]/.test(str)) {
      options = options || {};
      var align = options.align || 'left';
      var maxWidth = options.maxWidth;
      var fontSize = doc.getFontSize() || 10;
      
      var fontStyle = doc.getFont() ? doc.getFont().fontStyle : 'normal';
      var isBold = fontStyle.toLowerCase().indexOf('bold') !== -1;
      var color = getCanvasColor(doc);
      
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      
      var scale = 4; // High resolution for crisp PDF rendering
      var canvasFontSize = Math.round(fontSize * scale);
      ctx.font = (isBold ? 'bold ' : '') + canvasFontSize + 'px "Inter", system-ui, sans-serif';
      
      var lines = str.split('\n');
      var maxW = 0;
      var lineHeights = [];
      
      lines.forEach(function(line) {
        var w = ctx.measureText(line).width;
        if (w > maxW) maxW = w;
        lineHeights.push(canvasFontSize * 1.25);
      });
      
      var totalH = lineHeights.reduce(function(a, b) { return a + b; }, 0);
      
      canvas.width = maxW + 20;
      canvas.height = totalH + 10;
      
      ctx.font = (isBold ? 'bold ' : '') + canvasFontSize + 'px "Inter", system-ui, sans-serif';
      ctx.textBaseline = 'alphabetic';
      ctx.fillStyle = color;
      
      var currentY = 0;
      lines.forEach(function(line, idx) {
        var lineW = ctx.measureText(line).width;
        var startX = 10;
        if (align === 'center') {
          startX = 10 + (maxW - lineW) / 2;
        } else if (align === 'right') {
          startX = 10 + (maxW - lineW);
        }
        var baselineY = currentY + canvasFontSize * 0.95;
        ctx.fillText(line, startX, baselineY);
        currentY += lineHeights[idx];
      });
      
      var imgData = canvas.toDataURL('image/png');
      
      var drawW = (maxW + 20) / scale;
      var drawH = (totalH + 10) / scale;
      
      var drawX = x;
      if (align === 'center') {
        drawX = x - drawW / 2;
      } else if (align === 'right') {
        drawX = x - drawW;
      }
      
      var firstLineBaselineY = canvasFontSize * 0.95;
      var drawY = y - (firstLineBaselineY / scale);
      
      doc.addImage(imgData, 'PNG', drawX, drawY, drawW, drawH, undefined, 'FAST');
      return doc;
    }
    
    return originalText.call(doc, text, x, y, options);
  };
}

/* ─── number format ─── */
function _n(v, d) {
  if (v == null || isNaN(v)) return "—";
  return Number(v).toLocaleString("en-US", { minimumFractionDigits: d||0, maximumFractionDigits: d||0 });
}
function _dateLoc(d) {
  var lang = (typeof SETTINGS !== 'undefined' && SETTINGS.idioma) || 'es';
  var locale = lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-CN' : 'es-MX';
  return d.toLocaleDateString(locale, { day:"numeric", month:"long", year:"numeric" });
}
function _timeLoc(d) {
  var lang = (typeof SETTINGS !== 'undefined' && SETTINGS.idioma) || 'es';
  var locale = lang === 'en' ? 'en-US' : lang === 'zh' ? 'zh-CN' : 'es-MX';
  return d.toLocaleTimeString(locale, { hour:"2-digit", minute:"2-digit" });
}
function _slug(d) {
  return d.getFullYear()+("0"+(d.getMonth()+1)).slice(-2)+("0"+d.getDate()).slice(-2);
}
function _dateEs(d) {
  return _dateLoc(d);
}
function _timeHM(d) {
  return _timeLoc(d);
}
function _parseDate(ts) {
  if (!ts) return new Date();
  if (ts.indexOf('/') !== -1) {
    var parts = ts.split(' ');
    var dateParts = parts[0].split('/'); // [DD, MM, YYYY]
    var timeParts = parts[1] ? parts[1].split(':') : [0,0,0];
    var day = parseInt(dateParts[0], 10);
    var month = parseInt(dateParts[1], 10) - 1;
    var year = parseInt(dateParts[2], 10);
    var hour = parseInt(timeParts[0], 10) || 0;
    var min = parseInt(timeParts[1], 10) || 0;
    var sec = parseInt(timeParts[2], 10) || 0;
    return new Date(year, month, day, hour, min, sec);
  }
  var d = new Date(ts.replace(" ", "T"));
  if (isNaN(d.getTime())) d = new Date(ts);
  return isNaN(d.getTime()) ? new Date() : d;
}
function _avg(rows, key) {
  if (!rows||!rows.length) return 0;
  var s=0; rows.forEach(function(r){s+=parseFloat(r[key])||0;}); return s/rows.length;
}
function _series(rows, key, n) {
  if (!rows||!rows.length) return [0,0];
  var step=Math.max(1,Math.floor(rows.length/n)); var o=[];
  for (var i=0;i<rows.length;i+=step){ var v=parseFloat(rows[i][key]); if(!isNaN(v))o.push(v); }
  return o.length?o:[0,0];
}

/* ═══════════════════════════════════════════════
   ERB PDF  — identical to prototype image 1
   ═══════════════════════════════════════════════ */
function generateERBPDF() {
  var JC = _jsPDF(); if (!JC) return;
  // Use custom size format: [612, 918]
  var doc = new JC({ orientation: "portrait", unit: "pt", format: [612, 918] });
  patchDocText(doc);
  var W = 612;
  var H = 918;
  var now = new Date();

  /* ── data ── */
  var d = DB.getERBDetalle();
  if (!d){ alert("Sin datos de estación."); return; }
  
  var F = [1092.953, 1066.058202, 840.1914];
  var colors = ['#00a651', '#0069d9', '#8f949c'];
  
  var report = {
    title: 'RESUMEN ERB E41',
    date: d.ts ? _dateEs(_parseDate(d.ts)) : _dateEs(now),
    tanks: d.tanks.map(function(t, i) {
      return {
        id: t.nombre,
        max: Math.round((t.altMax || 0) * F[i]),
        current: Math.round((t.nivel || 0) * F[i]),
        color: colors[i] || '#8f949c'
      };
    })
  };

  var totalMax = report.tanks.reduce(function(a, t) { return a + t.max; }, 0);
  var totalCurrent = report.tanks.reduce(function(a, t) { return a + t.current; }, 0);
  
  // Calculate average fill from percentages
  var fillAvg = Math.round(report.tanks.reduce(function(a, t) {
    return a + (t.max ? (t.current / t.max) * 100 : 0);
  }, 0) / report.tanks.length);

  var hist = DB.getERBHistory(24);

  const navy = '#071f55';
  const blue = '#0069d9';
  const green = '#00a651';
  const gray = '#8f949c';
  const text = '#06194b';

  function fmt(n) {
    return Math.round(n).toLocaleString('en-US');
  }

  function pct(t) {
    return Math.round((t.current / t.max) * 100);
  }

  function sectionTitle(label, x, y, size) {
    size = size || 12;
    doc.setTextColor(navy).setFont('Helvetica', 'Bold').setFontSize(size);
    doc.text(label, x, y + size * 0.82);
  }

  function roundedBox(x, y, w, h, r) {
    r = r || 7;
    doc.setDrawColor('#d7dfec').setLineWidth(0.7);
    doc.roundedRect(x, y, w, h, r, r, 'S');
  }

  function drawCenteredValueWithSuffix(value, suffix, x, y, w, valueSize, suffixSize) {
    valueSize = valueSize || 18;
    suffixSize = suffixSize || 7.2;
    
    doc.setFont('Helvetica', 'Bold').setFontSize(valueSize);
    var valueWidth = doc.getTextWidth(value);
    
    doc.setFontSize(suffixSize);
    var suffixWidth = suffix ? doc.getTextWidth(suffix) : 0;
    
    var startX = x + (w - valueWidth - suffixWidth - (suffix ? 1.5 : 0)) / 2;
    
    doc.setTextColor(navy).setFont('Helvetica', 'Bold').setFontSize(valueSize);
    doc.text(value, startX, y + valueSize * 0.82);
    
    if (suffix) {
      doc.setFontSize(suffixSize);
      doc.text(suffix, startX + valueWidth + 1.5, y + 7.6 + suffixSize * 0.82);
    }
  }

  function drawStorageIcon(x, y, scale, color) {
    scale = scale || 1;
    color = color || blue;
    
    var w = 20 * scale;
    var h = 25 * scale;
    var rx = w / 2;
    var ry = 4 * scale;
    
    doc.setFillColor('white');
    doc.setDrawColor(color).setLineWidth(1.5);
    
    doc.ellipse(x, y + h, rx, ry, 'FD');
    doc.ellipse(x, y + h * 0.66, rx, ry, 'FD');
    doc.ellipse(x, y + h * 0.33, rx, ry, 'FD');
    
    doc.line(x - rx, y, x - rx, y + h);
    doc.line(x + rx, y, x + rx, y + h);
    
    doc.ellipse(x, y, rx, ry, 'FD');
  }

  function drawFlagIcon(x, y, scale) {
    scale = scale || 1;
    doc.setDrawColor(blue).setLineWidth(1.5);
    doc.line(x, y, x, y + 30 * scale);
    
    var p1y = y + 3 * scale;
    var p1_cp1x = x + 11 * scale;
    var p1_cp1y = y - 3 * scale;
    var p1_cp2x = x + 18 * scale;
    var p1_cp2y = y + 10 * scale;
    var p1_endx = x + 28 * scale;
    var p1_endy = y + 3 * scale;
    
    var p2y = y + 18 * scale;
    var p2_cp1x = x + 17 * scale;
    var p2_cp1y = y + 24 * scale;
    var p2_cp2x = x + 11 * scale;
    var p2_cp2y = y + 11 * scale;
    var p2_endx = x;
    var p2_endy = y + 17 * scale;
    
    function drawBezierCurve(x0, y0, x1, y1, x2, y2, x3, y3) {
      var steps = 15;
      var lastX = x0, lastY = y0;
      for (var i = 1; i <= steps; i++) {
        var t = i / steps;
        var mt = 1 - t;
        var currX = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
        var currY = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
        doc.line(lastX, lastY, currX, currY);
        lastX = currX;
        lastY = currY;
      }
    }
    
    drawBezierCurve(x, p1y, p1_cp1x, p1_cp1y, p1_cp2x, p1_cp2y, p1_endx, p1_endy);
    doc.line(p1_endx, p1_endy, p1_endx, p2y);
    drawBezierCurve(p1_endx, p2y, p2_cp1x, p2_cp1y, p2_cp2x, p2_cp2y, p2_endx, p2_endy);
  }

  function drawArrowIcon(x, y) {
    doc.setDrawColor(blue).setLineWidth(2.2);
    doc.line(x + 2, y + 22, x + 28, y + 4);
    doc.line(x + 28, y + 4, x + 16, y + 4);
    doc.line(x + 28, y + 4, x + 28, y + 16);
  }

  function drawGauge(x, y, r, value) {
    doc.setDrawColor('#e4e7ef').setLineWidth(4.5);
    doc.ellipse(x, y, r, r, 'S');
    
    doc.setDrawColor(green);
    var startRad = -88 * Math.PI / 180;
    var endRad = (-88 + 360 * value) * Math.PI / 180;
    _arc(doc, x, y, r, startRad, endRad);
    
    doc.setTextColor(navy).setFont('Helvetica', 'Bold').setFontSize(13);
    doc.text(Math.round(value * 100) + '%', x, y - 8 + 13 * 0.82, { align: 'center' });
  }

  function drawKeyMetric(x, y, w, icon, value, suffix, label1, label2) {
    var center = x + w / 2;
    if (icon === 'storage') drawStorageIcon(center, y + 23, 0.95);
    if (icon === 'flag') drawFlagIcon(center - 9, y + 14, 0.9);
    if (icon === 'gauge') drawGauge(center, y + 36, 22, fillAvg / 100);
    if (icon === 'arrow') drawArrowIcon(center - 19, y + 18);

    if (icon !== 'gauge') {
      drawCenteredValueWithSuffix(value, suffix, x, y + 62, w);
    }
    doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(8.7);
    doc.text(label1, x + w / 2, y + 88 + 8.7 * 0.82, { align: 'center' });
    doc.setFont('Helvetica', 'Bold');
    doc.text(label2, x + w / 2, y + 103 + 8.7 * 0.82, { align: 'center' });
  }

  function drawHeaderTank(x, y, s) {
    s = s || 1;
    doc.setDrawColor(navy).setLineWidth(0.8);
    doc.ellipse(x + 34 * s, y + 12 * s, 24 * s, 5 * s, 'S');
    doc.line(x + 10 * s, y + 12 * s, x + 10 * s, y + 55 * s);
    doc.line(x + 58 * s, y + 12 * s, x + 58 * s, y + 55 * s);
    doc.ellipse(x + 34 * s, y + 55 * s, 24 * s, 5 * s, 'S');
    doc.line(x + 2 * s, y + 18 * s, x + 2 * s, y + 61 * s);
    for (var i = 0; i < 7; i++) {
      doc.line(x - 2 * s, y + (22 + i * 6) * s, x + 8 * s, y + (22 + i * 6) * s);
    }
    doc.setFillColor(navy);
    doc.rect(x + 10 * s, y + 31 * s, 48 * s, 24 * s, 'FD');
  }

  function drawTankCard(tank, x, y, w, h) {
    roundedBox(x, y, w, h, 6);
    doc.setTextColor(navy).setFont('Helvetica', 'Bold').setFontSize(10);
    doc.text(tank.id, x + w / 2, y + 10 + 10 * 0.82, { align: 'center' });
    drawTankGraphic(x + 25, y + 34, w - 50, 84, tank);
    var lines = [
      [_tr('Capacidad máxima:'), fmt(tank.max) + ' bbl', false],
      [_tr('Nivel actual (existente):'), fmt(tank.current) + ' bbl', false],
      [_tr('Utilizacion:'), pct(tank) + '%', true],
    ];
    var yy = y + 117;
    lines.forEach(function(item) {
      var a = item[0];
      var b = item[1];
      var bold = item[2];
      doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(8.5);
      doc.text(a, x + 18 + 94, yy + 8.5 * 0.82, { align: 'right' });
      doc.setFont('Helvetica', bold ? 'Bold' : 'Normal');
      doc.text(b, x + 118, yy + 8.5 * 0.82, { align: 'left' });
      yy += 16;
    });
  }

  function drawTankGraphic(x, y, w, h, tank) {
    var fill = Math.max(0.05, tank.current / tank.max);
    var tankX = x + 22;
    var tankY = y + 1;
    var tankW = w - 36;
    var tankH = h - 17;
    var waterH = Math.max(5, tankH * fill);
    var waterY = tankY + tankH - waterH;

    // Shadow at the bottom
    doc.setFillColor('#d8d8d8');
    doc.ellipse(tankX + tankW / 2, tankY + tankH + 4, tankW / 2 + 5, 3, 'F');

    // Water fill
    if (tank.current > 0) {
      doc.setFillColor('#1497f2');
      doc.ellipse(tankX + tankW / 2, tankY + tankH, tankW / 2 - 1, 5, 'F');
      doc.rect(tankX + 1, waterY, tankW - 2, waterH, 'F');
      doc.ellipse(tankX + tankW / 2, waterY, tankW / 2 - 1, 5, 'F');
    }

    // Outlines
    doc.setDrawColor(navy).setLineWidth(0.8);
    doc.line(tankX, tankY + 4, tankX, tankY + tankH);
    doc.line(tankX + tankW, tankY + 4, tankX + tankW, tankY + tankH);
    doc.ellipse(tankX + tankW / 2, tankY + 6, tankW / 2, 7, 'S');
    doc.ellipse(tankX + tankW / 2, tankY + tankH, tankW / 2, 6, 'S');
    doc.line(tankX + 17, tankY, tankX + 17, tankY + 14);
    doc.line(tankX + tankW - 17, tankY, tankX + tankW - 17, tankY + 14);

    // Label inside tank
    var labelY = pct(tank) < 10 ? tankY + 40 : waterY + waterH / 2 - 10;
    doc.setTextColor(pct(tank) < 10 ? navy : 'white').setFont('Helvetica', 'Bold').setFontSize(10);
    doc.text(fmt(tank.current) + ' bbl', tankX + tankW / 2, labelY + 10 * 0.82, { align: 'center' });
    doc.text('(' + pct(tank) + '%)', tankX + tankW / 2, labelY + 12 + 10 * 0.82, { align: 'center' });

    // Glass gauge column left
    doc.setDrawColor(navy).setLineWidth(0.8);
    doc.rect(tankX - 13, tankY + 12, 9, tankH - 5, 'S');
    for (var i = 0; i < 7; i++) {
      doc.line(tankX - 18, tankY + 16 + i * 8, tankX - 4, tankY + 16 + i * 8);
    }
    doc.line(tankX - 19, tankY + tankH + 5, tankX - 12, tankY + tankH - 10);
    doc.line(tankX - 12, tankY + tankH - 10, tankX - 12, tankY + tankH + 5);
    doc.line(tankX - 19, tankY + tankH + 5, tankX - 12, tankY + tankH + 5);
    doc.line(tankX - 25, tankY + tankH + 5, tankX - 3, tankY + tankH + 5);
  }

  function drawSummaryTable(x, y, w, h) {
    var maxTk = report.tanks.reduce(function(a, b) { return b.current > a.current ? b : a; }, report.tanks[0]);
    var minTk = report.tanks.reduce(function(a, b) { return b.current < a.current ? b : a; }, report.tanks[0]);
    var rows = [
      [_tr('Tanques totales'), '3'],
      [_tr('Capacidad total (maxima)'), fmt(totalMax) + ' bbl'],
      [_tr('Volumen total actual (existente)'), fmt(totalCurrent) + ' bbl'],
      [_tr('Promedio de llenado'), fillAvg + '%'],
      [_tr('Tanque con mayor nivel'), maxTk.id + ' (' + fmt(maxTk.current) + ' bbl)'],
      [_tr('Tanque con menor nivel'), minTk.id + ' (' + fmt(minTk.current) + ' bbl)'],
    ];
    roundedBox(x, y, w, h, 4);
    doc.setFillColor(navy);
    doc.roundedRect(x, y, w, 18, 3, 3, 'F');
    doc.setTextColor('white').setFont('Helvetica', 'Bold').setFontSize(8.5);
    doc.text(_tr('Concepto'), x + 10, y + 6 + 8.5 * 0.82);
    doc.text(_tr('Valor'), x + w - 74, y + 6 + 8.5 * 0.82);
    
    var rowH = (h - 18) / rows.length;
    doc.setDrawColor('#dbe3ef').setLineWidth(0.5);
    rows.forEach(function(r, i) {
      var yy = y + 18 + i * rowH;
      doc.line(x, yy + rowH, x + w, yy + rowH);
      doc.line(x + w * 0.64, yy, x + w * 0.64, yy + rowH);
      doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(8.5);
      doc.text(r[0], x + 10, yy + 7 + 8.5 * 0.82);
      doc.text(r[1], x + w * 0.64 + (w * 0.36) / 2, yy + 7 + 8.5 * 0.82, { align: 'center' });
    });
  }

  function drawDonutTitle(label, x, y) {
    doc.setTextColor(navy).setFont('Helvetica', 'Bold').setFontSize(9.8);
    doc.text(label, x, y + 9.8 * 0.82);
  }

  function drawDonut(x, y, r) {
    function drawSector(startDeg, endDeg, color) {
      if (Math.abs(endDeg - startDeg) < 0.1) return;
      var pts = [[x, y]];
      var step = Math.max(2, Math.abs(endDeg - startDeg) / 32);
      for (var a = startDeg; a <= endDeg; a += step) {
        var rad = (a * Math.PI) / 180;
        pts.push([x + Math.cos(rad) * r, y + Math.sin(rad) * r]);
      }
      var endRad = (endDeg * Math.PI) / 180;
      pts.push([x + Math.cos(endRad) * r, y + Math.sin(endRad) * r]);
      pts.push([x, y]);
      
      doc.setFillColor(color);
      for (var pi = 1; pi < pts.length - 1; pi++) {
        doc.triangle(
          pts[0][0], pts[0][1],
          pts[pi][0], pts[pi][1],
          pts[pi+1][0], pts[pi+1][1],
          'F'
        );
      }
    }

    var total = report.tanks.reduce(function(sum, t) { return sum + t.current; }, 0);
    var currentAngle = -90;
    
    if (total === 0) {
      doc.setFillColor('#8f949c');
      doc.ellipse(x, y, r, r, 'F');
    } else {
      report.tanks.forEach(function(tank) {
        var share = tank.current / total;
        var sweep = share * 360;
        drawSector(currentAngle, currentAngle + sweep, tank.color);
        
        var midAngle = currentAngle + sweep / 2;
        var midRad = (midAngle * Math.PI) / 180;
        var lx = x + Math.cos(midRad) * (r * 0.72);
        var ly = y + Math.sin(midRad) * (r * 0.72);
        
        if (sweep > 15) {
          doc.setTextColor('white').setFont('Helvetica', 'Bold').setFontSize(9);
          var pctText = Math.round(share * 100) + '%';
          doc.text(fmt(tank.current), lx, ly - 3 + 9 * 0.82, { align: 'center' });
          doc.text('(' + pctText + ')', lx, ly + 6 + 9 * 0.82, { align: 'center' });
        }
        currentAngle += sweep;
      });
    }
    
    doc.setFillColor('white');
    doc.ellipse(x, y, r * 0.47, r * 0.47, 'F');
  }

  function drawLegend(x, y) {
    report.tanks.forEach(function(t, i) {
      var yy = y + i * 28;
      doc.setFillColor(t.color);
      doc.roundedRect(x, yy, 10, 10, 2, 2, 'F');
      var percent = totalCurrent ? Math.round((t.current / totalCurrent) * 100) : 0;
      doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(9.5);
      doc.text(t.id, x + 20, yy - 1 + 9.5 * 0.82);
      doc.text(fmt(t.current) + ' bbl (' + percent + '%)', x + 64, yy - 1 + 9.5 * 0.82);
    });
  }

  function drawTrendChart(tank, x, y, w, h, tankIndex) {
    doc.setTextColor(tank.color).setFont('Helvetica', 'Bold').setFontSize(10);
    doc.text(tank.id, x + w / 2, y + 10 * 0.82, { align: 'center' });
    
    var top = y + 24;
    var left = x + 26;
    var chartW = w - 34;
    var chartH = h - 60;
    
    doc.setTextColor(text).setFont('Helvetica', 'Bold').setFontSize(6.5);
    doc.text('Barriles (bbl)', x, top - 11 + 6.5 * 0.82);
    
    doc.setDrawColor('#dfe6ef').setLineWidth(0.55);
    for (var i = 0; i <= 4; i++) {
      var yy = top + (chartH / 4) * i;
      var val = Math.round(tank.max * (1 - i / 4));
      doc.line(left, yy, left + chartW, yy);
      doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(6.4);
      doc.text(fmt(val), x + 24, yy - 4 + 6.4 * 0.82, { align: 'right' });
    }
    
    doc.setDrawColor('#c8d3e3').setLineWidth(1.0);
    doc.line(left, top, left, top + chartH);
    doc.line(left, top + chartH, left + chartW, top + chartH);

    // Get dynamic history series values
    var values = [];
    var keys = ['niv601', 'niv602', 'niv741'];
    var key = keys[tankIndex];
    var factor = F[tankIndex];
    if (hist && hist.length > 0) {
      var step = Math.max(1, Math.floor(hist.length / 12));
      for (var k = 0; k < hist.length && values.length < 12; k += step) {
        var valFloat = parseFloat(hist[k][key]);
        values.push(isNaN(valFloat) ? 0 : Math.round(valFloat * factor));
      }
      while (values.length < 12) {
        values.push(values[values.length - 1] || 0);
      }
    } else {
      values = Array.from({ length: 12 }, function(_, idx) {
        return tank.current + Math.sin(idx * 0.65) * tank.max * 0.01 - idx * tank.max * 0.002;
      });
      if (tank.current === 0) values.fill(0);
    }
    
    doc.setDrawColor(tank.color).setLineWidth(1.3);
    var lastX, lastY;
    values.forEach(function(v, idx) {
      var xx = left + (chartW / (values.length - 1)) * idx;
      var yy = top + chartH - (Math.max(0, v) / tank.max) * chartH;
      if (idx > 0) {
        doc.line(lastX, lastY, xx, yy);
      }
      lastX = xx;
      lastY = yy;
    });
    
    // Draw dynamic time labels
    var labels = [];
    if (hist && hist.length >= 7) {
      var tStep = Math.floor(hist.length / 6);
      for (var lIdx = 0; lIdx < 7; lIdx++) {
        var rowIdx = Math.min(lIdx * tStep, hist.length - 1);
        var row = hist[rowIdx];
        if (row && row.ts) {
          var dt = _parseDate(row.ts);
          var dd = ("0" + dt.getDate()).slice(-2);
          var mm = ("0" + (dt.getMonth() + 1)).slice(-2);
          var hh = ("0" + dt.getHours()).slice(-2);
          var min = ("0" + dt.getMinutes()).slice(-2);
          labels.push(dd + '/' + mm + '\n' + hh + ':' + min);
        } else {
          labels.push('--/--\n--:--');
        }
      }
    } else {
      labels = ['24/05\n10:36', '24/05\n14:36', '24/05\n18:36', '24/05\n22:36', '25/05\n02:36', '25/05\n06:36', '25/05\n10:36'];
    }

    labels.forEach(function(l, idx) {
      var parts = l.split('\n');
      var xx = left - 5 + (chartW / 6) * idx;
      doc.setTextColor(text).setFontSize(6.2).setFont('Helvetica', 'Normal');
      doc.text(parts[0], xx + 16, top + chartH + 7 + 6.2 * 0.82, { align: 'center' });
      doc.text(parts[1], xx + 16, top + chartH + 14 + 6.2 * 0.82, { align: 'center' });
    });
    
    doc.setDrawColor(tank.color).setLineWidth(1.4);
    doc.line(x + 58, y + h - 11, x + 73, y + h - 11);
    doc.setTextColor(text).setFontSize(8);
    doc.text('Nivel actual (bbl)', x + 79, y + h - 15 + 8 * 0.82);
  }

  function drawMessage(x, y, iconColor, iconText, message) {
    doc.setFillColor(iconColor);
    doc.ellipse(x + 12, y + 9, 8, 8, 'F');
    var fs = iconText.length > 1 ? 5.8 : 10;
    doc.setTextColor('white').setFont('Helvetica', 'Bold').setFontSize(fs);
    var yOffset = iconText.length > 1 ? 2 : 3.5;
    doc.text(iconText, x + 12, y + 9 + yOffset, { align: 'center' });
    doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(9);
    doc.text(message, x + 28, y + 3 + 9 * 0.82, { maxWidth: 535 });
  }

  // Draw Page content
  doc.setFillColor('white');
  doc.rect(0, 0, W, H, 'F');
  
  doc.setTextColor(navy).setFont('Helvetica', 'Bold').setFontSize(36);
  doc.text(_tr('RESUMEN ERB E41'), 22, 20 + 36 * 0.82);
  
  doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(11);
  doc.text(_tr('Reporte generado el') + ' ' + report.date, 23, 61 + 11 * 0.82);
  
  drawHeaderTank(514, 17, 0.93);
  doc.setDrawColor(navy).setLineWidth(1.0);
  doc.line(20, 84, 592, 84);

  sectionTitle(_tr('INDICADORES CLAVE'), 22, 97);
  roundedBox(22, 116, 568, 120, 7);
  doc.setDrawColor('#d7dfec').setLineWidth(0.7);
  for (var i = 1; i < 4; i++) {
    doc.line(22 + (568 / 4) * i, 124, 22 + (568 / 4) * i, 224);
  }
  
  drawKeyMetric(22, 116, 142, 'storage', '3', '', _tr('Tanques totales'), '');
  drawKeyMetric(164, 116, 142, 'flag', fmt(totalMax), 'bbl', _tr('Capacidad total'), _tr('(maxima)'));
  drawKeyMetric(306, 116, 142, 'gauge', '', '', _tr('Promedio de llenado'), _tr('(% de capacidad)'));
  drawKeyMetric(448, 116, 142, 'arrow', fmt(totalCurrent), 'bbl', _tr('Volumen total actual'), _tr('(barriles existentes)'));

  sectionTitle(_tr('RESUMEN DE INVENTARIO POR TANQUE'), 22, 253);
  drawTankCard(report.tanks[0], 22, 272, 180, 171);
  drawTankCard(report.tanks[1], 218, 272, 176, 171);
  drawTankCard(report.tanks[2], 410, 272, 180, 171);

  sectionTitle(_tr('RESUMEN GENERAL'), 22, 459);
  drawSummaryTable(22, 477, 258, 146);
  
  drawDonutTitle(_tr('DISTRIBUCION DE NIVEL ACTUAL (BARRILES EXISTENTES)'), 302, 459);
  drawDonut(374, 550, 68);
  drawLegend(460, 509);

  sectionTitle(_tr('TENDENCIA DE NIVEL  (BARRILES EXISTENTES - ULTIMAS 24 HORAS)'), 22, 645);
  drawTrendChart(report.tanks[0], 22, 669, 176, 140, 0);
  drawTrendChart(report.tanks[1], 215, 669, 176, 140, 1);
  drawTrendChart(report.tanks[2], 408, 669, 176, 140, 2);

  // Dynamic messages
  var maxTk = report.tanks.reduce(function(a, b) { return b.current > a.current ? b : a; }, report.tanks[0]);
  var minTk = report.tanks.reduce(function(a, b) { return b.current < a.current ? b : a; }, report.tanks[0]);
  
  var msg1 = _tr('El sistema opera con un promedio de llenado del {avg}%, dentro de rangos seguros.').replace('{avg}', fillAvg);
  var msg2 = _tr('El tanque {id} presenta el mayor nivel de {vol} barriles ({pct}% de su capacidad).').replace('{id}', maxTk.id).replace('{vol}', fmt(maxTk.current)).replace('{pct}', pct(maxTk));
  var msg3 = _tr('Todos los tanques operan dentro de los rangos normales.');
  var emptyTanks = report.tanks.filter(function(t) { return t.current === 0; });
  if (emptyTanks.length > 0) {
    msg3 = _tr('El tanque {id} se encuentra vacio. Se recomienda evaluar su programacion de uso.').replace('{id}', emptyTanks[0].id);
  } else {
    msg3 = _tr('El tanque {id} presenta el menor nivel de {vol} barriles ({pct}% de su capacidad).').replace('{id}', minTk.id).replace('{vol}', fmt(minTk.current)).replace('{pct}', pct(minTk));
  }

  sectionTitle(_tr('MENSAJES CLAVE'), 22, 823);
  drawMessage(22, 842, green, 'OK', msg1);
  drawMessage(22, 861, blue, 'i', msg2);
  drawMessage(22, 880, gray, '!', msg3);
  
  doc.setDrawColor(navy).setLineWidth(0.8);
  doc.line(20, 891, 592, 891);
  
  doc.setTextColor(text).setFont('Helvetica', 'Normal').setFontSize(8.5);
  doc.text(_tr('Pagina 1 de 1'), 24, 901 + 8.5 * 0.82);
  doc.text(_tr('Reporte generado automaticamente. No requiere firma.'), 362, 901 + 8.5 * 0.82);

  doc.save("Reporte_ERB_E41_" + _slug(now) + ".pdf");
}

/* ═══════════════════════════════════════════════
   POZO PDF  — identical to prototype image 2
   ═══════════════════════════════════════════════ */
function generatePozoPDF(nombre) {
  var JC = _jsPDF(); if (!JC) return;
  var doc = new JC({ orientation:"portrait", unit:"pt", format:"letter" });
  patchDocText(doc);
  var W=612, H=792, M=40;
  var now = new Date();

  /* ── data ── */
  var latest = DB.getPozoLatest(nombre);
  if (!latest){ alert("Sin datos del pozo."); return; }
  var hist = DB.getPozoHistory(nombre,24);
  var av={
    ptp:_avg(hist,"ptp"), par:_avg(hist,"par"), I:_avg(hist,"I"),
    temp:_avg(hist,"temp"), vll:_avg(hist,"vll"), freq:_avg(hist,"freq"), gRPM:_avg(hist,"gRPM")
  };

  doc.setFillColor(255,255,255); doc.rect(0,0,W,H,"F");

  var y=M;

  /* ════ HEADER ════ */
  doc.setFont("helvetica","bold"); doc.setFontSize(30);
  doc.setTextColor(5,30,80);
  doc.text(_tr('RESUMEN')+" "+nombre.toUpperCase(), M, y+30);
  doc.setFont("helvetica","normal"); doc.setFontSize(10);
  doc.setTextColor(100,120,150);
  doc.text(_tr('Reporte generado el')+" "+_dateEs(now)+" – "+_timeHM(now), M, y+48);
  y+=62;
  doc.setDrawColor(29,122,245); doc.setLineWidth(1.5);
  doc.line(M,y,W-M,y); y+=12;

  /* ════ SECTION 1: INDICADORES CLAVE ════ */
  y = _secHeaderDark(doc,"1. "+_tr('INDICADORES CLAVE (EN TIEMPO REAL)'),M,y,W-2*M); y+=8;

  var metrics=[
    {lbl:_tr("Presión en TP"), val:latest.ptp,  avg:av.ptp,  unit:"PSI",  dec:0, color:[29,122,245],  ico:"gauge"},
    {lbl:_tr("Torque"),        val:latest.par,  avg:av.par,  unit:"lb-ft",dec:0, color:[155,89,182], ico:"wrench"},
    {lbl:_tr("Corriente"),     val:latest.I,    avg:av.I,    unit:"A",    dec:1, color:[46,204,113],  ico:"bolt"},
    {lbl:_tr("Gen - Temperatura"), val:latest.temp,avg:av.temp,unit:"°C",dec:1, color:[243,156,18], ico:"thermo"},
    {lbl:_tr("Gen - Voltaje L-L"), val:latest.vll, avg:av.vll, unit:"V",  dec:1, color:[241,196,15], ico:"volt"},
    {lbl:_tr("Gen - Frecuencia"),  val:latest.freq,avg:av.freq,unit:"Hz", dec:1, color:[0,210,211],  ico:"wave"},
    {lbl:_tr("Gen - RPM"),         val:latest.gRPM,avg:av.gRPM,unit:"RPM",dec:0, color:[243,104,224],ico:"rpm"},
  ];

  var mW=(W-2*M-18)/7, mH=78;
  metrics.forEach(function(m,i){
    var mx=M+i*(mW+3);
    doc.setFillColor(240,245,255); doc.roundedRect(mx,y,mW,mH,3,3,"F");
    doc.setDrawColor(200,215,240); doc.setLineWidth(0.4); doc.roundedRect(mx,y,mW,mH,3,3,"S");
    /* label */
    doc.setFont("helvetica","bold"); doc.setFontSize(5.5); doc.setTextColor(90,110,145);
    var lblLines=doc.splitTextToSize(m.lbl.toUpperCase(),mW-4);
    doc.text(lblLines,mx+mW/2,y+8,{align:"center"});
    /* icon */
    _mIcon(doc,mx+mW/2,y+22,14,m.ico,m.color);
    /* value */
    doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.setTextColor(5,30,80);
    doc.text(_n(m.val,m.dec),mx+mW/2,y+40,{align:"center"});
    /* unit */
    doc.setFont("helvetica","normal"); doc.setFontSize(7); doc.setTextColor(90,110,145);
    doc.text(m.unit,mx+mW/2,y+48,{align:"center"});
    /* avg */
    doc.setFontSize(6); doc.setTextColor(100,120,150);
    doc.text(_tr('Promedio')+": "+_n(m.avg,m.dec)+" "+m.unit,mx+mW/2,y+58,{align:"center",maxWidth:mW-2});
    /* trend */
    var pct=m.avg?(((m.val-m.avg)/m.avg)*100):0;
    var arrow=pct>=0?"↑ ":"↓ ";
    doc.setFont("helvetica","bold"); doc.setFontSize(6.5);
    doc.setTextColor.apply(doc, pct>=0?[46,204,113]:[231,76,60]);
    doc.text(arrow+Math.abs(pct).toFixed(1)+"%",mx+mW/2,y+68,{align:"center"});
  });
  y+=mH+12;

  /* ════ SECTION 2: TENDENCIAS ════ */
  y = _secHeaderDark(doc,"2. "+_tr('TENDENCIAS – ÚLTIMAS 24 HORAS'),M,y,W-2*M); y+=8;

  var bigW=(W-2*M-8)/2, bigH=95;
  /* row 1 */
  _darkChart(doc,M,         y,bigW,bigH,"Presión en TP (PSI)",hist,"ptp",[29,122,245]);
  _darkChart(doc,M+bigW+8,  y,bigW,bigH,"Torque (lb-ft)",     hist,"par",[155,89,182]);
  y+=bigH+8;
  /* row 2 */
  _darkChart(doc,M,         y,bigW,bigH,"Corriente (A)",      hist,"I",  [46,204,113]);
  _darkChart(doc,M+bigW+8,  y,bigW,bigH,"Temperatura (°C)",   hist,"temp",[243,156,18]);
  y+=bigH+8;
  y+=bigH+12;

  /* ════ SECTION 3+4: RESUMEN OPERATIVO + OBSERVACIONES ════ */
  var colW2=(W-2*M-10)/2;

  /* LEFT title */
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(5,30,80);
  doc.text("3. "+_tr('RESUMEN OPERATIVO'),M,y+9);

  /* RIGHT title */
  doc.text("4. "+_tr('OBSERVACIONES CLAVE'),M+colW2+10,y+9);
  y+=14;

  /* operational table */
  var opRows=[
    [_tr("Parámetro"),_tr("Valor Actual"),_tr("Promedio"),_tr("Variación (%)"),_tr("Estado")],
    [_tr("Presión en TP (PSI)"), _n(latest.ptp,0), _n(av.ptp,0), _varStr(latest.ptp,av.ptp), "ok"],
    [_tr("Torque (lb-ft)"),      _n(latest.par,0), _n(av.par,0), _varStr(latest.par,av.par), "ok"],
    [_tr("Corriente (A)"),       _n(latest.I,1),   _n(av.I,1),   _varStr(latest.I,av.I),     "ok"],
    [_tr("Temperatura (°C)"),    _n(latest.temp,1),_n(av.temp,1),_varStr(latest.temp,av.temp),"ok"],
    [_tr("Voltaje L-L (V)"),     _n(latest.vll,1), _n(av.vll,1), _varStr(latest.vll,av.vll), "ok"],
    [_tr("Frecuencia (Hz)"),     _n(latest.freq,1),_n(av.freq,1),_varStr(latest.freq,av.freq),"ok"],
    [_tr("RPM Generador (RPM)"), _n(latest.gRPM,0),_n(av.gRPM,0),_varStr(latest.gRPM,av.gRPM),"ok"],
  ];
  var opCW=[colW2*0.3,colW2*0.17,colW2*0.17,colW2*0.22,colW2*0.1];
  var opRH=13;
  opRows.forEach(function(row,ri){
    var ry=y+ri*opRH;
    var isH=ri===0;
    var bg=isH?[5,30,80]:ri%2===0?[255,255,255]:[237,244,255];
    doc.setFillColor.apply(doc,bg); doc.rect(M,ry,colW2,opRH,"F");
    doc.setFont("helvetica",isH?"bold":"normal"); doc.setFontSize(7);
    var ox=M;
    row.forEach(function(cell,ci){
      var tc=isH?[255,255,255]:[30,50,90];
      if(!isH&&ci===3){ tc=cell.startsWith("↑")?[231,76,60]:[46,204,113]; doc.setFont("helvetica","bold"); }
      else if(!isH&&ci===4){
        /* green dot */
        doc.setFillColor(46,204,113); doc.circle(ox+opCW[ci]/2,ry+opRH/2,3,"F");
        ox+=opCW[ci]; return;
      } else { doc.setFont("helvetica",isH?"bold":"normal"); }
      doc.setTextColor.apply(doc,tc);
      doc.text(String(cell),ox+2,ry+opRH-4,{maxWidth:opCW[ci]-4});
      ox+=opCW[ci];
    });
  });
  var opH=opRows.length*opRH;

  /* RIGHT: observations */
  var obs=_pozoObs(metrics);
  obs.forEach(function(o,i){
    _obsCard(doc,M+colW2+10,y+i*28,colW2,o);
  });

  y+=Math.max(opH,obs.length*28)+12;

  /* ════ SECTION 5: CONCLUSIÓN + ESTADO ════ */
  doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(5,30,80);
  doc.text("5. "+_tr('CONCLUSIÓN'),M,y+9); y+=14;

  var concText=_conclusion(metrics);
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(30,50,90);
  var concLines=doc.splitTextToSize(concText,colW2-6);
  doc.text(concLines,M,y);
  var concH=concLines.length*12;

  /* Estado General badge */
  _estadoBadge(doc,M+colW2+10,y-6,colW2,metrics);

  y+=concH+10;

  /* ════ FOOTER ════ */
  _footer(doc,W,H,M);

  doc.save("Reporte_"+nombre.replace(/\s+/g,"_")+"_"+_slug(now)+".pdf");
}

/* ═══════════════════════════════════════════════
   SHARED DRAWING PRIMITIVES
   ═══════════════════════════════════════════════ */

/* Section header — light blue band with left blue bar */
function _secHeader(doc,text,x,y,w){
  doc.setFillColor(232,241,255); doc.rect(x,y,w,17,"F");
  doc.setFillColor(29,122,245); doc.rect(x,y,3,17,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(5,30,80);
  doc.text(text,x+8,y+11.5);
  return y+17;
}

/* Section header — dark navy band (for pozo) */
function _secHeaderDark(doc,text,x,y,w){
  doc.setFillColor(5,30,80); doc.rect(x,y,w,17,"F");
  doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(255,255,255);
  doc.text(text,x+6,y+11.5);
  return y+17;
}

/* Indicator card with light bg */
function _indCard(doc,x,y,w,h,drawFn){
  doc.setFillColor(245,249,255); doc.roundedRect(x,y,w,h,5,5,"F");
  doc.setDrawColor(210,222,240); doc.setLineWidth(0.5); doc.roundedRect(x,y,w,h,5,5,"S");
  drawFn(x,y);
}

/* Industrial tank visual */
function _industrialTank(doc, x, y, w, h, pct, vol){
  var fill=Math.max(0,Math.min(1,pct/100));
  var innerH=h-6, fillH=innerH*fill;
  /* background body */
  doc.setFillColor(200,215,235);
  doc.roundedRect(x,y,w,h,4,4,"F");
  /* liquid */
  var lc=pct<10?[231,76,60]:pct<20?[230,126,34]:[29,122,245];
  doc.setFillColor.apply(doc,lc);
  if(fillH>0) doc.roundedRect(x+2,y+h-fillH-3,w-4,fillH,2,2,"F");
  /* outline */
  doc.setDrawColor(150,175,210); doc.setLineWidth(1);
  doc.roundedRect(x,y,w,h,4,4,"S");
  /* horizontal rings */
  doc.setDrawColor(170,190,220); doc.setLineWidth(0.4);
  for(var ri=1;ri<=3;ri++){
    var ry=y+ri*(h/4);
    doc.line(x+1,ry,x+w-1,ry);
  }
  /* ladder (right side) */
  doc.setDrawColor(140,165,200); doc.setLineWidth(0.8);
  doc.line(x+w-5,y+4,x+w-5,y+h-4);
  doc.line(x+w-9,y+4,x+w-9,y+h-4);
  for(var li=0;li<=5;li++){
    doc.line(x+w-9,y+4+li*((h-8)/5),x+w-5,y+4+li*((h-8)/5));
  }
  /* text */
  doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(255,255,255);
  doc.text(_n(vol)+" bbl",x+w/2-4,y+h/2-4,{align:"center"});
  doc.setFontSize(7.5);
  doc.text("("+pct.toFixed(0)+"%)",x+w/2-4,y+h/2+6,{align:"center"});
}

/* Donut chart (pie with center hole) */
function _donutChart(doc,cx,cy,r,tanks){
  var total=tanks.reduce(function(s,t){return s+(t.volActual||0);},0);
  var colors=[[39,174,96],[29,122,245],[150,160,175]];
  var angle=-Math.PI/2;
  tanks.forEach(function(t,i){
    var sweep=total>0?(t.volActual/total)*2*Math.PI:0;
    if(sweep===0){angle+=0;return;}
    var steps=Math.max(8,Math.round(sweep*20));
    var pts=[[cx,cy]];
    for(var s=0;s<=steps;s++){
      var a=angle+(s/steps)*sweep;
      pts.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r]);
    }
    pts.push([cx,cy]);
    doc.setFillColor.apply(doc,colors[i]);
    doc.setDrawColor(255,255,255); doc.setLineWidth(1.5);
    /* fill slice via lines from center */
    doc.setLineWidth(0);
    for(var pi=1;pi<pts.length-1;pi++){
      doc.triangle(pts[0][0],pts[0][1],pts[pi][0],pts[pi][1],pts[pi+1]?pts[pi+1][0]:pts[pi][0],pts[pi+1]?pts[pi+1][1]:pts[pi][1],"F");
    }
    /* label in slice */
    var midA=angle+sweep/2;
    var lx=cx+Math.cos(midA)*(r*0.65), ly=cy+Math.sin(midA)*(r*0.65);
    var pctV=total>0?((t.volActual/total)*100).toFixed(0):"0";
    doc.setFont("helvetica","bold"); doc.setFontSize(7); doc.setTextColor(255,255,255);
    doc.text(_n(t.volActual),lx,ly-3,{align:"center"});
    doc.text("("+pctV+"%)",lx,ly+6,{align:"center"});
    angle+=sweep;
  });
  /* white center hole */
  doc.setFillColor(255,255,255);
  _circleFill(doc,cx,cy,r*0.42);
  /* border ring */
  doc.setDrawColor(255,255,255); doc.setLineWidth(2);
  /* legend */
  var legX=cx+r+12, legY=cy-r*0.5;
  tanks.forEach(function(t,i){
    doc.setFillColor.apply(doc,colors[i]);
    doc.rect(legX,legY+i*18,10,10,"F");
    doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(30,50,90);
    var pctV=total>0?((t.volActual/total)*100).toFixed(0):"0";
    doc.text(t.nombre+"  "+_n(t.volActual)+" bbl ("+pctV+"%)",legX+13,legY+i*18+8);
  });
}

/* Sparkline chart (white/light bg) for ERB */
function _sparkline(doc,x,y,w,h,data,color,showAxis,maxV){
  if(!data||data.length<2)return;
  var mn=Math.min.apply(null,data), mx=Math.max.apply(null,data);
  if(maxV!=null) mx=Math.max(mx,maxV||mx);
  if(mx===mn){mx=mn+1;}
  var rng=mx-mn;
  /* y axis ticks */
  doc.setFont("helvetica","normal"); doc.setFontSize(5.5); doc.setTextColor(120,140,165);
  for(var t=0;t<=3;t++){
    var tv=mn+(t/3)*rng;
    var ty=y+h-(t/3)*h;
    doc.setDrawColor(210,220,235); doc.setLineWidth(0.25); doc.line(x,ty,x+w,ty);
    doc.text(_n(tv,0),x-2,ty+1.5,{align:"right"});
  }
  /* line */
  var pts=data.map(function(v,i){return{px:x+(i/(data.length-1))*w,py:y+h-((v-mn)/rng)*h};});
  doc.setDrawColor.apply(doc,color); doc.setLineWidth(1.2);
  for(var i=0;i<pts.length-1;i++) doc.line(pts[i].px,pts[i].py,pts[i+1].px,pts[i+1].py);
}

/* Dark-background chart block (for pozo trends) */
function _darkChart(doc,x,y,w,h,title,hist,key,color){
  /* dark bg card */
  doc.setFillColor(12,25,55); doc.roundedRect(x,y,w,h,3,3,"F");
  doc.setDrawColor(30,50,90); doc.setLineWidth(0.5); doc.roundedRect(x,y,w,h,3,3,"S");
  /* title */
  doc.setFont("helvetica","bold"); doc.setFontSize(8);
  doc.setTextColor.apply(doc,color);
  doc.text(title,x+6,y+12);
  /* data */
  var data=_series(hist,key,24);
  if(data.length<2){ data=[0,0]; }
  var mn=Math.min.apply(null,data), mx2=Math.max.apply(null,data);
  if(mx2===mn){mx2=mn+1;}
  var rng=mx2-mn;
  
  var chLeft = 32;
  var ch=h-42, cw=w-chLeft-10;
  
  /* y grid lines */
  for(var t=0;t<=3;t++){
    var tv=mn+(t/3)*rng;
    var ty=y+h-24-(t/3)*ch;
    doc.setDrawColor(30,50,100); doc.setLineWidth(0.25); doc.line(x+chLeft,ty,x+chLeft+cw,ty);
    doc.setFont("helvetica","normal"); doc.setFontSize(5.5); doc.setTextColor(80,110,160);
    doc.text(_n(tv,1),x+chLeft-2,ty+1.5,{align:"right"});
  }
  
  /* line */
  var lastX, lastY;
  data.forEach(function(v, idx) {
    var xx = x + chLeft + (idx / (data.length - 1)) * cw;
    var yy = y + h - 24 - ((v - mn) / rng) * ch;
    if (idx > 0) {
      doc.line(lastX, lastY, xx, yy);
    }
    lastX = xx;
    lastY = yy;
  });
  
  // Draw dynamic X-axis time labels at the bottom
  var tLabels = [];
  if (hist && hist.length >= 4) {
    var tStep = Math.max(1, Math.floor(hist.length / 3));
    for (var lIdx = 0; lIdx < 4; lIdx++) {
      var rIdx = Math.min(lIdx * tStep, hist.length - 1);
      var row = hist[rIdx];
      if (row && row.ts) {
        var dt = _parseDate(row.ts);
        var hh = ("0" + dt.getHours()).slice(-2);
        var min = ("0" + dt.getMinutes()).slice(-2);
        tLabels.push(hh + ":" + min);
      } else {
        tLabels.push("--:--");
      }
    }
  } else {
    tLabels = ["10:36", "14:36", "18:36", "22:36"];
  }
  
  doc.setFont("helvetica","normal").setFontSize(5.5).setTextColor(150,175,210);
  tLabels.forEach(function(lbl, idx) {
    var lx = x + chLeft + (cw / 3) * idx;
    doc.text(lbl, lx, y+h-14, {align: "center"});
  });

  /* legend */
  doc.setFillColor.apply(doc,color); doc.rect(x+6,y+h-9,12,1,"F");
  doc.setFont("helvetica","normal"); doc.setFontSize(5.5); doc.setTextColor(150,175,210);
  doc.text(title,x+20,y+h-8);
}

/* Message row (with icon) */
function _msgRow(doc,x,y,w,text,type){
  var bg=type==="ok"?[237,252,242]:type==="info"?[237,244,255]:[255,248,230];
  var ic=type==="ok"?[39,174,96]:type==="info"?[29,122,245]:[230,126,34];
  doc.setFillColor.apply(doc,bg); doc.roundedRect(x,y,w,22,4,4,"F");
  /* icon circle */
  doc.setFillColor.apply(doc,ic); _circleFill(doc,x+12,y+11,8);
  doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(255,255,255);
  var sym=type==="ok"?"✓":type==="info"?"i":"!";
  doc.text(sym,x+12,y+14,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(20,40,80);
  doc.text(text,x+24,y+14,{maxWidth:w-28});
}

/* Observation card (right column, pozo PDF) */
function _obsCard(doc,x,y,w,o){
  doc.setFillColor(245,249,255); doc.roundedRect(x,y,w,24,4,4,"F");
  doc.setDrawColor(210,222,240); doc.setLineWidth(0.4); doc.roundedRect(x,y,w,24,4,4,"S");
  /* icon */
  doc.setFillColor.apply(doc,o.color); _circleFill(doc,x+12,y+12,8);
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(255,255,255);
  doc.text(o.sym,x+12,y+15,{align:"center"});
  doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(20,40,80);
  doc.text(o.text,x+24,y+9,{maxWidth:w-28});
}

/* Estado General badge */
function _estadoBadge(doc,x,y,w,metrics){
  var issues=metrics.filter(function(m){
    return m.avg&&Math.abs(((m.val-m.avg)/m.avg)*100)>15;
  });
  var isNorm=issues.length===0;
  var bg=isNorm?[29,100,210]:[180,30,30];
  doc.setFillColor.apply(doc,bg); doc.roundedRect(x,y,w-10,52,8,8,"F");
  /* shield icon */
  doc.setFillColor(255,255,255,0.3); doc.setDrawColor(255,255,255); doc.setLineWidth(1);
  var sx=x+12,sy=y+8,sw=18,sh=22;
  doc.line(sx,sy,sx+sw,sy); doc.line(sx,sy,sx,sy+sh*0.7);
  doc.line(sx+sw,sy,sx+sw,sy+sh*0.7);
  doc.line(sx,sy+sh*0.7,sx+sw/2,sy+sh); doc.line(sx+sw,sy+sh*0.7,sx+sw/2,sy+sh);
  /* text */
  doc.setFont("helvetica","bold"); doc.setFontSize(7.5); doc.setTextColor(255,255,255);
  doc.text(_tr('ESTADO GENERAL'),x+(w-10)/2,y+19,{align:"center"});
  doc.setFontSize(16);
  doc.text(isNorm?_tr('NORMAL'):_tr('ATENCION'),x+(w-10)/2,y+40,{align:"center"});
}

/* Footer */
function _footer(doc,W,H,M){
  var fy=H-20;
  doc.setDrawColor(200,215,235); doc.setLineWidth(0.5); doc.line(M,fy-6,W-M,fy-6);
  doc.setFont("helvetica","normal"); doc.setFontSize(7.5); doc.setTextColor(120,140,165);
  doc.text(_tr('Pagina 1 de 1'),M,fy+5);
  doc.text(_tr('Reporte generado automaticamente. No requiere firma.'),W-M,fy+5,{align:"right"});
}

/* ─── Icon drawings ─── */
function _icoDatabase(doc,x,y,s){
  doc.setDrawColor(29,122,245); doc.setLineWidth(1.2);
  doc.ellipse(x+s/2,y+s*0.18,s/2,s*0.18,"S");
  doc.line(x,y+s*0.18,x,y+s*0.55); doc.line(x+s,y+s*0.18,x+s,y+s*0.55);
  doc.ellipse(x+s/2,y+s*0.55,s/2,s*0.18,"S");
  doc.line(x,y+s*0.55,x,y+s*0.88); doc.line(x+s,y+s*0.55,x+s,y+s*0.88);
  doc.ellipse(x+s/2,y+s*0.88,s/2,s*0.18,"S");
}
function _icoFlag(doc,x,y,s){
  doc.setDrawColor(29,122,245); doc.setLineWidth(1.2);
  doc.line(x+s*0.2,y,x+s*0.2,y+s);
  doc.line(x+s*0.2,y,x+s,y+s*0.28);
  doc.line(x+s,y+s*0.28,x+s*0.2,y+s*0.56);
}
function _icoTrendUp(doc,x,y,s){
  doc.setDrawColor(29,122,245); doc.setLineWidth(1.5);
  doc.line(x,y+s*0.7,x+s*0.4,y+s*0.35);
  doc.line(x+s*0.4,y+s*0.35,x+s*0.65,y+s*0.6);
  doc.line(x+s*0.65,y+s*0.6,x+s,y+s*0.15);
  doc.line(x+s*0.7,y+s*0.15,x+s,y+s*0.15);
  doc.line(x+s,y+s*0.15,x+s,y+s*0.38);
}
function _icoGaugeCircle(doc,x,y,s,pct){
  var cx=x+s/2,cy=y+s/2+2,r=s/2-2;
  /* background arc */
  doc.setDrawColor(220,230,245); doc.setLineWidth(3.5);
  _arc(doc,cx,cy,r,-Math.PI*0.8,Math.PI*0.8);
  /* filled arc */
  doc.setDrawColor(39,174,96); doc.setLineWidth(3.5);
  _arc(doc,cx,cy,r,-Math.PI*0.8,-Math.PI*0.8+(pct/100)*Math.PI*1.6);
  /* center text */
  doc.setFont("helvetica","bold"); doc.setFontSize(12); doc.setTextColor(5,30,80);
  doc.text(pct.toFixed(0)+"%",cx,cy+4,{align:"center"});
}
function _derrickIcon(doc,x,y,w,h){
  doc.setDrawColor(100,130,180); doc.setLineWidth(1.5);
  doc.line(x+w/2,y+3,x+2,y+h-4);
  doc.line(x+w/2,y+3,x+w-2,y+h-4);
  doc.line(x+2,y+h-4,x+w-2,y+h-4);
  doc.setLineWidth(0.8);
  doc.line(x+w*0.3,y+h*0.4,x+w*0.7,y+h*0.4);
  doc.line(x+w*0.2,y+h*0.65,x+w*0.8,y+h*0.65);
  /* pump arm */
  doc.setLineWidth(1.5);
  doc.line(x+w*0.5,y+h-4,x+w*0.5,y+h+4);
  doc.ellipse(x+w*0.5,y+h+8,6,4,"S");
}
function _erbTankIcon(doc,x,y,w,h){
  /* round tank shape */
  doc.setFillColor(25,60,130); doc.roundedRect(x,y,w,h*0.82,6,6,"F");
  /* liquid fill */
  doc.setFillColor(29,122,245); doc.roundedRect(x+4,y+h*0.38,w-8,h*0.42,4,4,"F");
  /* outline */
  doc.setDrawColor(100,150,220); doc.setLineWidth(1);
  doc.roundedRect(x,y,w,h*0.82,6,6,"S");
  /* top dome */
  doc.setFillColor(20,50,110); doc.ellipse(x+w/2,y+5,w/2-1,8,"F");
  doc.setDrawColor(100,150,220); doc.setLineWidth(1); doc.ellipse(x+w/2,y+5,w/2-1,8,"S");
}

function _mIcon(doc,cx,cy,s,type,color){
  doc.setDrawColor.apply(doc,color); doc.setLineWidth(1.2);
  doc.setFillColor.apply(doc,color);
  if(type==="gauge"){
    doc.ellipse(cx, cy, 7, 7, 'S');
    doc.line(cx, cy, cx - 2, cy - 5);
    doc.ellipse(cx, cy, 1.2, 1.2, 'F');
  } else if(type==="wrench"){
    doc.line(cx - 5, cy + 5, cx + 2, cy - 2);
    doc.ellipse(cx + 4, cy - 4, 3.5, 3.5, 'S');
    doc.setFillColor(240, 245, 255);
    doc.rect(cx + 2.5, cy - 5.5, 3, 3, 'F');
  } else if(type==="bolt"){
    doc.setLineWidth(1.5);
    doc.line(cx + 2, cy - 8, cx - 3, cy + 1);
    doc.line(cx - 3, cy + 1, cx + 2, cy + 1);
    doc.line(cx + 2, cy + 1, cx - 2, cy + 8);
  } else if(type==="thermo"){
    doc.setFillColor.apply(doc, color);
    doc.ellipse(cx, cy + 5, 4, 4, 'F');
    doc.roundedRect(cx - 2, cy - 8, 4, 11, 2, 2, 'F');
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(cx - 1, cy - 7, 2, 9, 1, 1, 'F');
    doc.setFillColor.apply(doc, color);
    doc.ellipse(cx, cy + 5, 2.5, 2.5, 'F');
    doc.rect(cx - 0.7, cy - 2, 1.4, 7, 'F');
  } else if(type==="volt"){
    doc.ellipse(cx, cy, 7, 7, 'S');
    doc.setFont("helvetica", "bold").setFontSize(7).setTextColor.apply(doc, color);
    doc.text("V", cx, cy + 2.2, { align: "center" });
  } else if(type==="wave"){
    doc.setLineWidth(1.5);
    var pp=[];
    for(var a=0;a<=Math.PI*2;a+=0.2) pp.push([cx-8+a*(16/(Math.PI*2)),cy+Math.sin(a)*5]);
    for(var pi=0;pi<pp.length-1;pi++) doc.line(pp[pi][0],pp[pi][1],pp[pi+1][0],pp[pi+1][1]);
  } else if(type==="rpm"){
    doc.ellipse(cx, cy, 7, 7, 'S');
    doc.line(cx, cy, cx + 5, cy - 3);
    doc.ellipse(cx, cy, 1.2, 1.2, 'F');
  }
}

/* arc approximation with line segments */
function _arc(doc,cx,cy,r,startA,endA){
  var steps=Math.max(12,Math.round(Math.abs(endA-startA)*16));
  for(var i=0;i<steps;i++){
    var a1=startA+(i/steps)*(endA-startA);
    var a2=startA+((i+1)/steps)*(endA-startA);
    doc.line(cx+Math.cos(a1)*r,cy+Math.sin(a1)*r,cx+Math.cos(a2)*r,cy+Math.sin(a2)*r);
  }
}

/* filled circle using ellipse */
function _circleFill(doc,cx,cy,r){
  doc.ellipse(cx,cy,r,r,"F");
}

/* ─── Data helpers ─── */
function _varStr(val,avg){
  if(!avg) return "0%";
  var p=((val-avg)/avg)*100;
  return (p>=0?"↑ ":"↓ ")+Math.abs(p).toFixed(1)+"%";
}

function _erbMessages(tanks,avgPct,totalVol){
  var msgs=[];
  msgs.push({text:_tr('El sistema opera con un promedio de llenado del {avg}%, dentro de rangos seguros.').replace('{avg}',avgPct.toFixed(0)),type:"ok"});
  var mx=tanks.reduce(function(a,b){return b.volActual>a.volActual?b:a;},tanks[0]);
  if(mx) msgs.push({text:_tr('El tanque {id} presenta el mayor nivel de {vol} barriles ({pct}% de su capacidad).').replace('{id}',mx.nombre).replace('{vol}',_n(mx.volActual)).replace('{pct}',mx.pct.toFixed(0)),type:"info"});
  tanks.filter(function(t){return t.pct<5;}).forEach(function(t){
    msgs.push({text:_tr('El tanque {id} se encuentra vacio. Se recomienda evaluar su programacion de uso.').replace('{id}',t.nombre),type:"warn"});
  });
  if(msgs.length<2) msgs.push({text:_tr('Todos los tanques operan dentro de los rangos normales.'),type:"ok"});
  return msgs;
}

function _pozoObs(metrics){
  var obs=[];
  var colors=[[155,89,182],[46,204,113],[241,196,15],[155,89,182],[29,122,245]];
  var syms=["⚙","⚡","⊟","⊙","ℹ"];
  metrics.forEach(function(m,i){
    var pct=m.avg?(((m.val-m.avg)/m.avg)*100):0;
    if(Math.abs(pct)>10){
      var changeStr = pct<0 ? _tr('presenta una disminucion') : _tr('presenta un aumento');
      obs.push({
        text:m.lbl+" "+changeStr+" "+_tr('significativa del')+" "+Math.abs(pct).toFixed(1)+"% "+_tr('respecto al promedio.'),
        color:Math.abs(pct)>15?[231,76,60]:[230,126,34], sym:"!"
      });
    }
  });
  if(obs.length===0) obs.push({text:_tr('No se registran anomalias criticas en los parametros monitoreados.'),color:[29,122,245],sym:"i"});
  obs.push({text:_tr('Voltaje y Frecuencia se mantienen estables y dentro de los rangos esperados.'),color:[241,196,15],sym:"-"});
  obs.push({text:_tr('El RPM del generador se mantiene estable en {val} RPM.').replace('{val}',_n(metrics[6].val,0)),color:[155,89,182],sym:"o"});
  obs.push({text:_tr('No se registran anomalias criticas en los parametros monitoreados.'),color:[29,122,245],sym:"i"});
  return obs.slice(0,5);
}

function _conclusion(metrics){
  var issues=metrics.filter(function(m){
    return m.avg&&Math.abs(((m.val-m.avg)/m.avg)*100)>10;
  });
  if(!issues.length){
    return _tr('El sistema de produccion y el generador operan de manera estable. Los parametros electricos (voltaje, frecuencia y RPM) se encuentran dentro de los rangos normales.\nSe recomienda continuar con el monitoreo de Torque y Corriente.');
  }
  return _tr('Se detectaron variaciones en: {fields}. Se recomienda revision preventiva de los equipos afectados y continuar el monitoreo intensivo.').replace('{fields}', issues.map(function(m){return m.lbl;}).join(", "));
}
