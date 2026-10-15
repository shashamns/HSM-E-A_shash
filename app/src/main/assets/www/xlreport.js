/* HSM E&A – Excel reports.
 * Check lists are filled into the department's own Excel sheets (www/xl/*.xlsx) so the saved / shared file
 * looks exactly like the paper format. Each template (from the cloud) says which cell every reading goes to.
 * Also builds the combined daily workbook and the spares export.
 * Works in the browser (window.ExcelJS) and in Node (for testing).
 *
 * Cell specs:  'C9'    -> put the value in the empty cell
 *              'L:G25' -> keep the cell's label up to its first ':' and write the value after it
 *              'A:H31' -> append the value after the cell's full text
 *              'O:F17' -> overwrite the cell (e.g. a printed 'OK / NOK' prompt)
 *              'P:B28' -> write "Remarks: <value>"
 */
(function (root) {
  'use strict';

  const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = iso => { const [y, m, d] = iso.split('-'); return `${d}-${MON3[+m - 1]}-${y.slice(2)}`; };
  const cellText = c => {
    const v = c.value;
    if (v == null) return '';
    if (typeof v === 'object' && v.richText) return v.richText.map(t => t.text).join('');
    if (typeof v === 'object' && 'result' in v) return String(v.result ?? '');
    return String(v);
  };
  const asValue = v => (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())) ? Number(v) : v;
  const RED = { argb: 'FFC8102E' };
  // temperature fields: a reading above 100 is shown red (app, record and Excel)
  const isHot = (type, v, code, si) => { if (type !== 't' || v == null || v === '' || isNaN(parseFloat(v))) return false; const x = parseFloat(v), l = (typeof window.clLim === 'function' ? window.clLim(code, si) : null) || { hi: 100, lo: null }; return x > l.hi || (l.lo != null && x < l.lo); };
  const fieldType = (sec, item, fi) => item.t || ((sec.fields && sec.fields[fi]) || {}).t || 's';


  // ---- on-screen preview of a worksheet (same cells, merges, colours, borders as the Excel file) ----
  const colW = (ws, c) => { const w = (ws.getColumn(c) || {}).width; return Math.round((w || 8.43) * 7 + 5); };
  const argbCss = col => col && typeof col.argb === 'string' && col.argb.length === 8 ? '#' + col.argb.slice(2) : '';
  const escH = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const cellShow = c => { const v = c.value; if (v == null) return ''; if (v instanceof Date) return fmtDate(v.toISOString().slice(0, 10));
    if (typeof v === 'object' && v.richText) return v.richText.map(t => t.text).join(''); if (typeof v === 'object' && 'result' in v) return String(v.result ?? '');
    if (typeof v === 'object' && v.text) return String(v.text); return String(v); };
  function sheetToHtml(ws) {
    const cols = ws.columnCount || 1, rows = ws.rowCount || 1, skip = {}, span = {};
    ((ws.model && ws.model.merges) || []).forEach(rg => { const m = /^([A-Z]+)(\d+):([A-Z]+)(\d+)$/.exec(rg); if (!m) return;
      const cn = s => s.split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0), c1 = cn(m[1]), r1 = +m[2], c2 = cn(m[3]), r2 = +m[4];
      span[r1 + ',' + c1] = [r2 - r1 + 1, c2 - c1 + 1]; for (let r = r1; r <= r2; r++) for (let c = c1; c <= c2; c++) if (r !== r1 || c !== c1) skip[r + ',' + c] = 1; });
    let wTot = 0; const cg = []; for (let c = 1; c <= cols; c++) { const w = colW(ws, c); wTot += w; cg.push(`<col style="width:${w}px">`); }
    const bd = b => b && b.style ? `1px solid ${argbCss(b.color) || '#000'}` : '';
    let h = ''; 
    for (let r = 1; r <= rows; r++) {
      const row = ws.getRow(r), ht = Math.round((row.height || 15) * 1.333);
      let tr = '';
      for (let c = 1; c <= cols; c++) {
        if (skip[r + ',' + c]) continue;
        const cell = row.getCell(c), sp = span[r + ',' + c], st = cell.style || {}, f = st.font || {}, a = st.alignment || {}, b = st.border || {};
        const bg = st.fill && st.fill.type === 'pattern' && st.fill.pattern !== 'none' ? argbCss(st.fill.fgColor) : '';
        const css = [bg ? `background:${bg}` : '', f.color && argbCss(f.color) ? `color:${argbCss(f.color)}` : '', f.bold ? 'font-weight:700' : '', f.italic ? 'font-style:italic' : '', f.size ? `font-size:${Math.round(f.size * 1.333)}px` : '',
          a.horizontal ? `text-align:${a.horizontal === 'centerContinuous' ? 'center' : a.horizontal}` : (typeof cell.value === 'number' ? 'text-align:right' : ''), a.vertical ? `vertical-align:${a.vertical === 'middle' ? 'middle' : a.vertical}` : 'vertical-align:bottom',
          a.wrapText ? 'white-space:pre-wrap' : 'white-space:nowrap;overflow:hidden',
          bd(b.top) ? `border-top:${bd(b.top)}` : '', bd(b.bottom) ? `border-bottom:${bd(b.bottom)}` : '', bd(b.left) ? `border-left:${bd(b.left)}` : '', bd(b.right) ? `border-right:${bd(b.right)}` : ''].filter(Boolean).join(';');
        tr += `<td${sp ? ` rowspan="${sp[0]}" colspan="${sp[1]}"` : ''} style="${css}">${escH(cellShow(cell)).replace(/\n/g, '<br>')}</td>`;
      }
      h += `<tr style="height:${ht}px">${tr}</tr>`;
    }
    return { html: `<table class="xlp" style="width:${wTot}px;table-layout:fixed;border-collapse:collapse"><colgroup>${cg.join('')}</colgroup><tbody>${h}</tbody></table>`, width: wTot };
  }

  function write(ws, spec, value, opts) {
    if (!spec || value == null || value === '') return;
    let mode = '', ref = spec;
    if (/^[LAOP]:/.test(spec)) { mode = spec[0]; ref = spec.slice(2); }
    const cell = ws.getCell(ref);
    cell.style = JSON.parse(JSON.stringify(cell.style || {})); // styles are shared between cells: change only this one
    const cur = cellText(cell).replace(/\s+$/, '');
    if (!mode) cell.value = asValue(value);
    else if (mode === 'O') cell.value = asValue(value);
    else if (mode === 'P') cell.value = 'Remarks: ' + value;
    else if (mode === 'A') cell.value = (cur ? cur + ' ' : '') + value;
    else { const i = cur.indexOf(':'); cell.value = (i >= 0 ? cur.slice(0, i + 1) : (cur ? cur + ' :' : '')) + ' ' + value; }
    if (opts && opts.center) cell.alignment = Object.assign({}, cell.alignment, { horizontal: 'center', vertical: 'middle', wrapText: true });
    if (opts && opts.red) cell.font = Object.assign({}, cell.font, { bold: true, color: RED });
  }

  const hhmm = iso => { const d = new Date(iso); return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };

  // Write one check list record into its sheet
  function fillSheet(ws, tpl, entry) {
    const V = entry.vals || {}, map = tpl.map || {};
    (tpl.sections || []).forEach((s, si) => (s.items || []).forEach((it, ii) => (it.cells || []).forEach((spec, fi) => {
      const v = V[`${si}.${ii}.${fi}`]; if (!spec || v == null || v === '') return;
      const plain = !/^[LAP]:/.test(spec);
      write(ws, spec, v, { center: plain, red: v === 'NOT OK' || isHot(fieldType(s, it, fi), v, tpl.code, si) });
    })));
    const date = `${fmtDate(entry.check_date)} (${entry.shift || '-'})`;
    const by = `${entry.inspected_name || ''}${entry.inspected_by ? ' (' + entry.inspected_by + ')' : ''}`;
    const time = hhmm(entry.filled_at || entry.created_at || new Date().toISOString());
    write(ws, map.date, date); write(ws, map.date2, date); write(ws, map.time, time);
    (map.by || []).forEach(b => write(ws, b, by));
    if (entry.remarks) write(ws, map.remarks, entry.remarks);
    (map.custom || []).forEach(([ref, fmt]) => { ws.getCell(ref).value = fmt.replace('{remarks}', entry.remarks || '').replace('{by}', by); });
    const hf = ws.headerFooter || {};
    Object.keys(hf).forEach(k => { if (typeof hf[k] === 'string') hf[k] = hf[k].replace(/_x000D_/g, ''); });
  }

  function make(ExcelJS, loadTemplate) {
    async function openTemplate(file) {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(await loadTemplate(file));
      return wb;
    }
    const sheetOf = (wb, tpl) => wb.getWorksheet(tpl.sheet) || wb.worksheets[0];

    // Copy a sheet (values, styles, merges, widths, heights, print setup) into another workbook
    function copySheet(src, dstWb, name) {
      const dst = dstWb.addWorksheet(name, {
        pageSetup: Object.assign({}, src.pageSetup, { printArea: undefined }),
        properties: Object.assign({}, src.properties),
        views: src.views
      });
      src.columns && src.columns.forEach((col, i) => {
        const d = dst.getColumn(i + 1);
        if (col.width) d.width = col.width;
        if (col.hidden) d.hidden = true;
      });
      src.eachRow({ includeEmpty: true }, (row, r) => {
        const dr = dst.getRow(r);
        if (row.height) dr.height = row.height;
        row.eachCell({ includeEmpty: true }, (cell, c) => {
          const dc = dr.getCell(c);
          if (cell.type !== ExcelJS.ValueType.Merge) dc.value = cell.value;
          dc.style = JSON.parse(JSON.stringify(cell.style || {}));
        });
      });
      Object.keys(src._merges || {}).forEach(k => { try { dst.mergeCells(src._merges[k].range); } catch (e) {} });
      return dst;
    }

    // One record → the department's Excel file, filled in
    async function recordWorkbook(tpl, entry) {
      const wb = await openTemplate(tpl.file);
      const ws = sheetOf(wb, tpl);
      fillSheet(ws, tpl, entry);
      wb.worksheets.filter(w => w !== ws).forEach(w => wb.removeWorksheet(w.id));
      ws.name = `${tpl.code} ${entry.shift || ''}`.trim().slice(0, 31);
      wb.creator = 'HSM E&A App';
      return wb.xlsx.writeBuffer();
    }

    // All records of a day → one workbook: summary + one sheet per record
    async function dailyWorkbook(templates, entries, isoDate) {
      const out = new ExcelJS.Workbook();
      out.creator = 'HSM E&A App';
      const sum = out.addWorksheet('Summary');
      const used = new Set();
      const list = entries.slice().sort((a, b) => (a.filled_at || a.created_at) < (b.filled_at || b.created_at) ? -1 : 1);
      for (const e of list) {
        const tpl = templates.find(t => t.code === e.template_code); if (!tpl || !tpl.file) continue;
        const wb = await openTemplate(tpl.file);
        const ws = sheetOf(wb, tpl);
        fillSheet(ws, tpl, e);
        let name = `${tpl.code} ${e.shift || ''}`.trim().slice(0, 26); let n = name, k = 2; while (used.has(n)) n = `${name} (${k++})`; used.add(n);
        copySheet(ws, out, n);
      }
      sum.columns = [{ width: 34 }, { width: 8 }, { width: 26 }, { width: 11 }, { width: 10 }, { width: 12 }, { width: 40 }];
      sum.addRow([`HSM E&A – Daily Inspection Report   ${fmtDate(isoDate)}`]).font = { bold: true, size: 14 };
      sum.addRow([]);
      const h = sum.addRow(['Check list', 'Shift', 'Inspected by', 'Readings', 'NOT OK', 'Temp above limit', 'Remarks']);
      h.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      h.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8102E' } }; });
      list.forEach(e => {
        const tpl = templates.find(t => t.code === e.template_code);
        const vals = Object.values(e.vals || {});
        const hot = tpl ? hotCount(tpl, e.vals || {}) : 0;
        const r = sum.addRow([tpl ? tpl.name : e.template_code, e.shift || '', e.inspected_name || '', vals.length,
          vals.filter(v => v === 'NOT OK').length, hot, e.remarks || '']);
        if (vals.includes('NOT OK')) r.getCell(5).font = { bold: true, color: RED };
        if (hot) r.getCell(6).font = { bold: true, color: RED };
      });
      return out.xlsx.writeBuffer();
    }

    // Spares list in the same layout as HSM Spares.xlsx (one sheet per category)
    async function sparesWorkbook(rows, areas) {
      const out = new ExcelJS.Workbook();
      const byArea = {};
      rows.forEach(r => { (byArea[r.area] = byArea[r.area] || []).push(r); });
      const names = (areas || []).concat(Object.keys(byArea).filter(a => !(areas || []).includes(a)));
      names.forEach(area => {
        const list = byArea[area] || [];
        if (!list.length && !(areas || []).includes(area)) return;
        const ws = out.addWorksheet(String(area).replace(/[\\/*?:[\]]/g, ' ').slice(0, 31));
        ws.columns = [{ width: 7 }, { width: 34 }, { width: 30 }, { width: 44 }, { width: 14 }, { width: 11 }, { width: 22 }, { width: 9 }, { width: 13 }, { width: 13 }, { width: 28 }, { width: 18 }];
        const h = ws.addRow(['Sl. No.', 'Item', 'Type/ Model', 'Item Description', 'Make (OEM)', 'Avilable Qty.', 'Location', 'Rack No.', 'Cupboard No.', 'Cupboard Key No.', 'Update by last', 'Updated on']);
        h.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        h.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8102E' } }; c.alignment = { vertical: 'middle', wrapText: true }; });
        ws.views = [{ state: 'frozen', ySplit: 1 }];
        list.forEach((r, i) => {
          const row = ws.addRow([i + 1, r.material, r.model || '', r.description || '', r.make || '', r.qty, r.location || '', r.rack || '', r.cupboard || '', r.cupboard_key || '', r.updated_by || '',
            r.updated_at ? new Date(r.updated_at).toLocaleString('en-GB') : '']);
          row.alignment = { vertical: 'top', wrapText: true };
          if (r.qty <= 0) row.getCell(6).font = { bold: true, color: RED };
        });
      });
      return out.xlsx.writeBuffer();
    }


    // Whole roster of a month: one row per person, one column per day (what was actually rostered / changed)
    async function rosterWorkbook(rows, year, month0, label) {
      const out = new ExcelJS.Workbook(); out.creator = 'HSM E&A App';
      const nD = new Date(year, month0 + 1, 0).getDate(), W = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      const people = {}; rows.forEach(r => { const k = (r.sap_id ? 's' + r.sap_id : 'n' + String(r.name).toLowerCase()); const p = people[k] = people[k] || { name: r.name, sap: r.sap_id || '', area: r.area || '', rank: r.ranking == null ? 9999 : r.ranking, d: {} }; p.d[+r.day.slice(8, 10)] = r.shift; if (r.area) p.area = r.area; });
      const list = Object.values(people).sort((a, b) => String(a.area).localeCompare(String(b.area)) || a.rank - b.rank || a.name.localeCompare(b.name));
      const ws = out.addWorksheet('Roster ' + label.slice(0, 20));
      const FILL = { A: 'FFDCE9FB', B: 'FFFFF1D6', C: 'FFE5DEF8', G: 'FFE0F1E4', L: 'FFFADADA', WO: 'FFEAEAEA' };
      const fillOf = argb => ({ type: 'pattern', pattern: 'solid', fgColor: { argb } });
      const thin = { style: 'thin', color: { argb: 'FFBBBBBB' } }, box = { top: thin, left: thin, bottom: thin, right: thin };
      const cols = [{ width: 5 }, { width: 28 }, { width: 11 }, { width: 18 }]; for (let d = 1; d <= nD; d++) cols.push({ width: 4.6 }); ['A','B','C','G','L','WO','Duty days'].forEach((t, i) => cols.push({ width: i === 6 ? 10 : 5.5 }));
      ws.columns = cols;
      ws.addRow([`HSM E&A – Shift roster   ${label}`]).font = { bold: true, size: 14 };
      const h1 = ws.addRow(['Sl.', 'Name', 'SAP ID', 'Area']), h2 = ws.addRow(['', '', '', '']);
      for (let d = 1; d <= nD; d++) { h1.getCell(4 + d).value = d; h2.getCell(4 + d).value = W[new Date(year, month0, d).getDay()]; }
      ['A','B','C','G','L','WO','Duty days'].forEach((t, i) => { h1.getCell(4 + nD + 1 + i).value = t; });
      [h1, h2].forEach(r => { r.font = { bold: true, color: { argb: 'FFFFFFFF' } }; r.alignment = { horizontal: 'center', vertical: 'middle' };
        for (let c = 1; c <= 4 + nD + 7; c++) { const cell = r.getCell(c); cell.fill = fillOf('FFC8102E'); cell.border = box; } });
      for (let d = 1; d <= nD; d++) if (new Date(year, month0, d).getDay() === 0) { h2.getCell(4 + d).font = { bold: true, color: { argb: 'FFFFE08A' } }; }
      list.forEach((p, i) => {
        const cnt = { A: 0, B: 0, C: 0, G: 0, L: 0, WO: 0 }; const row = ws.addRow([i + 1, p.name, p.sap, p.area]);
        for (let d = 1; d <= nD; d++) { const s = p.d[d] || ''; const c = row.getCell(4 + d); c.value = s; if (s) { cnt[s] = (cnt[s] || 0) + 1; if (FILL[s]) c.fill = fillOf(FILL[s]); if (s === 'L') c.font = { bold: true, color: { argb: 'FFA32D2D' } }; } }
        ['A','B','C','G','L','WO'].forEach((k, j) => { row.getCell(4 + nD + 1 + j).value = cnt[k] || 0; });
        row.getCell(4 + nD + 7).value = cnt.A + cnt.B + cnt.C + cnt.G; row.getCell(4 + nD + 7).font = { bold: true };
        row.eachCell({ includeEmpty: true }, (c, n) => { c.border = box; if (n > 4) c.alignment = { horizontal: 'center', vertical: 'middle' }; });
      });
      ws.views = [{ state: 'frozen', xSplit: 4, ySplit: 3 }];
      const sm = out.addWorksheet('Summary'); sm.columns = [{ width: 5 }, { width: 28 }, { width: 11 }, { width: 18 }, { width: 8 }, { width: 8 }, { width: 8 }, { width: 8 }, { width: 8 }, { width: 8 }, { width: 11 }];
      sm.addRow([`Duty summary   ${label}`]).font = { bold: true, size: 14 };
      const sh = sm.addRow(['Sl.', 'Name', 'SAP ID', 'Area', 'A', 'B', 'C', 'General', 'Leave', 'Weekly off', 'Duty days']); sh.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      sh.eachCell(c => { c.fill = fillOf('FFC8102E'); c.alignment = { horizontal: 'center' }; });
      list.forEach((p, i) => { const v = Object.values(p.d), n = k => v.filter(x => x === k).length; sm.addRow([i + 1, p.name, p.sap, p.area, n('A'), n('B'), n('C'), n('G'), n('L'), n('WO'), n('A') + n('B') + n('C') + n('G')]); });
      return out.xlsx.writeBuffer();
    }

    // Preview of one record as it will look in the Excel file
    async function recordPreview(tpl, entry) {
      const wb = await openTemplate(tpl.file); const ws = sheetOf(wb, tpl); fillSheet(ws, tpl, entry); return sheetToHtml(ws);
    }

    // Abnormal readings of a day (temperature > 100, NOT OK), area-wise
    async function actionsWorkbook(items, notes, isoDate, areaName) {
      const out = new ExcelJS.Workbook(); out.creator = 'HSM E&A App';
      const ws = out.addWorksheet('Action required');
      ws.columns = [{ width: 14 }, { width: 30 }, { width: 8 }, { width: 28 }, { width: 28 }, { width: 12 }, { width: 18 }, { width: 8 }, { width: 22 }];
      ws.addRow([`HSM E&A – Daily action required   ${fmtDate(isoDate)}`]).font = { bold: true, size: 14 }; ws.addRow([]);
      const h = ws.addRow(['Area', 'Check list', 'Shift', 'Equipment', 'Parameter', 'Reading', 'Problem', 'Time', 'Checked by']);
      h.font = { bold: true, color: { argb: 'FFFFFFFF' } }; h.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: RED }; });
      items.forEach(i => { const r = ws.addRow([areaName ? areaName(i.area) : i.area, i.tname, i.shift, i.equip, i.param, asValue(i.value), i.kind === 'hot' ? 'Temperature above limit' : 'NOT OK', hhmm(i.at), i.by]);
        r.getCell(6).font = { bold: true, color: RED }; r.alignment = { vertical: 'top', wrapText: true }; });
      if (!items.length) ws.addRow(['No abnormal reading']);
      if (notes && notes.length) { ws.addRow([]); ws.addRow(['Remarks']).font = { bold: true }; notes.forEach(n => ws.addRow([areaName ? areaName(n.area) : n.area, n.tname, n.shift, n.text, '', '', '', '', n.by])); }
      return out.xlsx.writeBuffer();
    }
    // Leave requests of a month
    async function leaveWorkbook(rows, label, typeName, shortDate, fromYmd) {
      const out = new ExcelJS.Workbook(); out.creator = 'HSM E&A App';
      const ws = out.addWorksheet('Leave');
      ws.columns = [{ width: 6 }, { width: 28 }, { width: 12 }, { width: 20 }, { width: 14 }, { width: 14 }, { width: 8 }, { width: 12 }, { width: 34 }, { width: 22 }];
      ws.addRow([`HSM E&A – Leave report   ${label}`]).font = { bold: true, size: 14 }; ws.addRow([]);
      const h = ws.addRow(['#', 'Name', 'SAP ID', 'Leave type', 'From', 'To', 'Days', 'Status', 'Reason', 'Decided by']);
      h.font = { bold: true, color: { argb: 'FFFFFFFF' } }; h.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: RED }; });
      rows.forEach((r, i) => ws.addRow([i + 1, r.name, r.sap_id || '', typeName(r.leave_type), shortDate(fromYmd(r.from_day)), shortDate(fromYmd(r.to_day)), +r.days, r.status, r.reason || '', r.decided_by || '']));
      const ap = {}; rows.filter(r => r.status === 'approved').forEach(r => { ap[r.name] = (ap[r.name] || 0) + +r.days; });
      const s2 = out.addWorksheet('Approved days per person'); s2.columns = [{ width: 30 }, { width: 14 }];
      s2.addRow(['Name', 'Approved days']).font = { bold: true };
      Object.keys(ap).sort().forEach(n => s2.addRow([n, ap[n]]));
      return out.xlsx.writeBuffer();
    }

    return { recordWorkbook, dailyWorkbook, sparesWorkbook, actionsWorkbook, leaveWorkbook, rosterWorkbook, recordPreview };
  }

  function hotCount(tpl, V) {
    let n = 0;
    (tpl.sections || []).forEach((s, si) => (s.items || []).forEach((it, ii) => (it.cells || []).forEach((c, fi) => { if (isHot(fieldType(s, it, fi), V[`${si}.${ii}.${fi}`], tpl.code, si)) n++; })));
    return n;
  }

  const api = { make, fillSheet, isHot, fieldType, hotCount };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.HSMXL = api;
})(typeof window !== 'undefined' ? window : globalThis);
