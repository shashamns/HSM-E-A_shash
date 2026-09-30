/* HSM E&A – Excel reports.
 * Fills the department's own inspection-sheet templates (www/xl/*.xlsx) with checklist readings,
 * builds a combined daily workbook, and exports the spares list.
 * Works in the browser (window.ExcelJS) and in Node (for testing).
 */
(function (root) {
  'use strict';

  // Where each checklist's readings go in the original Excel sheets.
  // Section specs: {r,c}        -> item i on row r+i, field j in column c[j]
  //                {r,c,split,c2}-> items >= split continue on row r+(i-split) in columns c2
  //                {cells}       -> one cell per item. 'L:' = write after the cell's own label,
  //                                 'N:' = append "item: value" to the cell, plain = set value.
  const XLMAP = {
    CB:   { file: 'CB.xlsx', sheet: 'Sheet6', date: 'L:J2', remarks: 'L:A22', by: 'L:H22', sec: [
            { r: 7, c: ['C','D','E','F'] }, { r: 7, c: ['J','K','L'] },
            { cells: ['L:C19','L:E19','L:C20','L:E20'] } ] },
    CLR:  { file: 'COILER.xlsx', sheet: 'Sheet1', date: 'L:I1', remarks: 'L:G40', by: 'L:A43', sec: [
            { r: 3, c: ['B','C'] }, { r: 3, c: ['E'] }, { r: 20, c: ['B','C','D','E'] }, { r: 3, c: ['H','I','J'] },
            { cells: ['L:D16','F17','L:B35','L:B38','L:B40','H36','H38'] } ] },
    FMRS: { file: 'FM.xlsx', sheet: 'Sheet7', date: 'L:A1', remarks: 'L:A33', by: 'L:A34', sec: [
            { r: 5, c: ['B','C','D'] }, { r: 5, c: ['F','G','H'] }, { r: 12, c: ['B','E'] }, { r: 19, c: ['B','E'] },
            { r: 29, c: ['B','C'] },
            { cells: ['L:F12','L:F14','L:G18','L:G20','L:G22','L:G24','F29','F30','F31','F32','G29','G30','G31','G32'] } ] },
    FMHY: { file: 'FM.xlsx', sheet: 'Sheet7', date: 'L:A38', remarks: 'L:A65', by: 'L:A67', sec: [
            { r: 41, c: ['B','C','D'], split: 24, c2: ['F','G','H'] },
            { cells: ['L:F67','L:G67','L:F68','L:G68','L:F69','L:G69','L:H69'] } ] },
    RM:   { file: 'RMRHF.xlsx', sheet: 'RM AREA', date: 'L:R1', remarks: 'L:A39', by: 'L:Q40', sec: [
            { r: 5, c: ['C','D','E','F','H','I','J'] }, { r: 5, c: ['N','O','P'] }, { r: 25, c: ['C','D','E','F'] },
            { r: 5, c: ['S','T'] }, { cells: ['N:A40','N:A40','L:A38','L:A37'] } ] },
    FCE:  { file: 'RMRHF.xlsx', sheet: 'FCE AREA', date: 'L:N1', remarks: 'L:A34', by: 'L:N36', sec: [
            { r: 4, c: ['C','D','E','F','H','I','J'] }, { r: 4, c: ['N','O','P'] }, { r: 25, c: ['C','D','E','F'] },
            { r: 26, c: ['I','J'] }, { cells: ['L:H31','L:H32'] } ] },
    RIO:  { file: 'RMRHF.xlsx', sheet: 'Sheet3', date: 'L:E2', remarks: 'L:A17', by: 'L:A20', sec: [
            { r: 5, c: ['C','D','E'] } ] },
    DRV:  { file: 'RMRHF.xlsx', sheet: 'Sheet4', date: 'L:J2', remarks: 'L:H32', by: 'L:J36', sec: [
            { r: 5, c: ['C','D','E','F'] }, { r: 5, c: ['J','K','L'] }, { r: 23, c: ['J'] }, { cells: ['J29','J30'] } ] }
  };

  const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const fmtDate = iso => { const [y, m, d] = iso.split('-'); return `${d}-${MON3[+m - 1]}-${y.slice(2)}`; };
  const cellText = c => {
    const v = c.value;
    if (v == null) return '';
    if (typeof v === 'object' && v.richText) return v.richText.map(t => t.text).join('');
    return String(c.text != null ? c.text : v);
  };
  const asValue = v => (typeof v === 'string' && /^-?\d+(\.\d+)?$/.test(v.trim())) ? Number(v) : v;

  function writeSpec(ws, spec, value, itemName) {
    if (value == null || value === '') return;
    let mode = '', ref = spec;
    if (/^[LN]:/.test(spec)) { mode = spec[0]; ref = spec.slice(2); }
    const cell = ws.getCell(ref);
    if (!mode) { cell.value = asValue(value); return; }
    const cur = cellText(cell).replace(/\s+$/, '');
    if (mode === 'N') { cell.value = (cur ? cur + '   ' : '') + `${itemName}: ${value}`; return; }
    const i = cur.indexOf(':');
    const label = i >= 0 ? cur.slice(0, i + 1) : (cur ? cur + ' —' : '');
    cell.value = (label ? label + ' ' : '') + value;
  }

  // Write one checklist record into its sheet
  function fillSheet(ws, tpl, entry) {
    const map = XLMAP[tpl.code]; if (!map) return;
    const V = entry.vals || {};
    tpl.sections.forEach((s, si) => {
      const sp = map.sec[si]; if (!sp) return;
      s.items.forEach((it, ii) => {
        const nf = s.fields ? s.fields.length : 1;
        for (let fi = 0; fi < nf; fi++) {
          const v = V[`${si}.${ii}.${fi}`]; if (v == null || v === '') continue;
          if (sp.cells) { writeSpec(ws, sp.cells[ii], v, it.name); continue; }
          let row = sp.r + ii, cols = sp.c;
          if (sp.split != null && ii >= sp.split) { row = sp.r + (ii - sp.split); cols = sp.c2; }
          if (cols[fi]) { const c = ws.getCell(cols[fi] + row); c.value = asValue(v);
            c.alignment = Object.assign({}, c.alignment, { horizontal: 'center', vertical: 'middle' });
            if (v === 'NOT OK') c.font = Object.assign({}, c.font, { bold: true, color: { argb: 'FFC8102E' } }); }
        }
      });
    });
    writeSpec(ws, map.date, `${fmtDate(entry.check_date)}   Shift: ${entry.shift || '-'}`);
    if (entry.remarks) writeSpec(ws, map.remarks, entry.remarks);
    writeSpec(ws, map.by, `${entry.inspected_name || ''}${entry.inspected_by ? ' (' + entry.inspected_by + ')' : ''}`);
  }

  function make(ExcelJS, loadTemplate) {
    async function openTemplate(file) {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(await loadTemplate(file));
      return wb;
    }

    // Copy a sheet (values, styles, merges, widths, heights, print setup) into another workbook
    function copySheet(src, dstWb, name) {
      const dst = dstWb.addWorksheet(name, {
        pageSetup: Object.assign({}, src.pageSetup),
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

    const sheetTitle = (tpl, entry) => `${tpl.code} ${entry.shift || ''}`.trim();

    // One record → its own workbook (the template sheet only)
    async function recordWorkbook(tpl, entry) {
      const map = XLMAP[tpl.code];
      const wb = await openTemplate(map.file);
      const ws = wb.getWorksheet(map.sheet);
      fillSheet(ws, tpl, entry);
      const out = new ExcelJS.Workbook();
      copySheet(ws, out, sheetTitle(tpl, entry));
      return out.xlsx.writeBuffer();
    }

    // All records of a day → one workbook, one sheet per checklist sheet + shift
    async function dailyWorkbook(templates, entries, isoDate) {
      const out = new ExcelJS.Workbook();
      out.creator = 'HSM E&A App';
      const groups = new Map(); // file|sheet|shift -> [{tpl, entry}]
      entries.slice().sort((a, b) => (a.filled_at || a.created_at) < (b.filled_at || b.created_at) ? -1 : 1).forEach(e => {
        const tpl = templates.find(t => t.code === e.template_code); const map = tpl && XLMAP[tpl.code];
        if (!map) return;
        const key = `${map.file}|${map.sheet}|${e.shift || ''}`;
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push({ tpl, entry: e });
      });
      const sum = out.addWorksheet('Summary');
      const used = new Set();
      for (const [key, list] of groups) {
        const [file, sheet, shift] = key.split('|');
        const wb = await openTemplate(file); // fresh copy for each group
        const ws = wb.getWorksheet(sheet);
        list.forEach(({ tpl, entry }) => fillSheet(ws, tpl, entry));
        let name = list.map(x => x.tpl.code).filter((v, i, a) => a.indexOf(v) === i).join('+') + (shift ? ' ' + shift : '');
        name = name.slice(0, 28); let n = name, k = 2; while (used.has(n)) n = `${name} (${k++})`; used.add(n);
        copySheet(ws, out, n);
      }
      // Summary sheet (created first so it is the first tab)
      sum.columns = [{ width: 30 }, { width: 8 }, { width: 26 }, { width: 12 }, { width: 12 }, { width: 40 }];
      sum.addRow([`HSM E&A – Daily Inspection Report   ${fmtDate(isoDate)}`]).font = { bold: true, size: 14 };
      sum.addRow([]);
      const h = sum.addRow(['Check list', 'Shift', 'Inspected by', 'Readings', 'NOT OK', 'Remarks']);
      h.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      h.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8102E' } }; });
      entries.forEach(e => {
        const tpl = templates.find(t => t.code === e.template_code);
        const vals = Object.values(e.vals || {});
        const r = sum.addRow([tpl ? tpl.name : e.template_code, e.shift || '', e.inspected_name || '', vals.length,
          vals.filter(v => v === 'NOT OK').length, e.remarks || '']);
        if (vals.includes('NOT OK')) r.getCell(5).font = { bold: true, color: { argb: 'FFC8102E' } };
      });
      return out.xlsx.writeBuffer();
    }

    // Spares list in the same layout as HSM Spares.xlsx (one sheet per category)
    async function sparesWorkbook(rows, areas) {
      const out = new ExcelJS.Workbook();
      const byArea = {};
      rows.forEach(r => { (byArea[r.area] = byArea[r.area] || []).push(r); });
      (areas || Object.keys(byArea)).forEach(area => {
        const list = byArea[area] || [];
        const ws = out.addWorksheet(area.replace(/[\\/*?:[\]]/g, ' ').slice(0, 31));
        ws.columns = [{ width: 7 }, { width: 34 }, { width: 30 }, { width: 44 }, { width: 14 }, { width: 11 }, { width: 22 }, { width: 9 }, { width: 28 }, { width: 18 }];
        const h = ws.addRow(['Sl. No.', 'Item', 'Type/ Model', 'Item Description', 'Make (OEM)', 'Avilable Qty.', 'Location', 'Rack No.', 'Update by last', 'Updated on']);
        h.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        h.eachCell(c => { c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC8102E' } }; c.alignment = { vertical: 'middle', wrapText: true }; });
        ws.views = [{ state: 'frozen', ySplit: 1 }];
        list.forEach((r, i) => {
          const row = ws.addRow([i + 1, r.material, r.model || '', r.description || '', r.make || '', r.qty, r.location || '', r.rack || '', r.updated_by || '',
            r.updated_at ? new Date(r.updated_at).toLocaleString('en-GB') : '']);
          row.alignment = { vertical: 'top', wrapText: true };
          if (r.qty <= 0) row.getCell(6).font = { bold: true, color: { argb: 'FFC8102E' } };
        });
      });
      return out.xlsx.writeBuffer();
    }

    return { recordWorkbook, dailyWorkbook, sparesWorkbook, XLMAP };
  }

  const api = { make, XLMAP, fillSheet };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.HSMXL = api;
})(typeof window !== 'undefined' ? window : globalThis);
