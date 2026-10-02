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
  const isHot = (type, v) => type === 't' && v != null && v !== '' && !isNaN(parseFloat(v)) && parseFloat(v) > 100;
  const fieldType = (sec, item, fi) => item.t || ((sec.fields && sec.fields[fi]) || {}).t || 's';

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
      write(ws, spec, v, { center: plain, red: v === 'NOT OK' || isHot(fieldType(s, it, fi), v) });
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
      const h = sum.addRow(['Check list', 'Shift', 'Inspected by', 'Readings', 'NOT OK', 'Temp > 100', 'Remarks']);
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

    // Abnormal readings of a day (temperature > 100, NOT OK), area-wise
    async function actionsWorkbook(items, notes, isoDate, areaName) {
      const out = new ExcelJS.Workbook(); out.creator = 'HSM E&A App';
      const ws = out.addWorksheet('Action required');
      ws.columns = [{ width: 14 }, { width: 30 }, { width: 8 }, { width: 28 }, { width: 28 }, { width: 12 }, { width: 18 }, { width: 8 }, { width: 22 }];
      ws.addRow([`HSM E&A – Daily action required   ${fmtDate(isoDate)}`]).font = { bold: true, size: 14 }; ws.addRow([]);
      const h = ws.addRow(['Area', 'Check list', 'Shift', 'Equipment', 'Parameter', 'Reading', 'Problem', 'Time', 'Checked by']);
      h.font = { bold: true, color: { argb: 'FFFFFFFF' } }; h.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: RED }; });
      items.forEach(i => { const r = ws.addRow([areaName ? areaName(i.area) : i.area, i.tname, i.shift, i.equip, i.param, asValue(i.value), i.kind === 'hot' ? 'Temperature above 100' : 'NOT OK', hhmm(i.at), i.by]);
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

    return { recordWorkbook, dailyWorkbook, sparesWorkbook, actionsWorkbook, leaveWorkbook };
  }

  function hotCount(tpl, V) {
    let n = 0;
    (tpl.sections || []).forEach((s, si) => (s.items || []).forEach((it, ii) => (it.cells || []).forEach((c, fi) => { if (isHot(fieldType(s, it, fi), V[`${si}.${ii}.${fi}`])) n++; })));
    return n;
  }

  const api = { make, fillSheet, isHot, fieldType, hotCount };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.HSMXL = api;
})(typeof window !== 'undefined' ? window : globalThis);
