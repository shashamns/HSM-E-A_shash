/* HSM E&A App – Electrical & Automation, Hot Strip Mill */
'use strict';

/* ================= CONFIG ================= */
const SB_URL = 'https://jqxabsioebndhslyagxc.supabase.co';
const SB_KEY = 'sb_publishable_iemA7-rKgs1VdZSH9hd2Kw__8458frU';
const ADMIN_MAIL = 'shash2811@gmail.com';
const ADMIN_NAME = 'Shashank Agrawal';
const SOP_BUCKET = 'sop-docs';
const MILL_PROCESS_BUCKET = 'mill-process-sops';

const SPARE_AREAS = ['Automation (L1)','Instrument','RM','FM','DC','ABB MV Drive','ABB LV Drive','Motor','GE Drive','Power','Crane'];
const DOC_AREAS = ['CB','DC','FM','LEVEL1','RHF','RM'];
const MODULES = [['schedule','Shift Schedule','cal','Monthly roster'],['checklist','Check List','check','Daily inspection'],['spares','Spares','box','Stock & location'],
  ['sop','SOP & HIRAC','shield','Numbers, hazards, docs'],['mill',"SOP's of Mill Process",'doc','Operational procedures'],['team','Team','users','E&amp;A directory']];
const ALL_MODS = MODULES.map(m => m[0]);
const ROUTE_MOD = { schedule: 'schedule', checklist: 'checklist', cl: 'checklist', clh: 'checklist', cle: 'checklist', spares: 'spares', spare: 'spares', sop: 'sop', hirac: 'sop', mill: 'mill', team: 'team' };
const MILL_AREAS = [['CB','CB'],['DC','DC'],['FM','FM'],['LEVEL-1','Level 1'],['RHF','RHF'],['RM','RM']];
const SOP_GROUPS = ['All','Common','Instrument','RM','CB','FM','Coiler','MD Motor','Crane','Power'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY3 = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DAYNAME = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SHIFT_TIME = { A: '07:00 – 15:00', B: '15:00 – 23:00', C: '23:00 – 07:00', G: 'General' };

/* ================= ICONS ================= */
const I = {
  back:'<path d="M15 5l-7 7 7 7"/>', chev:'<path d="M9 5l7 7-7 7"/>',
  home:'<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  check:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M3.5 6l1.5 1.5L7.5 5M3.5 12l1.5 1.5 2.5-2.5M3.5 18l1.5 1.5 2.5-2.5"/>',
  box:'<path d="M21 8l-9-5-9 5v8l9 5 9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  doc:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9.5 12.5h6M9.5 16.5h6"/>',
  shield:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
  users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>',
  refresh:'<path d="M20 11a8 8 0 1 0-2.3 5.7"/><path d="M20 4v7h-7"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/>',
  download:'<path d="M12 4v11M7 10l5 5 5-5"/><path d="M5 20h14"/>',
  xls:'<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12l4 5M13 12l-4 5"/>',
  pin:'<path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  ok:'<path d="M5 12l5 5 9-10"/>', x:'<path d="M6 6l12 12M18 6L6 18"/>',
  hourglass:'<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
  phone:'<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
  logout:'<path d="M15 4h4v16h-4"/><path d="M10 8l-4 4 4 4M6 12h10"/>',
  upload:'<path d="M12 20V9M7 14l5-5 5 5"/><path d="M5 4h14"/>',
  key:'<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M17 6l3 3"/>',
  warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>'
};
const ic = (n, s = 24) => `<svg class="i" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${I[n]}</svg>`;

/* ================= HELPERS ================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
const pad2 = n => String(n).padStart(2, '0');
const ymd = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const fromYmd = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtDay = d => `${pad2(d.getDate())}-${MON3[d.getMonth()]}-${String(d.getFullYear()).slice(2)}, ${DAY3[d.getDay()]}`;
const fmtShort = d => `${pad2(d.getDate())}-${MON3[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`;
const fmtStamp = iso => { const d = new Date(iso); return `${fmtShort(d)} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const can = m => !ME || ME.is_admin || !Array.isArray(ME.modules) || ME.modules.includes(m);
const avHtml = (url, name, style = '') => url
  ? `<span class="av" style="padding:0;overflow:hidden;${style}"><img src="${esc(url)}" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover"></span>`
  : `<span class="av" style="${style}">${esc(initials(name))}</span>`;
const initials = n => { const p = String(n || '?').replace(/\./g, '').trim().split(/\s+/); return ((p[0] || '?')[0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase(); };
const firstName = n => { const p = String(n || '').replace(/^s\.\s*/i, '').split(/\s+/); return p[0] || ''; };
const curShift = (d = new Date()) => { const h = d.getHours(); return h >= 7 && h < 15 ? 'A' : h >= 15 && h < 23 ? 'B' : 'C'; };
const greet = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };
const store = { get(k, d = null) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
                set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
                del(k) { try { localStorage.removeItem(k); } catch (e) {} } };
const normName = n => String(n || '').toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\b(mr|mrs|ms)\b/g, '').trim().split(/\s+/).filter(w => w.length > 1);
function sameName(a, b) {
  const x = normName(a), y = normName(b); if (!x.length || !y.length) return false;
  if (x[0] !== y[0] && !(x[0].startsWith(y[0]) || y[0].startsWith(x[0]))) return false;
  if (x.length === 1 || y.length === 1) return true;
  const lx = x[x.length - 1], ly = y[y.length - 1];
  return lx === ly || lx.startsWith(ly) || ly.startsWith(lx);
}

let toastT;
function toast(msg, ms = 3000) { const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hidden'), ms); }
function ask(title, text, okLabel = 'OK', cancelLabel = 'Cancel', danger = false) {
  return new Promise(res => {
    const m = $('#modal');
    m.innerHTML = `<div class="sheet"><h3>${esc(title)}</h3>${text ? `<p>${esc(text)}</p>` : ''}
      <div class="two"><button class="btn ghost" data-r="0">${esc(cancelLabel)}</button><button class="btn ${danger ? 'pri' : 'pri'}" data-r="1">${esc(okLabel)}</button></div></div>`;
    m.classList.remove('hidden');
    m.onclick = e => { const b = e.target.closest('[data-r]'); if (!b && e.target !== m) return; m.classList.add('hidden'); m.onclick = null; res(!!b && b.dataset.r === '1'); };
  });
}

/* ================= AUTH + API ================= */
let SESSION = store.get('hsm_session');   // {access_token, refresh_token, expires_at}
let ME = store.get('hsm_me');             // {name, username, is_admin}

/* Network: time-out so a weak signal (basement / cellar) fails fast instead of hanging */
const isNet = e => !!e && /Failed to fetch|NetworkError|Load failed|network|timed out|abort/i.test(e.message || e.name || '');
function tfetch(url, opts = {}, ms = 12000) {
  if (navigator.onLine === false) return Promise.reject(new Error('network offline'));
  const c = new AbortController(); const t = setTimeout(() => c.abort(), ms);
  return fetch(url, { ...opts, signal: c.signal }).catch(e => { throw new Error(e.name === 'AbortError' ? 'network timed out' : (e.message || 'network error')); })
    .finally(() => clearTimeout(t));
}
/* Offline copies of what was last seen, so the app still works without network */
const CACHE_OK = /^(checklist_templates|team|shift_roster|sop_hirac|sops|spares|spare_log|hirac|checklist_entries)\b/;
const CKEY = 'hsm_c:';
function cachePut(path, data) {
  try { const s = JSON.stringify(data); if (s.length > 600000) return;
    const idx = store.get('hsm_cidx', []).filter(p => p !== path); idx.push(path);
    while (idx.length > 80) store.del(CKEY + idx.shift());
    localStorage.setItem(CKEY + path, s); store.set('hsm_cidx', idx);
  } catch (e) {}
}
const cacheGet = path => store.get(CKEY + path);
let OFFLINE = false;
function setOffline(v) {
  if (OFFLINE === v) return; OFFLINE = v;
  document.body.classList.toggle('offline', v);
  let b = $('#offbar');
  if (v && !b) { b = document.createElement('div'); b.id = 'offbar'; b.setAttribute('role', 'status');
    b.textContent = 'Offline · check lists are saved on this phone'; document.body.appendChild(b); }
  if (!v && b) b.remove();
}

async function gotrue(path, body) {
  const r = await tfetch(`${SB_URL}/auth/v1/${path}`, { method: 'POST', headers: { apikey: SB_KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error_description || j.msg || j.message || `Sign-in failed (${r.status})`);
  return j;
}
function saveSession(j) {
  SESSION = { access_token: j.access_token, refresh_token: j.refresh_token, expires_at: j.expires_at || (Math.floor(Date.now() / 1000) + (j.expires_in || 3600)) };
  store.set('hsm_session', SESSION);
}
let refreshing = null;
async function accessToken(force) {
  if (!SESSION) throw new Error('AUTH');
  if (force || SESSION.expires_at - 60 < Date.now() / 1000) {
    refreshing = refreshing || gotrue('token?grant_type=refresh_token', { refresh_token: SESSION.refresh_token })
      .then(saveSession).finally(() => { refreshing = null; });
    try { await refreshing; } catch (e) { if (isNet(e)) throw e; logout(true); throw new Error('AUTH'); }
  }
  return SESSION.access_token;
}
async function apiNet(path, opts = {}, retry = true) {
  const tok = opts.anon ? null : await accessToken();
  const headers = { apikey: SB_KEY, 'Content-Type': 'application/json', Prefer: opts.prefer || 'return=representation' };
  if (tok) headers.Authorization = `Bearer ${tok}`;
  const res = await tfetch(`${SB_URL}/rest/v1/${path}`, { method: opts.method || 'GET', headers, body: opts.body ? JSON.stringify(opts.body) : undefined });
  if (res.status === 401 && retry && !opts.anon) { await accessToken(true); return apiNet(path, opts, false); }
  const txt = await res.text(); let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
  if (!res.ok) throw new Error((data && (data.message || data.hint)) || `Error ${res.status}`);
  return data;
}
async function api(path, opts = {}) {
  const get = !opts.method || opts.method === 'GET';
  try {
    const d = await apiNet(path, opts);
    setOffline(false); if (get && CACHE_OK.test(path) && !opts.prefer) cachePut(path, d);
    if (outbox().length) setTimeout(flushOutbox, 300);
    return d;
  } catch (e) {
    if (!isNet(e)) throw e;
    setOffline(true);
    if (get && !opts.prefer) { const c = cacheGet(path); if (c != null) return c; }
    throw e;
  }
}
const rpc = (fn, args = {}, anon = false) => api(`rpc/${fn}`, { method: 'POST', body: args, anon });
const netErr = e => { if (e && e.message === 'AUTH') return; toast(isNet(e) ? 'No network. Check connection and try again.' : e.message); };

/* ================= OFFLINE OUTBOX (check lists) =================
 * A submitted check list is saved on the phone first, then uploaded. With no network it waits here
 * and uploads by itself as soon as the network is back (app open, or next start). client_id stops duplicates. */
const OBX = 'hsm_outbox';
const outbox = () => store.get(OBX, []);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10));
let flushing = null;
function flushOutbox() {
  if (flushing || !SESSION) return flushing;
  flushing = (async () => {
    let sent = 0;
    for (const item of outbox()) {
      try {
        await apiNet('checklist_entries?on_conflict=client_id', { method: 'POST', body: item.body, prefer: 'resolution=ignore-duplicates,return=minimal' });
        store.set(OBX, outbox().filter(x => x.body.client_id !== item.body.client_id)); sent++;
      } catch (e) { if (isNet(e) || e.message === 'AUTH') { setOffline(isNet(e)); break; } item.err = e.message; store.set(OBX, outbox().map(x => x.body.client_id === item.body.client_id ? item : x)); }
    }
    if (sent) { setOffline(false); toast(`${sent} check list${sent > 1 ? 's' : ''} uploaded`);
      const h = location.hash.replace(/^#\/?/, '') || 'home'; if (h === 'checklist' || h === 'home') render(); }
    return sent;
  })().finally(() => { flushing = null; });
  return flushing;
}
window.addEventListener('online', () => { setOffline(false); setTimeout(flushOutbox, 1500); });
window.addEventListener('offline', () => setOffline(true));
document.addEventListener('visibilitychange', () => { if (!document.hidden && outbox().length) flushOutbox(); });
setInterval(() => { if (outbox().length && navigator.onLine !== false) flushOutbox(); }, 45000);
const obxEntries = day => outbox().map(x => ({ ...x.body, id: 'local:' + x.body.client_id, created_at: x.body.filled_at, local: true })).filter(r => !day || r.check_date === day);

function logout(expired) {
  SESSION = null; ME = null; store.del('hsm_session'); store.del('hsm_me');
  if (expired) toast('Please sign in again');
  location.hash = ''; render();
}

/* Storage (SOP documents) */
async function storageList(prefix, bucket = SOP_BUCKET) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/list/${bucket}`, { method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ prefix, limit: 1000, offset: 0, sortBy: { column: 'name', order: 'asc' } }) });
  if (!r.ok) throw new Error('Could not load documents');
  return r.json();
}
async function storageSignedUrl(path, bucket = SOP_BUCKET) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/sign/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`, { method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ expiresIn: 3600 }) });
  const j = await r.json(); if (!r.ok) throw new Error(j.message || 'Could not open document');
  return `${SB_URL}/storage/v1${j.signedURL || j.signedUrl}`;
}
async function storageUpload(path, file, bucket = SOP_BUCKET, upsert = false) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/${bucket}/${path.split('/').map(encodeURIComponent).join('/')}`, { method: 'POST',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': file.type || 'application/octet-stream', 'x-upsert': upsert ? 'true' : 'false' }, body: file });
  if (!r.ok) { const j = await r.json().catch(() => ({})); const ex = /exist|duplicate/i.test((j.message || '') + (j.error || '')); const e = new Error(ex ? 'A file with this name already exists' : (j.message || 'Upload failed')); e.exists = ex; throw e; }
}
async function storageDelete(path, bucket) {
  const tok = await accessToken();
  const r = await fetch(`${SB_URL}/storage/v1/object/${bucket}`, { method: 'DELETE',
    headers: { apikey: SB_KEY, Authorization: `Bearer ${tok}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ prefixes: [path] }) });
  const j = await r.json().catch(() => null);
  if (!r.ok || !Array.isArray(j) || !j.length) throw new Error('Could not delete');
}
const myUid = () => { try { return JSON.parse(atob(SESSION.access_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).sub; } catch (e) { return null; } };
let AVATARS = null;
async function avatars() { if (!AVATARS) { try { AVATARS = await rpc('hsm_avatars') || []; } catch (e) { return []; } } return AVATARS; }
function squarePhoto(file, size = 400) {
  return new Promise((ok, no) => {
    const url = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const s = Math.min(im.naturalWidth, im.naturalHeight), c = document.createElement('canvas'); c.width = c.height = size;
      c.getContext('2d').drawImage(im, (im.naturalWidth - s) / 2, (im.naturalHeight - s) / 2, s, s, 0, 0, size, size);
      URL.revokeObjectURL(url); c.toBlob(b => b ? ok(b) : no(new Error('Could not read photo')), 'image/jpeg', 0.85); };
    im.onerror = () => { URL.revokeObjectURL(url); no(new Error('Could not read this photo. Use a JPG or PNG.')); };
    im.src = url;
  });
}
async function setMyPhoto(file) {
  const uid = myUid(); if (!uid) throw new Error('AUTH');
  toast('Saving photo…', 15000);
  const blob = await squarePhoto(file);
  await storageUpload(`${uid}.jpg`, new File([blob], 'photo.jpg', { type: 'image/jpeg' }), 'avatars', true);
  const url = `${SB_URL}/storage/v1/object/public/avatars/${uid}.jpg?v=${Date.now()}`;
  await rpc('hsm_set_avatar', { p_url: url });
  ME.avatar = url; store.set('hsm_me', ME); AVATARS = null; toast('Photo updated');
}

/* Files: save + share (Android) or download (browser) */
function toB64(buf) { const b = new Uint8Array(buf); let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
function deliver(buf, name, share) {
  if (window.HSMNative && HSMNative.saveFile) {
    const r = HSMNative.saveFile(toB64(buf), name, XLSX_MIME, !!share);
    if (String(r).startsWith('ok:')) toast(`Saved to ${String(r).slice(3)}`); else toast('Could not save file: ' + r);
    return;
  }
  // iPhone / browser: share sheet (Mail, Outlook, WhatsApp, Files…) when possible, else download
  const file = typeof File === 'function' ? new File([buf], name, { type: XLSX_MIME }) : null;
  if (share && file && navigator.canShare && navigator.canShare({ files: [file] })) {
    const doShare = () => navigator.share({ files: [file], title: name }).catch(e => { if (e && e.name !== 'AbortError') toast('Could not share: ' + e.message); });
    // iOS needs a fresh tap after the file is built
    const m = $('#modal');
    m.innerHTML = `<div class="sheet"><div class="status" style="padding:0"><div class="ring" style="background:var(--green-50);color:var(--green)">${ic('xls', 40)}</div><h2>Excel ready</h2><p>${esc(name)}</p></div>
      <button class="btn pri block" id="wshare">${ic('share')} Share / Mail</button><button class="btn ghost block" id="wclose">Close</button></div>`;
    m.classList.remove('hidden');
    $('#wshare').onclick = () => { doShare(); m.classList.add('hidden'); };
    $('#wclose').onclick = () => m.classList.add('hidden');
    return;
  }
  const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([buf], { type: XLSX_MIME })); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000); toast('Downloaded ' + name);
}
function openLink(url) { if (window.HSMNative && HSMNative.openUrl) HSMNative.openUrl(url); else window.open(url, '_blank'); }
/* ================= DOCUMENT VIEWER (in-app, no download) ================= */
const loadScript = src => new Promise((ok, no) => { if (document.querySelector(`script[data-lib="${src}"]`)) return ok();
  const t = document.createElement('script'); t.src = src; t.dataset.lib = src; t.onload = ok; t.onerror = () => { t.remove(); no(new Error('Viewer could not load')); }; document.head.appendChild(t); });
function closeDoc() { const v = $('#docv'); if (v) { v.remove(); document.body.style.overflow = ''; } }
window.addEventListener('popstate', () => { if ($('#docv')) closeDoc(); });
async function openDoc(path, bucket) {
  const name = path.split('/').pop(), ext = (name.split('.').pop() || '').toLowerCase();
  if (!['docx', 'pdf', 'jpg', 'jpeg', 'png'].includes(ext)) { toast('Opening…'); return openLink(await storageSignedUrl(path, bucket)); }
  closeDoc();
  const v = document.createElement('div'); v.id = 'docv';
  v.innerHTML = `<header class="bar"><h1 style="font-size:17px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${esc(name.replace(/\.[^.]+$/, ''))}</h1><button class="ib" id="docx-close" aria-label="Close">${ic('x', 28)}</button></header><div id="docb"><div class="spin">Opening…</div></div>`;
  v.addEventListener('contextmenu', e => e.preventDefault());
  document.body.appendChild(v); document.body.style.overflow = 'hidden';
  history.pushState({ docv: 1 }, '');
  $('#docx-close').onclick = () => history.back();
  const body = $('#docb'), live = () => document.body.contains(body);
  try {
    const url = await storageSignedUrl(path, bucket);
    const res = await fetch(url); if (!res.ok) throw new Error('Could not open document');
    const buf = await res.arrayBuffer(); if (!live()) return;
    if (ext === 'docx') {
      await loadScript('lib/jszip.min.js'); await loadScript('lib/docx-preview.min.js');
      body.innerHTML = '';
      await docx.renderAsync(buf, body, null, { inWrapper: false, ignoreWidth: true, ignoreHeight: true, ignoreLastRenderedPageBreak: true, useBase64URL: false, renderHeaders: true, renderFooters: false });
      // phone layout: pictures sit in line with the text, so the blank lines Word left for floating pictures are not needed
      body.querySelectorAll('section.docx img').forEach(img => { const d = img.parentElement; if (img.style.width) img.style.maxWidth = img.style.width;
        if (d && d.tagName === 'DIV') Object.assign(d.style, { position: 'static', display: 'block', width: 'auto', height: 'auto', top: 'auto', left: 'auto', margin: '8px 0' }); });
      body.querySelectorAll('section.docx p').forEach(p => { const empty = x => x && x.tagName === 'P' && !x.textContent.trim() && !x.querySelector('img,svg,table');
        if (empty(p) && empty(p.previousElementSibling)) p.remove(); });
    } else if (ext === 'pdf') {
      await loadScript('lib/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc = 'lib/pdf.worker.min.js';
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise; body.innerHTML = '';
      const w = body.clientWidth - 16, dpr = Math.min(window.devicePixelRatio || 1, 2);
      for (let i = 1; i <= pdf.numPages && live(); i++) {
        const pg = await pdf.getPage(i), vp0 = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: (w / vp0.width) * dpr });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height; c.className = 'pdfpg'; body.appendChild(c);
        await pg.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
      }
    } else {
      const img = new Image(); img.src = URL.createObjectURL(new Blob([buf])); img.style.cssText = 'width:100%;display:block'; body.innerHTML = ''; body.appendChild(img);
    }
  } catch (e) { if (live()) body.innerHTML = `<div class="empty"><b>Could not open this document</b>${esc(isNet(e) ? 'Check the network and try again.' : e.message)}</div>`; }
}
let XL = null;
function xl() {
  if (!XL) {
    if (!window.ExcelJS || !window.HSMXL) throw new Error('Excel module not loaded');
    XL = HSMXL.make(ExcelJS, async f => (await fetch(`xl/${f}`)).arrayBuffer());
  }
  return XL;
}

/* ================= DATA CACHES ================= */
let TPL = null, HIRAC = null, TEAM = null;
async function templates() { if (!TPL) TPL = await api('checklist_templates?select=code,name,area,sections&order=sort'); return TPL; }
async function hiracData() {
  if (!HIRAC) {
    // HIRAC register comes from the cloud (approved login only) and is kept on the phone for offline use
    const db = await api('hirac?select=no,title,ref,rev,eff_date,review_date,owner,sop_ref,activities,hazards&order=no');
    const list = (db || []).map(h => ({ no: h.no, title: h.title, ref: h.ref, rev: h.rev, eff: h.eff_date, review: h.review_date, owner: h.owner, sop: h.sop_ref, acts: h.activities, hz: h.hazards }));
    if (!list.length) return list;
    HIRAC = list;
  }
  return HIRAC;
}
async function team() { if (!TEAM) TEAM = await api('team?select=name,area,role,plant,company,mobile,email,sap_id&order=name'); return TEAM; }
const itemCount = t => t.sections.reduce((n, s) => n + s.items.length, 0);
const fieldsOf = (s, it) => s.fields || [{ l: '', t: it.t || 't' }];

/* ================= ROUTER ================= */
const S = { spareArea: SPARE_AREAS[0], spareQuery: '', spareLow: false, sopTab: 'numbers', sopGroup: 'All', sopQuery: '', docArea: 'CB',
            calMonth: null, calSel: null, teamQuery: '', reqTab: 'pending', reportDate: null, millArea: 'CB' };
const go = h => { location.hash = h; };
window.addEventListener('hashchange', render);
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return; }
  const b = e.target.closest('[data-back]'); if (b) { if (history.length > 1) history.back(); else go(b.dataset.back); }
});
window.hsmBack = () => {
  if ($('#docv')) { history.back(); return true; }
  if (!$('#modal').classList.contains('hidden')) { $('#modal').classList.add('hidden'); return true; }
  const h = location.hash.replace(/^#\/?/, ''); if (!h || h === 'home' || !SESSION) return false; history.back(); return true;
};

let meFresh = false;
async function refreshMe() {
  if (meFresh || !SESSION || !ME) return; meFresh = true;
  try {
    const me = await rpc('hsm_me'); if (!me) return;
    const key = () => JSON.stringify([ME.modules, ME.avatar, ME.is_admin, ME.name]), before = key();
    Object.assign(ME, { name: me.name, username: me.username, is_admin: me.is_admin, role: me.role, modules: me.modules, avatar: me.avatar });
    store.set('hsm_me', ME);
    if (key() !== before) render();
  } catch (e) { meFresh = false; }
}
function render() {
  window.scrollTo(0, 0);
  if (!SESSION || !ME) return viewLogin();
  refreshMe();
  if (ME.need_pin) return viewSetPin(false);
  const h = location.hash.replace(/^#\/?/, '') || 'home';
  const [page, ...rest] = h.split('/'); const arg = decodeURIComponent(rest.join('/'));
  const routes = { home: viewHome, schedule: viewSchedule, checklist: viewChecklist, cl: () => viewChecklistFill(arg), clh: () => viewChecklistHistory(arg),
    cle: () => viewChecklistEntry(arg), spares: viewSpares, spare: () => viewSpare(arg), sop: viewSop, hirac: () => viewHirac(arg), team: viewTeam,
    approvals: viewApprovals, user: () => viewUser(arg), pin: () => viewSetPin(true), profile: viewProfile, mill: viewMillProcessSops, admin: viewAdmin };
  if (ROUTE_MOD[page] && !can(ROUTE_MOD[page])) { toast('You do not have access to this module'); history.replaceState(null, '', '#home'); return viewHome(); }
  (routes[page] || viewHome)();
}
const bar = (title, backTo, extra = '') => `<header class="bar">${backTo ? `<button class="ib back" aria-label="Back" data-back="${backTo}">${ic('back', 26)}</button>` : ''}<h1>${esc(title)}</h1>${extra}</header>`;
const nav = on => `<nav class="nav" aria-label="Main">${[['home','home','Home'],['schedule','cal','Schedule'],['checklist','check','Check List'],['spares','box','Spares']].filter(([k]) => k === 'home' || can(k))
  .map(([k, i, l]) => `<button class="${on === k ? 'on' : ''}" data-go="${k}" ${on === k ? 'aria-current="page"' : ''}><span class="pill">${ic(i, 24)}</span>${l}</button>`).join('')}</nav>`;

/* ================= LOGIN / APPROVAL ================= */
function device() {
  let id = '', name = '';
  try { if (window.HSMNative && HSMNative.deviceId) { id = HSMNative.deviceId(); name = HSMNative.deviceName(); } } catch (e) {}
  if (!id) { id = store.get('hsm_devid'); if (!id) { id = 'web-' + Math.random().toString(36).slice(2) + Date.now().toString(36); store.set('hsm_devid', id); }
    const ua = navigator.userAgent; name = (/Android[^;)]*;\s*([^;)]+)/.exec(ua) || [])[1] || (/Windows|Mac|iPhone|iPad/.exec(ua) || ['Browser'])[0]; name += IS_IOS && STANDALONE ? ' (app)' : ' (browser)'; }
  return { id, name };
}
const IS_IOS = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const STANDALONE = (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const IOS_SAFARI = IS_IOS && !STANDALONE && !window.HSMNative;
let pendingCreds = null;
function viewLogin(state) {
  const st = state || (pendingCreds ? pendingCreds.kind : 'login');
  $('#app').innerHTML = `<div class="login">
    <div class="top"><div class="mk">E&amp;A</div><h1>HSM E&amp;A</h1><p>Electrical &amp; Automation · Hot Strip Mill</p></div>
    <div class="sheet" id="lsheet"></div></div>`;
  const sh = $('#lsheet');
  if (st === 'pending' || st === 'new_device') {
    const nd = st === 'new_device';
    sh.innerHTML = `<div class="status"><div class="ring">${ic(nd ? 'warn' : 'hourglass', 40)}</div><h2>${nd ? 'New phone – approval needed' : 'Waiting for approval'}</h2>
      <p>${nd ? `Your account is registered on another phone${pendingCreds.current ? ` (${esc(pendingCreds.current)})` : ''}. ${esc(ADMIN_NAME)} must approve this phone before you can use it here. The other phone will be signed out.`
              : `Hi ${esc(firstName(pendingCreds.name))}, your request has been sent. ${esc(ADMIN_NAME)} needs to approve it before you can open the app.`}</p></div>
      <div style="display:flex;flex-direction:column;gap:12px;margin-top:22px">
        <button class="btn pri block" id="lcheck">${ic('refresh')} Check again</button>
        <button class="btn block" id="lmail">${ic('mail')} Email the approver</button>
        <button class="btn ghost block" id="lback">Use a different login</button></div>`;
    $('#lcheck').onclick = () => doLogin(pendingCreds.user, pendingCreds.pass, true);
    $('#lmail').onclick = () => mailApprover(pendingCreds);
    $('#lback').onclick = () => { pendingCreds = null; viewLogin('login'); };
    return;
  }
  sh.innerHTML = `<form class="f" id="lf" style="padding:0" autocomplete="on">
    <div style="font-size:21px;font-weight:700">Sign in</div>
    <div id="lerr"></div>
    <div class="fld"><label for="lu">Username</label><input id="lu" autocomplete="username" autocapitalize="none" spellcheck="false" placeholder="Domain username (e.g. sagrawal9)" value="${esc(store.get('hsm_lastuser', ''))}"></div>
    <div class="fld"><label for="lp">SAP ID or PIN</label><input id="lp" type="password" inputmode="text" autocomplete="current-password" placeholder="SAP ID first time, then your PIN"></div>
    <button class="btn pri block" type="submit" id="lsub">Sign in</button>
    <p class="hint" style="margin:4px 2px 0;line-height:1.45">First time: domain username + SAP ID. You will then set your own PIN and use it from then on. No domain username? Enter your SAP ID in the username box. Your account works only on your own phone.</p>
  </form>${IOS_SAFARI ? `<div class="iosTip"><b>iPhone: install the app first.</b> Tap the Share button <span aria-hidden="true">⬆</span> at the bottom of Safari, then <b>Add to Home Screen</b>. Open <b>HSM E&amp;A</b> from your home screen and sign in there.</div>` : ''}`;
  $('#lf').onsubmit = e => { e.preventDefault(); doLogin($('#lu').value, $('#lp').value); };
}
async function doLogin(user, pass, recheck) {
  user = String(user || '').trim(); pass = String(pass || '').trim();
  const err = m => { const el = $('#lerr'); if (el) el.innerHTML = `<div class="err">${esc(m)}</div>`; else toast(m); };
  if (!user || !pass) return err('Enter username and SAP ID / PIN');
  const btn = $('#lsub') || $('#lcheck'); if (btn) btn.disabled = true;
  const dev = device();
  try {
    const r = await rpc('hsm_login', { p_user: user, p_pass: pass, p_device_id: dev.id, p_device_name: dev.name }, true);
    store.set('hsm_lastuser', user);
    if (r.status === 'invalid' || r.status === 'locked') {
      pendingCreds = null; viewLogin('login');
      return err(r.status === 'locked' ? 'Too many wrong attempts. Try again after 15 minutes.'
        : r.pin ? 'Wrong PIN. If you forgot it, ask ' + ADMIN_NAME + ' to reset it.' : 'Username or SAP ID is not correct, or you are not on the approved list.');
    }
    if (r.status === 'pending' || r.status === 'new_device') {
      const first = !pendingCreds && (r.was === 'none' || r.status === 'new_device');
      pendingCreds = { user, pass, name: r.name, kind: r.status, current: r.current, device: dev.name };
      viewLogin(r.status);
      if (recheck) toast('Still waiting for approval');
      if (first) mailApprover(pendingCreds);
      return;
    }
    const j = await gotrue('token?grant_type=password', { email: r.email, password: r.secret });
    saveSession(j);
    ME = { name: r.name, username: user.toLowerCase(), is_admin: !!r.is_admin, need_pin: !!r.need_pin };
    try { const me = await rpc('hsm_me'); if (me) Object.assign(ME, { name: me.name, username: me.username, is_admin: me.is_admin, role: me.role, modules: me.modules, avatar: me.avatar }); } catch (e) {}
    store.set('hsm_me', ME); pendingCreds = null;
    location.hash = 'home'; render();
    if (!ME.need_pin) toast(`Welcome, ${firstName(ME.name)}`);
  } catch (e) {
    if (btn) btn.disabled = false;
    err(/fetch|network/i.test(e.message) ? 'No network. Check connection.' : /banned/i.test(e.message) ? 'Your access is not approved yet.' : e.message);
  }
}
function mailApprover(c) {
  const nd = c.kind === 'new_device';
  const subject = `HSM E&A App – ${nd ? 'new phone' : 'access request'}: ${c.name}`;
  const body = `Hello ${ADMIN_NAME},\n\n${nd ? 'I am signing in to the HSM E&A app from a new phone. Please approve it.' : 'Please approve my access to the HSM E&A app.'}\n\nName: ${c.name}\nUsername: ${c.user}\nPhone: ${c.device || ''}\n\nTo approve: HSM E&A app → Home → Approvals.\n\nThank you.`;
  if (window.HSMNative && HSMNative.email) HSMNative.email(ADMIN_MAIL, subject, body);
  else location.href = `mailto:${ADMIN_MAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function viewSetPin(change) {
  $('#app').innerHTML = `<div class="login">
    <div class="top"><div class="mk">${ic('key', 30)}</div><h1>${change ? 'Change PIN' : 'Set your PIN'}</h1><p>${change ? 'Choose a new PIN.' : `Welcome ${esc(firstName(ME.name))}! Create a personal PIN. From now on you sign in with your username + this PIN – your SAP ID will no longer work.`}</p></div>
    <div class="sheet"><form class="f" id="pf" style="padding:0">
      <div id="perr"></div>
      <div class="fld"><label for="p1">New PIN (4–6 digits)</label><input id="p1" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" style="font-size:26px;letter-spacing:8px;text-align:center"></div>
      <div class="fld"><label for="p2">Repeat PIN</label><input id="p2" type="password" inputmode="numeric" maxlength="6" autocomplete="new-password" style="font-size:26px;letter-spacing:8px;text-align:center"></div>
      <button class="btn pri block" type="submit" id="psub">Save PIN</button>
      ${change ? '<button class="btn ghost block" type="button" data-back="profile">Cancel</button>' : ''}
      <p class="hint" style="line-height:1.45">Don't share your PIN. Everything you submit in the app is recorded under your name.</p></form></div></div>`;
  $('#pf').onsubmit = async e => {
    e.preventDefault(); const a = $('#p1').value.trim(), b = $('#p2').value.trim();
    const err = m => { $('#perr').innerHTML = `<div class="err">${esc(m)}</div>`; };
    if (!/^\d{4,6}$/.test(a)) return err('PIN must be 4 to 6 digits');
    if (a !== b) return err('The two PINs do not match');
    $('#psub').disabled = true;
    try { await rpc('hsm_set_pin', { p_pin: a }); ME.need_pin = false; store.set('hsm_me', ME); toast('PIN saved'); location.hash = 'home'; render(); }
    catch (x) { $('#psub').disabled = false; err(x.message); }
  };
}

/* ================= HOME ================= */
async function viewHome() {
  const now = new Date(); const sh = curShift(now);
  const cS = can('schedule'), cC = can('checklist'), cP = can('spares');
  const mods = MODULES.filter(m => can(m[0]));
  $('#app').innerHTML = `<main class="scroll">
    <div class="hero"><div class="row"><div><div class="brand">HSM · Electrical &amp; Automation</div>
      <div class="hi">${greet()}, ${esc(firstName(ME.name))}</div>
      <div class="sub">${DAYNAME[now.getDay()]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}</div></div>
      <button class="avatar-btn" data-go="profile" aria-label="My profile" style="overflow:hidden;padding:0">${ME.avatar ? `<img src="${esc(ME.avatar)}" alt="" style="width:100%;height:100%;object-fit:cover">` : esc(initials(ME.name))}</button></div></div>
    ${cS ? `<div class="lift card shiftcard" id="hshift"><div class="top"><div class="bigshift">${sh}</div><div><div class="t1">Shift on duty now</div><div class="t2">Shift ${sh} · ${SHIFT_TIME[sh]}</div></div></div>
      <div class="chips" id="hcrew"><span class="hint">Loading crew…</span></div></div>` : '<div style="height:16px"></div>'}
    <div id="hadmin"></div>
    ${cC || cP ? `<div class="stats" style="${cC && cP ? '' : 'grid-template-columns:1fr'}">
      ${cC ? `<button class="card stat" data-go="checklist"><span class="k">Check lists today</span><span class="v" id="hcl">–</span><span class="bar2"><i id="hclb" style="width:0"></i></span></button>` : ''}
      ${cP ? `<button class="card stat" id="hlow"><span class="k">Spares out of stock</span><span class="v" id="hsp">–</span><span class="hint">Tap to view</span></button>` : ''}
    </div>` : ''}
    <div class="sec-h">Apps</div>
    ${mods.length ? `<div class="grid">${mods.map(([k, t, i, sub]) => tile(k, i, t.replace(/'/g, '&#39;'), sub)).join('')}</div>`
      : `<div class="empty"><b>No modules yet</b>Ask ${esc(ADMIN_NAME)} to give you access.</div>`}
    <div style="height:24px"></div>
  </main>${nav('home')}`;
  if ($('#hlow')) $('#hlow').onclick = () => { S.spareLow = true; go('spares'); };
  const today = ymd(now);
  try {
    const soft = p => p.catch(e => { if (isNet(e)) return null; throw e; });
    let [roster, tpl, done, low] = await Promise.all([
      cS ? soft(api(`shift_roster?select=name,shift,area,ranking&day=eq.${today}&order=ranking,name`)) : null,
      cC ? templates() : [],
      cC ? soft(api(`checklist_entries?select=template_code&check_date=eq.${today}`)) : null,
      cP ? soft(api('spares?select=id&qty=lte.0')) : null]);
    if (cS && $('#hcrew')) {
      roster = roster || [];
      const crew = roster.filter(r => r.shift === sh);
      const mine = roster.find(r => sameName(r.name, ME.name));
      $('#hcrew').innerHTML = (crew.length ? crew.map(r => `<span class="chip ${sameName(r.name, ME.name) ? 'me' : ''}">${esc(r.name)}</span>`).join('') : '<span class="hint">No roster uploaded for today</span>')
        + (mine && mine.shift !== sh ? `<span class="chip me">You today: ${esc(mine.shift === 'WO' ? 'Weekly off' : mine.shift === 'L' ? 'Leave' : mine.shift === 'G' ? 'General' : 'Shift ' + mine.shift)}</span>` : '');
    }
    if (cC && $('#hcl')) {
      done = [...(done || []), ...obxEntries(today)];
      const n = new Set(done.map(d => d.template_code)).size;
      $('#hcl').innerHTML = `${n}<small>/${tpl.length}</small>`; $('#hclb').style.width = (tpl.length ? 100 * n / tpl.length : 0) + '%';
    }
    if (cP && $('#hsp')) $('#hsp').textContent = low ? low.length : '–';
  } catch (e) { netErr(e); }
  if (ME.is_admin) {
    try { const req = await rpc('hsm_requests'); const p = req.filter(r => r.status === 'pending' || (r.status === 'approved' && r.pending_device_name)).length; const bad = req.reduce((n, r) => n + (r.fails_24h || 0), 0);
      $('#hadmin').innerHTML = `<button class="alert" data-go="approvals" style="${p ? '' : 'background:#fff;color:var(--ink-2);box-shadow:var(--shadow)'}">${ic('key')}<span style="flex:1">${p ? `${p} request${p > 1 ? 's' : ''} waiting for your approval` : 'Approvals & sign-ins – nothing pending'}${bad ? ` · ${bad} wrong login${bad > 1 ? 's' : ''} today` : ''}</span>${ic('chev')}</button>`;
    } catch (e) {}
  }
}
const tile = (to, icon, t, s) => `<button class="card tile" data-go="${to}"><span class="ic">${ic(icon, 26)}</span><span><span class="tt">${t}</span></span><span class="ts">${s}</span></button>`;

/* ================= PROFILE ================= */
function viewProfile() {
  $('#app').innerHTML = `${bar('My Profile', 'home')}<main class="scroll"><div class="pad">
    <div class="card" style="padding:22px;display:flex;align-items:center;gap:16px">
      <label style="position:relative;cursor:pointer;flex-shrink:0" aria-label="Change profile photo">${avHtml(ME.avatar, ME.name, 'width:76px;height:76px;border-radius:38px;font-size:26px')}
        <span style="position:absolute;right:-2px;bottom:-2px;width:30px;height:30px;border-radius:15px;background:var(--red);color:#fff;display:flex;align-items:center;justify-content:center;border:2px solid #fff">${ic('plus', 16)}</span>
        <input type="file" id="pph" accept="image/*" hidden></label>
      <div><div style="font-size:21px;font-weight:700">${esc(ME.name)}</div><div class="hint">${esc(ME.username)}${ME.role ? ' · ' + esc(ME.role) : ''}</div>
      ${ME.is_admin ? '<span class="tag soft" style="margin-top:6px">App admin</span>' : ''}
      ${ME.avatar ? '<div><button class="linkbtn" id="prm" style="background:none;border:0;padding:6px 0 0;color:var(--ink-2);font-size:14px;text-decoration:underline">Remove photo</button></div>' : '<div class="hint" style="margin-top:4px">Tap the circle to add your photo</div>'}</div></div>
    <div style="display:flex;flex-direction:column;gap:12px;margin-top:18px">
      <button class="btn block" data-go="pin">${ic('key')} Change PIN</button>
      ${ME.is_admin ? `<button class="btn block" data-go="approvals">${ic('users')} App approvals &amp; sign-ins</button>
        <button class="btn block" data-go="admin">${ic('upload')} Admin uploads</button>
        <button class="btn block" id="pxl">${ic('xls')} Master spares Excel (cloud)</button>` : ''}
      <button class="btn ghost block" id="pout">${ic('logout')} Sign out</button></div>
    <p class="hint" style="margin-top:22px;text-align:center">HSM E&amp;A App · version 2.8 (build ${esc(window.HSM_APP_VERSION || 0)})</p></div></main>`;
  $('#pph').onchange = async e => { const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    if (f.size > 25 * 1024 * 1024) return toast('Photo is too large');
    try { await setMyPhoto(f); viewProfile(); } catch (err) { netErr(err); } };
  if ($('#prm')) $('#prm').onclick = async () => { if (!(await ask('Remove your photo?', '', 'Remove'))) return;
    try { await rpc('hsm_set_avatar', { p_url: null }); ME.avatar = null; store.set('hsm_me', ME); AVATARS = null; viewProfile(); } catch (err) { netErr(err); } };
  if ($('#pxl')) $('#pxl').onclick = async () => {
    try { const link = await rpc('hsm_excel_link'); if (!link) return toast('Not allowed');
      const m = $('#modal');
      m.innerHTML = `<div class="sheet"><h3>Master spares Excel</h3><p>This private link always downloads the latest spares from the cloud – your PC does not need to be on. Keep it private.</p>
        <div class="err" style="background:var(--bg);color:var(--ink);font-size:13px;word-break:break-all;user-select:all">${esc(link)}</div>
        <button class="btn pri block" id="xo">${ic('download')} Download now</button><div class="two"><button class="btn" id="xc">Copy link</button><button class="btn ghost" id="xx">Close</button></div></div>`;
      m.classList.remove('hidden');
      $('#xo').onclick = () => openLink(link);
      $('#xc').onclick = async () => { try { await navigator.clipboard.writeText(link); toast('Link copied'); } catch (e) { toast('Long-press the link to copy'); } };
      $('#xx').onclick = () => m.classList.add('hidden');
    } catch (e) { netErr(e); }
  };
  $('#pout').onclick = async () => { if (await ask('Sign out?', 'You will need your username and PIN to sign in again.', 'Sign out')) logout(); };
}

/* ================= APPROVALS & SIGN-INS (admin) ================= */
let REQ = [];
const RESULT = { ok: ['Signed in', 'green'], first_login: ['First sign-in', 'green'], new_device: ['New phone tried', 'amber'], wrong_password: ['Wrong SAP ID / PIN', 'red'],
  locked: ['Locked (too many tries)', 'red'], not_approved: ['Not approved yet', 'amber'], unknown_user: ['Unknown username', 'red'] };
const modTicks = (mods, key) => `<div class="mods" data-mk="${key}">${MODULES.map(([k, t, i]) => `<label class="modchk"><input type="checkbox" value="${k}" ${(mods || ALL_MODS).includes(k) ? 'checked' : ''}><span class="mi">${ic(i, 18)}</span><span>${t}</span></label>`).join('')}</div>`;
const readTicks = key => $$(`[data-mk="${key}"] input:checked`).map(x => x.value);
async function viewApprovals() {
  if (!ME.is_admin) return go('home');
  $('#app').innerHTML = `${bar('Approvals & Sign-ins', 'home', `<button class="ib" id="arf" aria-label="Refresh">${ic('refresh', 26)}</button>`)}
    <div class="seg" id="aseg">${[['pending','Pending'],['users','Users'],['log','Sign-ins'],['other','Others']].map(([k, l]) => `<button data-t="${k}" class="${S.reqTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <main class="scroll" id="al"><div class="spin">Loading…</div></main>`;
  $('#arf').onclick = viewApprovals;
  $('#aseg').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { S.reqTab = b.dataset.t; viewApprovals(); } };
  try { REQ = await rpc('hsm_requests'); } catch (e) { netErr(e); $('#al').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  const isPend = r => r.status === 'pending' || (r.status === 'approved' && r.pending_device_name);
  const groups = { pending: REQ.filter(isPend), users: REQ.filter(r => r.status === 'approved'), other: REQ.filter(r => !['pending','approved'].includes(r.status)) };
  $$('#aseg button').forEach(b => { if (groups[b.dataset.t]) b.textContent = `${b.textContent.replace(/ \(\d+\)$/, '')} (${groups[b.dataset.t].length})`; });
  if (S.reqTab === 'log') return drawLog($('#al'), null);
  const list = groups[S.reqTab] || [];
  const body = S.reqTab === 'pending' ? list.map(r => {
      const phone = r.status === 'approved';
      return `<div class="lrow" style="flex-wrap:wrap">${avHtml(r.avatar_url, r.full_name)}
        <span class="tx"><span class="a">${esc(r.full_name)}</span><span class="b">${esc(r.username || '')} · ${esc(r.company_role || '')}</span>
        <span class="b">${phone ? `<b style="color:var(--amber)">New phone:</b> ${esc(r.pending_device_name)}<br>Current: ${esc(r.device_name || '-')}` : `Phone: ${esc(r.pending_device_name || '-')}`}</span>
        <span class="b">${fmtStamp(r.pending_since || r.requested_at)}</span></span>
        <span class="tag ${phone ? 'amber' : 'soft'}">${phone ? 'Phone change' : 'New user'}</span>
        ${phone ? '' : `<div style="width:100%;margin-top:10px"><div class="label" style="margin:0 0 6px">Modules this person can open</div>${modTicks(r.modules, 'p' + r.id)}</div>`}
        <div class="two" style="width:100%;margin-top:8px"><button class="btn ghost" data-d="${r.id}" data-a="0">${ic('x')} Reject</button><button class="btn green" data-d="${r.id}" data-a="1">${ic('ok')} Approve</button></div></div>`; }).join('')
    : list.map(r => `<button class="lrow" data-go="user/${r.id}">${avHtml(r.avatar_url, r.full_name)}
        <span class="tx"><span class="a">${esc(r.full_name)}</span><span class="b">${esc(r.username || 'No username / SAP ID in list')}${r.device_name ? ' · ' + esc(r.device_name) : ''}</span>
        <span class="b">${r.last_login ? 'Last sign-in ' + fmtStamp(r.last_login) : r.status === 'approved' ? 'Not signed in yet' : esc(r.company_role || '')}${r.status === 'approved' && !r.has_pin ? ' · no PIN yet' : ''}${r.status === 'approved' ? ' · ' + (r.is_admin ? 'all modules (admin)' : `${(r.modules || []).length} of 6 modules`) : ''}</span></span>
        ${r.fails_24h ? `<span class="tag red">${r.fails_24h} wrong</span>` : r.status === 'rejected' ? '<span class="tag red">Rejected</span>' : r.status === 'none' ? '<span class="tag">Not requested</span>' : ''}<span class="chev">${ic('chev', 20)}</span></button>`).join('');
  $('#al').innerHTML = list.length ? `<div class="pad">${S.reqTab === 'users' ? '<div class="label">Tap a person to see their sign-ins and phone</div>' : ''}<div class="list">${body}</div></div>`
    : `<div class="empty"><b>${S.reqTab === 'pending' ? 'Nothing waiting' : 'Nobody here'}</b>${S.reqTab === 'pending' ? 'New users and phone changes appear here.' : ''}</div>`;
  $('#al').onclick = async e => {
    const b = e.target.closest('[data-d]'); if (!b) return;
    const r = REQ.find(x => String(x.id) === b.dataset.d); const ok = b.dataset.a === '1'; const phone = r.status === 'approved';
    if (!ok && !(await ask(phone ? `Block the new phone for ${r.full_name}?` : `Reject ${r.full_name}?`, phone ? 'They stay signed in on their current phone only.' : 'They will not be able to open the app.', 'Reject'))) return;
    if (ok && phone && !(await ask(`Move ${r.full_name} to the new phone?`, `${r.pending_device_name}\nThe old phone (${r.device_name || '-'}) will be signed out.`, 'Approve'))) return;
    let mods = null;
    if (ok && !phone) { mods = readTicks('p' + r.id); if (!mods.length) return toast('Tick at least one module'); }
    b.disabled = true;
    try { if (mods) await rpc('hsm_set_modules', { p_id: r.id, p_modules: mods });
      const res = await rpc('hsm_decide', { p_id: r.id, p_approve: ok }); toast({ approved: `${r.full_name} approved`, rejected: `${r.full_name} rejected`, device_changed: 'New phone approved', device_rejected: 'New phone blocked' }[res] || 'Done'); viewApprovals(); }
    catch (err) { netErr(err); b.disabled = false; }
  };
}
async function drawLog(el, userId) {
  el.innerHTML = '<div class="spin">Loading…</div>';
  let rows = [];
  try { rows = await rpc('hsm_login_log', { p_user_id: userId, p_limit: userId ? 60 : 150 }) || []; } catch (e) { netErr(e); }
  const warn = rows.filter(r => ['wrong_password','locked','new_device','unknown_user'].includes(r.result) && Date.now() - new Date(r.at) < 7 * 864e5).length;
  el.innerHTML = `<div class="pad">${!userId && warn ? `<div class="alert" style="width:100%;margin:0 0 12px">${ic('warn')}<span>${warn} suspicious sign-in attempt${warn > 1 ? 's' : ''} in the last 7 days</span></div>` : ''}
    <div class="label">${userId ? 'Sign-in history' : 'Latest sign-ins (all users)'}</div>` + (rows.length ? `<div class="list">${rows.map(r => { const [t, c] = RESULT[r.result] || [r.result, ''];
      return `<div class="lrow"${r.user_id && !userId ? ` data-go="user/${r.user_id}" style="cursor:pointer"` : ''}><span class="tx">${userId ? '' : `<span class="a" style="font-size:16px">${esc(r.full_name || r.typed_user || '?')}</span>`}
        <span class="b">${fmtStamp(r.at)} · ${esc(r.device_name || 'unknown device')}</span></span><span class="tag ${c}">${esc(t)}</span></div>`; }).join('')}</div>`
      : '<div class="empty"><b>No sign-ins yet</b></div>') + '</div>';
}
async function viewUser(id) {
  if (!ME.is_admin) return go('home');
  $('#app').innerHTML = `${bar('User', 'approvals')}<main class="scroll" id="ud"><div class="spin">Loading…</div></main>`;
  if (!REQ.length) { try { REQ = await rpc('hsm_requests'); } catch (e) { netErr(e); return; } }
  const r = REQ.find(x => String(x.id) === String(id)); if (!r) { $('#ud').innerHTML = '<div class="empty"><b>User not found</b></div>'; return; }
  const self = sameName(r.full_name, ME.name) && r.username === ME.username;
  $('#ud').innerHTML = `<div class="dayhead"><div class="k">${esc(r.company_role || '')} · ${esc(r.status)}</div><div class="v">${esc(r.full_name)}</div><div style="font-size:15px">${esc(r.username || '')}</div></div>
    <div class="meta"><div><span class="k">Registered phone</span><span class="v">${esc(r.device_name || 'None yet')}</span></div><div><span class="k">PIN</span><span class="v">${r.has_pin ? 'Set' : 'Not set'}</span></div>
      <div><span class="k">Last sign-in</span><span class="v">${r.last_login ? fmtStamp(r.last_login) : '-'}</span></div><div><span class="k">Approved by</span><span class="v">${esc(r.decided_by || '-')}${r.decided_at ? ' · ' + fmtShort(new Date(r.decided_at)) : ''}</span></div></div>
    ${r.status === 'approved' && !self ? `<div style="padding:14px 16px 0;display:flex;flex-direction:column;gap:10px">
      ${r.has_pin ? `<button class="btn block" data-x="reset_pin">${ic('key')} Reset PIN (forgot PIN)</button>` : ''}
      ${r.device_name ? `<button class="btn block" data-x="unbind">${ic('refresh')} Free the phone</button>` : ''}
      <button class="btn ghost block" data-x="remove" style="color:var(--red);border-color:var(--red-100)">${ic('x')} Remove access</button></div>`
      : r.status !== 'approved' && r.status !== 'pending' ? `<div style="padding:14px 16px 0"><button class="btn green block" data-x="approve">${ic('ok')} Approve now</button></div>` : ''}
    ${r.is_admin ? '' : `<div class="pad" style="padding-bottom:0"><div class="card" style="padding:14px 14px 16px"><div class="label" style="margin:0 0 4px">Module access</div>
      <p class="hint" style="margin:0 0 10px">Only ticked modules appear in their app. The cloud also blocks the others.</p>
      ${modTicks(r.modules, 'u' + r.id)}<button class="btn pri block" id="usave" style="margin-top:12px">${ic('ok')} Save access</button></div></div>`}
    <div id="ulog"></div>`;
  drawLog($('#ulog'), r.id);
  if ($('#usave')) $('#usave').onclick = async () => {
    const mods = readTicks('u' + r.id);
    if (!mods.length && !(await ask(`No modules for ${r.full_name}?`, 'They can still sign in but will see no modules.', 'Save'))) return;
    try { r.modules = await rpc('hsm_set_modules', { p_id: r.id, p_modules: mods }); toast('Access saved'); } catch (e) { netErr(e); }
  };
  $('#ud').onclick = async e => {
    const b = e.target.closest('[data-x]'); if (!b) return; const x = b.dataset.x;
    const txt = { reset_pin: [`Reset PIN for ${r.full_name}?`, 'They can sign in once with their SAP ID (only on their registered phone) and must set a new PIN.', 'Reset'],
      unbind: [`Free the phone for ${r.full_name}?`, 'They are signed out now; the next phone they sign in on becomes their phone without asking you. Use this only if you know they changed phone.', 'Free phone'],
      remove: [`Remove access for ${r.full_name}?`, 'They are signed out immediately and cannot open the app.', 'Remove'],
      approve: [`Approve ${r.full_name}?`, 'Their phone is registered on their first sign-in.', 'Approve'] }[x];
    if (!(await ask(...txt))) return;
    try {
      if (x === 'remove') await rpc('hsm_decide', { p_id: r.id, p_approve: false });
      else if (x === 'approve') await rpc('hsm_decide', { p_id: r.id, p_approve: true });
      else await rpc('hsm_admin_action', { p_id: r.id, p_action: x });
      toast('Done'); REQ = []; viewUser(id);
    } catch (err) { netErr(err); }
  };
}

/* ================= SHIFT SCHEDULE ================= */
async function viewSchedule() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (!S.calMonth) S.calMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  if (!S.calSel) S.calSel = new Date(today);
  $('#app').innerHTML = `${bar('Shift Schedule')}<main class="scroll" id="sc"><div class="spin">Loading…</div></main>${nav('schedule')}`;
  const m = S.calMonth, y = m.getFullYear(), mo = m.getMonth();
  let marked = new Set(), rows = [];
  try {
    const [daysR, dayR] = await Promise.all([
      api(`shift_roster?select=day&day=gte.${ymd(m)}&day=lte.${ymd(new Date(y, mo + 1, 0))}`),
      api(`shift_roster?select=name,shift,area,ranking&day=eq.${ymd(S.calSel)}&order=ranking,name`)]);
    daysR.forEach(r => marked.add(r.day)); rows = dayR;
  } catch (e) { netErr(e); }
  const lead = (new Date(y, mo, 1).getDay() + 6) % 7, nDays = new Date(y, mo + 1, 0).getDate();
  let cells = ''; for (let i = 0; i < lead; i++) cells += '<span></span>';
  for (let d = 1; d <= nDays; d++) {
    const dt = new Date(y, mo, d), k = ymd(dt);
    const cls = [dt.getDay() === 0 ? 'sun' : '', +dt === +today ? 'today' : '', +dt === +S.calSel && +dt !== +today ? 'sel' : '', marked.has(k) ? 'has' : ''].join(' ');
    cells += `<button class="${cls}" data-day="${k}" aria-label="${d} ${MONTHS[mo]}">${d}</button>`;
  }
  const by = s => rows.filter(r => r.shift === s);
  const nm = r => `<div class="nm ${sameName(r.name, ME.name) ? 'me' : ''}">${esc(r.name)}${r.area ? ` <span class="hint">· ${esc(r.area)}</span>` : ''}</div>`;
  const grp = (b, cls, t, list) => list.length ? `<div class="grp"><span class="badge ${cls}">${b}</span><div><div class="gt">${t}</div>${list.map(nm).join('')}</div></div>` : '';
  const areaMap = {}; rows.filter(r => r.area && !['L','WO'].includes(r.shift)).forEach(r => (areaMap[r.area] = areaMap[r.area] || []).push(r));
  const isToday = +S.calSel === +today;
  $('#sc').innerHTML = `<div class="pad">
    <section class="card" style="padding:8px 12px 14px;margin-bottom:14px">
      <div class="cal-h"><button class="ib" id="pm" aria-label="Previous month">${ic('back')}</button><h2>${MONTHS[mo]} ${y}</h2><button class="ib" id="nm" aria-label="Next month">${ic('chev')}</button></div>
      <div class="wk"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
      <div class="days">${cells}</div></section>
    <section class="card" style="overflow:hidden;margin-bottom:14px">
      <div class="dayhead"><div class="k">${isToday ? 'Shift Schedule Today' : 'Shift Schedule'}</div><div class="v">${fmtDay(S.calSel)}</div></div>
      ${rows.length ? grp('A','','A Shift · 07–15',by('A')) + grp('B','','B Shift · 15–23',by('B')) + grp('C','','C Shift · 23–07',by('C')) + grp('G','','General Shift',by('G')) + grp('L','l','Leave',by('L')) + grp('WO','wo','Weekly Off',by('WO'))
        : '<div class="empty" style="padding:26px 20px">No schedule uploaded for this date.</div>'}
    </section>
    ${Object.keys(areaMap).length ? `<section class="card" style="overflow:hidden"><div class="boxh"><h2>Area-wise</h2><span class="hint">G = General</span></div>
      ${Object.keys(areaMap).sort().map(a => `<div class="arow"><span class="an">${esc(a)}</span><div>${areaMap[a].map(p => `<div class="pp"><span>${esc(p.name)}</span><span class="tag ${p.shift === 'G' ? '' : 'red'}">${esc(p.shift)}</span></div>`).join('')}</div></div>`).join('')}
    </section>` : ''}</div>`;
  $('#pm').onclick = () => { S.calMonth = new Date(y, mo - 1, 1); viewSchedule(); };
  $('#nm').onclick = () => { S.calMonth = new Date(y, mo + 1, 1); viewSchedule(); };
  $$('#sc [data-day]').forEach(b => b.onclick = () => { S.calSel = fromYmd(b.dataset.day); viewSchedule(); });
}

/* ================= CHECK LISTS ================= */
const draftKey = code => `hsm_cl_${code}`;
async function viewChecklist() {
  $('#app').innerHTML = `${bar('Check List')}<main class="scroll" id="cl"><div class="spin">Loading…</div></main>${nav('checklist')}`;
  const today = ymd(new Date()); S.reportDate = S.reportDate || today;
  try {
    const tpl = await templates();
    let done = []; try { done = await api(`checklist_entries?select=template_code,created_at,filled_at,inspected_name,shift&check_date=eq.${today}&order=created_at.desc`); } catch (e) { if (!isNet(e)) throw e; }
    const waiting = outbox();
    const last = {}; [...obxEntries(today), ...done].forEach(d => { (last[d.template_code] = last[d.template_code] || []).push(d); });
    const nDone = Object.keys(last).length;
    $('#cl').innerHTML = `<div class="pad">
      ${waiting.length ? `<div class="card obx"><span class="ic">${ic('clock', 24)}</span><div style="flex:1"><div class="t">${waiting.length} check list${waiting.length > 1 ? 's' : ''} saved on this phone</div>
        <div class="s">${waiting.some(x => x.err) ? 'Upload problem: ' + esc(waiting.find(x => x.err).err) : 'Will upload by itself when the network is back'}</div></div><button class="btn" id="obxgo">Upload now</button></div>` : ''}
      <div class="card report"><div class="row"><span class="ic">${ic('xls', 26)}</span><div style="flex:1"><div class="t">Daily report (Excel)</div><div class="s">All check lists of the day in your inspection-sheet format</div></div></div>
        <div class="row"><input type="date" id="rdate" value="${S.reportDate}" max="${today}" aria-label="Report date"></div>
        <div class="two"><button class="btn" id="rsave">${ic('download')} Save</button><button class="btn pri" id="rshare">${ic('share')} Share / Mail</button></div></div>
      <div class="label">Today · ${fmtDay(new Date())} · ${nDone}/${tpl.length} done</div>
      ${tpl.map(t => {
        const d = last[t.code], dr = store.get(draftKey(t.code));
        const cls = d ? (d.every(x => x.local) ? 'draft' : 'done') : dr ? 'draft' : '';
        const b = d ? `${d.some(x => x.local) ? 'Saved on phone' : 'Done'} · ${d.map(x => `${esc(x.shift || '')} ${new Date(x.filled_at || x.created_at).toTimeString().slice(0, 5)}`).join(', ')} · ${esc(firstName(d[0].inspected_name))}`
          : dr ? 'Draft saved – not submitted' : `${itemCount(t)} items · not done today`;
        return `<button class="card clcard ${cls}" data-go="cl/${esc(t.code)}"><span class="ic">${ic(d ? 'ok' : dr ? 'clock' : 'check', 24)}</span><span class="tx"><span class="a">${esc(t.name)}</span><span class="b">${b}</span></span><span class="tag">${esc(t.area || '')}</span></button>`;
      }).join('')}</div>`;
    $('#rdate').onchange = e => { S.reportDate = e.target.value || today; };
    $('#rsave').onclick = () => dailyReport(S.reportDate, false);
    $('#rshare').onclick = () => dailyReport(S.reportDate, true);
    if ($('#obxgo')) $('#obxgo').onclick = async () => { toast('Uploading…'); const n = await flushOutbox(); if (!n && outbox().length) toast('Still no network – will try again automatically'); };
  } catch (e) { $('#cl').innerHTML = '<div class="empty"><b>Could not load check lists</b>Check network and try again.</div>'; netErr(e); }
}
async function dailyReport(day, share) {
  toast('Preparing Excel…', 8000);
  try {
    const tpl = await templates();
    let rows = [], off = false;
    try { rows = await api(`checklist_entries?select=*&check_date=eq.${day}&order=created_at`); } catch (e) { if (!isNet(e)) throw e; off = true; }
    const have = new Set(rows.map(r => r.client_id).filter(Boolean));
    rows = [...rows, ...obxEntries(day).filter(r => !have.has(r.client_id))];
    if (!rows.length) { toast(off ? 'No network, and no check lists for this day on this phone' : `No check lists submitted on ${fmtShort(fromYmd(day))}`); return; }
    if (off || OFFLINE) toast('No network: report made from data on this phone', 4000);
    const buf = await xl().dailyWorkbook(tpl, rows, day);
    deliver(buf, `HSM E&A Daily Checklist ${fmtShort(fromYmd(day))}.xlsx`, share);
  } catch (e) { netErr(e); }
}
async function recordReport(tpl, entry, share) {
  try { toast('Preparing Excel…', 6000); const buf = await xl().recordWorkbook(tpl, entry);
    deliver(buf, `${tpl.name} ${fmtShort(fromYmd(entry.check_date))} Shift ${entry.shift || ''}.xlsx`, share);
  } catch (e) { netErr(e); }
}

async function viewChecklistFill(code) {
  $('#app').innerHTML = `${bar('Check List', 'checklist')}<main class="scroll"><div class="spin">Loading…</div></main>`;
  let t; try { t = (await templates()).find(x => x.code === code); } catch (e) { netErr(e); }
  if (!t) { $('#app').innerHTML = `${bar('Check List', 'checklist')}<div class="empty"><b>Check list not found</b></div>`; return; }
  const total = t.sections.reduce((n, s) => n + s.items.reduce((m, it) => m + fieldsOf(s, it).length, 0), 0);
  const dr = store.get(draftKey(code)) || { v: {}, shift: curShift(), remarks: '' }; const V = dr.v;
  const okBtns = k => `<span class="okg" data-k="${k}"><button type="button" data-ok="OK" class="${V[k] === 'OK' ? 'on' : ''}">OK</button><button type="button" data-ok="NOT OK" class="nok ${V[k] === 'NOT OK' ? 'on' : ''}">NOT OK</button></span>`;
  const input = (f, k) => f.t === 'ok' ? okBtns(k)
    : `<input data-k="${k}" ${f.t === 'n' ? 'inputmode="decimal"' : ''} value="${esc(V[k] || '')}" aria-label="${esc(f.l || 'Value')}" placeholder="${f.t === 'n' && !/current|pos/i.test(f.l) ? '°C' : ''}">`;
  $('#app').innerHTML = `${bar(t.name, 'checklist', `<button class="ib" aria-label="Past records" data-go="clh/${esc(code)}">${ic('clock', 26)}</button>`)}
  <div class="clhead"><span>${fmtDay(new Date())}</span><span class="shiftsel" id="shs">${['A','B','C','G'].map(s => `<button type="button" data-s="${s}" class="${dr.shift === s ? 'on' : ''}" aria-pressed="${dr.shift === s}">${s}</button>`).join('')}</span></div>
  <div class="prog"><div id="pbar"></div></div>
  <main class="scroll" id="clf"><div style="padding:6px 12px 24px">
    ${t.sections.map((s, si) => `<h2 class="clsec">${esc(s.title)}${s.fields ? `<span>${s.fields.map(f => esc(f.l)).join(' · ')}</span>` : ''}</h2>
      ${s.items.map((it, ii) => { const fs = fieldsOf(s, it);
        return `<div class="clitem"><div class="cln">${esc(it.name)}</div><div class="clf ${fs.length === 1 ? 'one' : ''}">${fs.map((f, fi) => `<label>${f.l ? `<span>${esc(f.l)}</span>` : ''}${input(f, `${si}.${ii}.${fi}`)}</label>`).join('')}</div></div>`; }).join('')}`).join('')}
    <div class="fld" style="margin-top:18px"><label for="clrem">Remarks</label><textarea id="clrem" rows="3" placeholder="Abnormality found, action taken…">${esc(dr.remarks || '')}</textarea></div>
    <p class="hint" style="margin-top:12px">Inspected by ${esc(ME.name)}. Readings are kept on this phone until you submit.</p>
  </div></main>
  <div class="actions"><button class="btn ghost" type="button" id="clclear">Clear</button><button class="btn pri" type="button" id="clsub">Submit</button></div>`;
  const upd = () => { const n = Object.values(V).filter(x => x).length; $('#pbar').style.width = (100 * n / total) + '%'; $('#clsub').innerHTML = `Submit <span style="font-size:15px;font-weight:600;opacity:.85">${n}/${total}</span>`; };
  const persist = () => { dr.remarks = $('#clrem').value; store.set(draftKey(code), dr); upd(); };
  upd();
  const f = $('#clf');
  f.addEventListener('input', e => { const k = e.target.dataset.k; if (k) V[k] = e.target.value.trim(); persist(); });
  f.addEventListener('click', e => { const b = e.target.closest('[data-ok]'); if (!b) return; const g = b.parentElement, k = g.dataset.k;
    V[k] = V[k] === b.dataset.ok ? '' : b.dataset.ok; $$('button', g).forEach(x => x.classList.toggle('on', V[k] === x.dataset.ok)); persist(); });
  $('#shs').onclick = e => { const b = e.target.closest('[data-s]'); if (!b) return; dr.shift = b.dataset.s;
    $$('#shs button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); }); persist(); };
  $('#clclear').onclick = async () => { if (!Object.values(V).some(x => x)) return; if (await ask('Clear all readings?', 'This removes everything you entered in this check list.', 'Clear')) { store.del(draftKey(code)); viewChecklistFill(code); } };
  $('#clsub').onclick = async () => {
    const n = Object.values(V).filter(x => x).length;
    if (!n) return toast('Fill at least one reading');
    if (n < total && !(await ask('Submit check list?', `${total - n} of ${total} readings are empty.`, 'Submit'))) return;
    const btn = $('#clsub'); btn.disabled = true; btn.textContent = 'Submitting…';
    try {
      const clean = {}; Object.keys(V).forEach(k => { if (V[k]) clean[k] = V[k]; });
      const now = new Date();
      const body = { client_id: uid(), template_code: code, check_date: ymd(now), shift: dr.shift, filled_at: now.toISOString(),
        inspected_by: ME.username, inspected_name: ME.name, vals: clean, remarks: $('#clrem').value.trim() || null };
      // 1) safe on the phone first  2) upload now if there is network, otherwise later by itself
      store.set(OBX, [...outbox(), { body, queued_at: now.toISOString() }]);
      store.del(draftKey(code));
      await flushOutbox();
      const pending = outbox().some(x => x.body.client_id === body.client_id);
      const row = { ...body, created_at: body.filled_at };
      const nok = Object.values(clean).filter(v => v === 'NOT OK').length;
      const m = $('#modal');
      m.innerHTML = `<div class="sheet"><div class="status" style="padding:0"><div class="ring" style="background:${pending ? 'var(--amber-50,#FFF4E5);color:var(--amber)' : 'var(--green-50);color:var(--green)'}">${ic(pending ? 'clock' : 'ok', 40)}</div>
        <h2>${pending ? 'Saved on this phone' : 'Check list submitted'}</h2><p>${esc(t.name)} · Shift ${esc(dr.shift)} · ${Object.keys(clean).length} readings${nok ? ` · <b style="color:var(--red)">${nok} NOT OK</b>` : ''}</p>
        ${pending ? '<p style="margin-top:8px">No network here. It will upload by itself when the network is back – no need to fill it again.</p>' : ''}</div>
        <button class="btn pri block" id="mshare">${ic('share')} Share Excel by mail</button>
        <div class="two"><button class="btn" id="msave">${ic('download')} Save Excel</button><button class="btn ghost" id="mdone">Done</button></div></div>`;
      m.classList.remove('hidden');
      const close = () => { m.classList.add('hidden'); go('checklist'); };
      $('#mshare').onclick = () => recordReport(t, row, true);
      $('#msave').onclick = () => recordReport(t, row, false);
      $('#mdone').onclick = close; m.onclick = e => { if (e.target === m) close(); };
    } catch (e) { netErr(e); btn.disabled = false; upd(); }
  };
}

async function viewChecklistHistory(code) {
  $('#app').innerHTML = `${bar('Past records', 'checklist')}<main class="scroll" id="hh"><div class="spin">Loading…</div></main>`;
  try {
    const tpl = await templates();
    let rows = []; try { rows = await api(`checklist_entries?select=id,check_date,shift,inspected_name,vals,created_at,filled_at&template_code=eq.${encodeURIComponent(code)}&order=created_at.desc&limit=60`); } catch (e) { if (!isNet(e)) throw e; }
    rows = [...obxEntries().filter(r => r.template_code === code), ...rows];
    const t = tpl.find(x => x.code === code);
    $('#hh').innerHTML = `<div class="pad"><div class="label">${esc(t ? t.name : code)} · last ${rows.length}</div>` + (rows.length ? `<div class="list">${rows.map(r => {
      const vals = Object.values(r.vals || {}); const nok = vals.filter(v => v === 'NOT OK').length;
      return `<button class="lrow" data-go="cle/${r.id}"><span class="tx"><span class="a">${fmtDay(fromYmd(r.check_date))} · Shift ${esc(r.shift || '-')}</span><span class="b">${r.local ? '<b style="color:var(--amber)">Waiting to upload</b> · ' : ''}${esc(r.inspected_name || '')} · ${vals.length} readings${nok ? ` · <b style="color:var(--red)">${nok} NOT OK</b>` : ''}</span></span><span class="chev">${ic('chev', 22)}</span></button>`; }).join('')}</div>`
      : '<div class="empty"><b>No records yet</b>Submitted check lists appear here.</div>') + '</div>';
  } catch (e) { netErr(e); }
}
async function viewChecklistEntry(id) {
  $('#app').innerHTML = `${bar('Check list record', 'checklist')}<main class="scroll" id="ce"><div class="spin">Loading…</div></main>`;
  try {
    const tpl = await templates();
    const rows = id.startsWith('local:') ? obxEntries().filter(r => r.id === id) : await api(`checklist_entries?id=eq.${encodeURIComponent(id)}&select=*`);
    const r = rows[0]; const t = r && tpl.find(x => x.code === r.template_code);
    if (!r || !t) { $('#ce').innerHTML = '<div class="empty"><b>Record not found</b></div>'; return; }
    const V = r.vals || {};
    const cell = v => !v ? '<span style="color:var(--muted)">—</span>' : v === 'NOT OK' ? '<b style="color:var(--red)">NOT OK</b>' : v === 'OK' ? '<span style="color:var(--green);font-weight:700">OK</span>' : esc(v);
    $('#ce').innerHTML = `<div class="dayhead"><div class="k">${esc(t.name)}</div><div class="v">${fmtDay(fromYmd(r.check_date))} · Shift ${esc(r.shift || '-')}</div><div style="font-size:15px;margin-top:2px">${esc(r.inspected_name || '')} · ${fmtStamp(r.filled_at || r.created_at)}${r.local ? ' · waiting to upload' : ''}</div></div>
      <div style="padding:12px 16px 0" class="two"><button class="btn" id="esave">${ic('download')} Save Excel</button><button class="btn pri" id="eshare">${ic('share')} Share</button></div>
      <div style="padding:4px 12px 24px">${t.sections.map((s, si) => {
        const rowsH = s.items.map((it, ii) => { const fs = fieldsOf(s, it); const any = fs.some((f, fi) => V[`${si}.${ii}.${fi}`]);
          return `<tr${any ? '' : ' class="dim"'}><td>${esc(it.name)}</td>${fs.map((f, fi) => `<td class="v">${cell(V[`${si}.${ii}.${fi}`])}</td>`).join('')}</tr>`; }).join('');
        return `<h2 class="clsec">${esc(s.title)}</h2><div class="card" style="overflow-x:auto"><table class="rt"><thead><tr><th>Equipment</th>${(s.fields || [{ l: 'Value' }]).map(f => `<th>${esc(f.l)}</th>`).join('')}</tr></thead><tbody>${rowsH}</tbody></table></div>`; }).join('')}
      ${r.remarks ? `<h2 class="clsec">Remarks</h2><div class="card" style="padding:14px;font-size:17px;line-height:1.4">${esc(r.remarks)}</div>` : ''}</div>`;
    $('#esave').onclick = () => recordReport(t, r, false);
    $('#eshare').onclick = () => recordReport(t, r, true);
  } catch (e) { netErr(e); }
}

/* ================= SPARES ================= */
function viewSpares() {
  $('#app').innerHTML = `${bar('Spares', null, `<button class="ib" id="sxls" aria-label="Download spares Excel">${ic('download', 26)}</button><button class="ib" id="rbtn" aria-label="Refresh">${ic('refresh', 26)}</button>`)}
  <div class="searchwrap"><div class="search">${ic('search', 22)}<input id="sq" type="search" placeholder="Search item, model, make, location" value="${esc(S.spareQuery)}" aria-label="Search spares"></div></div>
  <div class="tabs" role="tablist" id="tabs"><button data-a="__low" class="${S.spareLow ? 'on' : ''}" style="${S.spareLow ? 'background:var(--red);border-color:var(--red)' : ''}">Out of stock</button>${SPARE_AREAS.map(a => `<button role="tab" data-a="${esc(a)}" class="${!S.spareLow && a === S.spareArea ? 'on' : ''}">${esc(a)}</button>`).join('')}</div>
  <main class="scroll" id="list" style="padding-bottom:90px"><div class="spin">Loading…</div></main>
  <button class="fab" data-go="spare/new">${ic('plus', 24)} Add spare</button>${nav('spares')}`;
  const on = $('#tabs .on'); if (on) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  $('#tabs').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; if (b.dataset.a === '__low') S.spareLow = !S.spareLow; else { S.spareLow = false; S.spareArea = b.dataset.a; } viewSpares(); };
  $('#rbtn').onclick = loadSpares;
  $('#sxls').onclick = async () => { if (!(await ask('Download spares Excel?', 'All categories, one sheet each, in your HSM Spares format.', 'Download'))) return;
    try { toast('Preparing Excel…', 8000); const rows = await api('spares?select=*&order=area,id'); deliver(await xl().sparesWorkbook(rows, SPARE_AREAS), `HSM Spares ${fmtShort(new Date())}.xlsx`, true); } catch (e) { netErr(e); } };
  let tm; $('#sq').oninput = e => { clearTimeout(tm); tm = setTimeout(() => { S.spareQuery = e.target.value.trim(); loadSpares(); }, 300); };
  loadSpares();
}
async function loadSpares() {
  const list = $('#list'); if (!list) return;
  const q = S.spareQuery.replace(/[,()*"]/g, ' ').trim(); const e = encodeURIComponent(q);
  let path = 'spares?select=id,area,material,model,make,description,qty,location,rack&order=material,id';
  if (q) path += `&or=(material.ilike.*${e}*,model.ilike.*${e}*,make.ilike.*${e}*,description.ilike.*${e}*,location.ilike.*${e}*,item_code.ilike.*${e}*)`;
  if (S.spareLow) path += '&qty=lte.0'; else if (!q) path += `&area=eq.${encodeURIComponent(S.spareArea)}`;
  try {
    const rows = await api(path);
    if (!rows.length) { list.innerHTML = `<div class="empty"><b>${q ? 'No match found' : S.spareLow ? 'Nothing out of stock' : 'No spares in this category yet'}</b>${q ? 'Try another word.' : S.spareLow ? '' : 'Tap “Add spare” to add one.'}</div>`; return; }
    list.innerHTML = `<div class="hint" style="padding:10px 16px 6px;font-weight:600">${rows.length} item${rows.length > 1 ? 's' : ''}${q ? ' · all categories' : ''}</div>` + rows.map(r => `<button class="item" data-go="spare/${r.id}">
      <span class="tx"><span class="n">${esc(r.material)}</span><span class="m">${esc([r.model, r.make].filter(Boolean).join(' · ') || r.description || '')}</span>
      <span class="loc">${ic('pin', 15)} ${esc(r.location || 'Location not set')}${r.rack ? ` · Rack ${esc(r.rack)}` : ''}${(q || S.spareLow) ? ` · ${esc(r.area)}` : ''}</span></span>
      <span class="qty ${r.qty <= 0 ? 'nil' : r.qty <= 2 ? 'low' : ''}"><b>${r.qty}</b><span>${r.qty <= 0 ? 'NIL' : 'QTY'}</span></span></button>`).join('');
  } catch (err) { list.innerHTML = '<div class="empty"><b>Could not load spares</b>Check network and tap refresh.</div>'; netErr(err); }
}
async function viewSpare(id) {
  const isNew = id === 'new';
  $('#app').innerHTML = `${bar(isNew ? 'Add Spare' : 'Update Spare', 'spares')}<main class="scroll" id="sd"><div class="spin">Loading…</div></main>`;
  let s = { area: S.spareArea, item_code: '', material: '', model: '', description: '', material_type: 'Spare', make: '', qty: 0, location: '', rack: '' }, log = [];
  if (!isNew) {
    try { const [r, l] = await Promise.all([api(`spares?id=eq.${encodeURIComponent(id)}&select=*`), api(`spare_log?spare_id=eq.${encodeURIComponent(id)}&select=*&order=created_at.desc&limit=6`)]);
      if (!r.length) { $('#sd').innerHTML = '<div class="empty"><b>Spare not found</b></div>'; return; } s = r[0]; log = l;
    } catch (e) { netErr(e); $('#sd').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  }
  const now = new Date(); let chg = 0;
  const opt = (list, v) => list.map(x => `<option ${x === v ? 'selected' : ''}>${esc(x)}</option>`).join('');
  $('#app').innerHTML = `${bar(isNew ? 'Add Spare' : 'Update Spare', 'spares')}
  ${isNew ? '' : `<div class="cur"><span class="k">Current stock</span><span class="v">${s.qty} Nos</span></div>`}
  <main class="scroll"><form class="f" id="sf">
    <div class="fld"><label for="f-area">Area</label><select id="f-area">${opt(SPARE_AREAS, s.area)}</select></div>
    <div class="fld"><label for="f-mat">Item</label><input id="f-mat" value="${esc(s.material)}" required></div>
    <div class="fld"><label for="f-model">Type / Model</label><input id="f-model" value="${esc(s.model || '')}"></div>
    <div class="fld"><label for="f-desc">Item description</label><textarea id="f-desc" rows="2">${esc(s.description || '')}</textarea></div>
    <div class="two"><div class="fld"><label for="f-make">Make (OEM)</label><input id="f-make" value="${esc(s.make || '')}"></div>
      <div class="fld"><label for="f-code">HSM Item Code</label><input id="f-code" value="${esc(s.item_code || '')}" autocapitalize="characters"></div></div>
    <div class="fld"><label for="f-qty">${isNew ? 'Opening quantity' : 'Update quantity'}</label>
      <div class="step"><button type="button" id="dec" aria-label="Decrease">${ic('minus', 28)}</button><input id="f-qty" inputmode="numeric" value="0"><button type="button" class="plus" id="inc" aria-label="Increase">${ic('plus', 28)}</button></div>
      <span class="hint" id="qhint">${isNew ? 'Stock you are adding now' : 'Minus = issued / used · Plus = received'}</span></div>
    <div class="two"><div class="fld"><label for="f-loc">Location</label><input id="f-loc" value="${esc(s.location || '')}" list="locs"></div>
      <div class="fld"><label for="f-rack">Rack No.</label><input id="f-rack" value="${esc(s.rack || '')}"></div></div>
    <datalist id="locs"><option>Basement Cupboard</option><option>FM TPS L1 Cupboard</option><option>Shift cupboard 1</option></datalist>
    <div class="fld"><label for="f-type">Material type</label><select id="f-type">${opt(['Spare','Consumable','Tool'], s.material_type || 'Spare')}</select></div>
    <div class="fld"><label for="f-rem">Remark (used for)</label><textarea id="f-rem" rows="2" placeholder="e.g. Replaced faulty module in F1 panel"></textarea></div>
    <div class="two"><div class="fld"><label>Updated by</label><input readonly value="${esc(ME.name)}"></div><div class="fld"><label>Date · time</label><input readonly value="${fmtShort(now)} ${pad2(now.getHours())}:${pad2(now.getMinutes())}"></div></div>
    ${log.length ? `<div><div class="label" style="margin-top:6px">Recent updates</div><div class="list">${log.map(h => `<div class="lrow"><span class="tag ${h.change < 0 ? 'red' : h.change > 0 ? 'green' : ''}">${h.change > 0 ? '+' : ''}${h.change}</span><span class="tx"><span class="a" style="font-size:15.5px">${esc(h.remark || (h.change ? 'Stock updated' : 'Details edited'))}</span><span class="b">→ ${h.qty_after} Nos · ${esc(h.updated_by || '')} · ${fmtStamp(h.created_at)}</span></span></div>`).join('')}</div></div>` : ''}
  </form></main>
  <div class="actions"><button class="btn ghost" type="button" id="cancel">Cancel</button><button class="btn pri" type="button" id="save">Save</button></div>`;
  const qi = $('#f-qty');
  const setQ = v => { chg = isNew ? Math.max(0, v) : Math.max(-s.qty, v); qi.value = (!isNew && chg > 0 ? '+' : '') + chg; if (!isNew) $('#qhint').textContent = chg ? `New stock will be ${s.qty + chg} Nos` : 'Minus = issued / used · Plus = received'; };
  $('#dec').onclick = () => setQ(chg - 1); $('#inc').onclick = () => setQ(chg + 1);
  qi.onchange = () => setQ(parseInt(qi.value.replace('+', ''), 10) || 0);
  $('#cancel').onclick = () => history.length > 1 ? history.back() : go('spares');
  $('#save').onclick = async () => {
    const v = id => $(id).value.trim() || null;
    const f = { area: $('#f-area').value, material: v('#f-mat'), model: v('#f-model'), description: v('#f-desc'), make: v('#f-make'), item_code: v('#f-code'),
      location: v('#f-loc'), rack: v('#f-rack'), material_type: $('#f-type').value };
    if (!f.material) { toast('Enter the item name'); $('#f-mat').focus(); return; }
    const remark = v('#f-rem'); const by = `${ME.name} (${ME.username})`;
    const btn = $('#save'); btn.disabled = true; btn.textContent = 'Saving…';
    try {
      let sid = s.id;
      if (isNew) { const [row] = await api('spares', { method: 'POST', body: { ...f, qty: 0, updated_by: by } }); sid = row.id; }
      await rpc('adjust_spare', { p_id: sid, p_change: chg, p_location: f.location, p_remark: remark || (isNew ? 'New spare added' : null), p_by: by,
        p_area: f.area, p_item_code: f.item_code, p_material: f.material, p_material_type: f.material_type, p_make: f.make, p_model: f.model, p_description: f.description, p_rack: f.rack });
      S.spareArea = f.area; S.spareLow = false; toast(isNew ? 'Spare added' : 'Saved');
      history.length > 1 ? history.back() : go('spares');
    } catch (e) { netErr(e); btn.disabled = false; btn.textContent = 'Save'; }
  };
}

/* ================= SOP & HIRAC ================= */
function viewSop() {
  $('#app').innerHTML = `${bar('SOP & HIRAC', 'home')}
    <div class="seg" id="sseg">${[['numbers','SOP No.'],['hirac','HIRAC'],['docs','Documents']].map(([k, l]) => `<button data-t="${k}" class="${S.sopTab === k ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div id="sbody" style="display:flex;flex-direction:column;flex:1;min-height:0"></div>`;
  $('#sseg').onclick = e => { const b = e.target.closest('[data-t]'); if (b) { S.sopTab = b.dataset.t; S.sopQuery = ''; viewSop(); } };
  ({ numbers: sopNumbers, hirac: hiracList, docs: sopDocs })[S.sopTab]();
}
const hiracNos = s => (String(s || '').match(/ELEC\/(\d+)/g) || []).map(x => +x.split('/')[1]);
async function sopNumbers() {
  const b = $('#sbody');
  b.innerHTML = `<div class="searchwrap" style="border-top:1px solid var(--line)"><div class="search">${ic('search', 22)}<input id="q" type="search" placeholder="Search SOP no., HIRAC no. or job" value="${esc(S.sopQuery)}" aria-label="Search SOP and HIRAC"></div></div>
    <div class="tabs" id="gt">${SOP_GROUPS.map(g => `<button data-g="${esc(g)}" class="${g === S.sopGroup ? 'on' : ''}">${esc(g)}</button>`).join('')}</div>
    <main class="scroll" id="sl"><div class="spin">Loading…</div></main>`;
  let rows = [], hir = [];
  try { [rows, hir] = await Promise.all([api('sop_hirac?select=area,sr_no,activity,sop_no,hirac_no&order=sr_no'), hiracData()]); }
  catch (e) { netErr(e); $('#sl').innerHTML = '<div class="empty"><b>Could not load</b></div>'; return; }
  const title = n => (hir.find(h => h.no === n) || {}).title;
  const draw = () => {
    const q = S.sopQuery.toLowerCase().replace(/\s+/g, ' ');
    const f = rows.filter(r => (S.sopGroup === 'All' || r.area === S.sopGroup) && (!q || [r.sr_no, r.sop_no, r.hirac_no, r.activity].some(v => (v || '').toLowerCase().includes(q))));
    $('#sl').innerHTML = `<div class="pad"><div class="label">${f.length} of ${rows.length} SOPs</div>` + (f.length ? `<div class="list">${f.map(r => { const hs = hiracNos(r.hirac_no);
      return `<div class="lrow" style="flex-direction:column;align-items:stretch;gap:0"><div style="display:flex;gap:10px;align-items:flex-start"><span class="tag soft">${esc(r.sr_no)}</span><span class="a" style="flex:1;font-size:17px;font-weight:600;line-height:1.3">${esc(r.activity)}</span><span class="tag">${esc(r.area)}</span></div>
        <div class="refbox"><span><span class="k">SOP NO.</span><span class="v">${esc(r.sop_no || '—')}</span></span>
        ${hs.length ? `<a class="v" style="display:flex;flex-direction:column;gap:2px;padding:8px 10px;background:var(--red-50);border-radius:10px;text-decoration:none" data-go="hirac/${hs[0]}"><span class="k" style="font-size:11.5px;font-weight:700;color:var(--red-700);letter-spacing:.6px">HIRAC NO. ›</span><span style="font-size:14.5px;font-weight:700;color:var(--red-700)">${hs.map(n => 'ELEC/' + pad2(n)).join(', ')}</span>${title(hs[0]) ? `<span style="font-size:13px;color:var(--ink-2)">${esc(title(hs[0]))}</span>` : ''}</a>`
          : `<span><span class="k">HIRAC NO.</span><span class="v" style="color:var(--muted)">Not applicable</span></span>`}</div></div>`; }).join('')}</div>` : '<div class="empty"><b>No match found</b>Try another number or word.</div>') + '</div>';
  };
  draw();
  let tm; $('#q').oninput = e => { clearTimeout(tm); tm = setTimeout(() => { S.sopQuery = e.target.value.trim(); draw(); }, 200); };
  $('#gt').onclick = e => { const g = e.target.closest('[data-g]'); if (!g) return; S.sopGroup = g.dataset.g; $$('#gt button').forEach(x => x.classList.toggle('on', x === g)); draw(); };
}
async function hiracList() {
  const b = $('#sbody');
  b.innerHTML = `<div class="searchwrap" style="border-top:1px solid var(--line)"><div class="search">${ic('search', 22)}<input id="q" type="search" placeholder="Search HIRAC no., job or hazard" value="${esc(S.sopQuery)}" aria-label="Search HIRAC"></div></div>
    <main class="scroll" id="hl"><div class="spin">Loading…</div></main>`;
  let H = []; try { H = await hiracData(); } catch (e) { netErr(e); return; }
  const draw = () => {
    const q = S.sopQuery.toLowerCase();
    const f = H.filter(h => !q || String(h.no) === q.replace(/^0+/, '') || [h.title, h.ref, ...(h.acts || []), ...(h.hz || []).map(z => z.h)].some(v => (v || '').toLowerCase().includes(q)));
    $('#hl').innerHTML = `<div class="pad"><div class="label">${f.length} of ${H.length} HIRACs</div>` + (f.length ? `<div class="list">${f.map(h => {
      const max = Math.max(0, ...(h.hz || []).map(z => z.rpn || 0));
      return `<button class="lrow" data-go="hirac/${h.no}"><span class="av" style="border-radius:12px">${h.no}</span><span class="tx"><span class="a">${esc(h.title)}</span><span class="b">${(h.hz || []).length} hazards · Rev ${esc(h.rev ?? '-')}${h.owner ? ' · ' + esc(h.owner) : ''}</span></span><span class="rpn ${max >= 10 ? 'h' : max >= 5 ? 'm' : ''}">RPN ${max}</span></button>`; }).join('')}</div>` : '<div class="empty"><b>No match found</b></div>') + '</div>';
  };
  draw();
  let tm; $('#q').oninput = e => { clearTimeout(tm); tm = setTimeout(() => { S.sopQuery = e.target.value.trim(); draw(); }, 200); };
}
async function viewHirac(no) {
  $('#app').innerHTML = `${bar(`HIRAC ${no}`, 'sop')}<main class="scroll" id="hd"><div class="spin">Loading…</div></main>`;
  let H; try { H = await hiracData(); } catch (e) { netErr(e); return; }
  const h = H.find(x => String(x.no) === String(no));
  if (!h) { $('#hd').innerHTML = '<div class="empty"><b>HIRAC not found</b></div>'; return; }
  const acts = h.acts && h.acts.length ? h.acts : [h.title];
  $('#hd').innerHTML = `<div class="dayhead"><div class="k">HIRAC ${h.no} · ${esc(h.ref || '')}</div><div class="v" style="font-size:22px;line-height:1.2">${esc(h.title)}</div></div>
    <div class="meta"><div><span class="k">Revision</span><span class="v">${esc(h.rev ?? '-')}</span></div><div><span class="k">Effective</span><span class="v">${h.eff ? fmtShort(fromYmd(h.eff)) : '-'}</span></div>
      <div><span class="k">Process owner</span><span class="v">${esc(h.owner || '-')}</span></div><div><span class="k">SOP ref.</span><span class="v" style="overflow-wrap:anywhere">${esc((h.sop || '-').replace(/^[,\s]+/, ''))}</span></div></div>
    <div style="padding:6px 12px 26px">${acts.map((a, ai) => { const hz = (h.hz || []).filter(z => (z.a || 0) === ai);
      return `<h2 class="clsec">${esc(a)}<span>${hz.length} hazard${hz.length === 1 ? '' : 's'}</span></h2>` + hz.map(z => `<div class="hz">
        <div class="h"><b>${esc(z.h)}</b><span class="rpn ${z.rpn >= 10 ? 'h' : z.rpn >= 5 ? 'm' : ''}">RPN ${z.rpn ?? '-'}</span></div>
        ${z.e ? `<div><div class="k">Possible injury</div><div class="c">${esc(z.e)}</div></div>` : ''}
        ${z.c ? `<div><div class="k">Control measures</div><div class="c">${esc(z.c)}</div></div>` : ''}
        ${z.g ? `<div><div class="k">Gaps</div><div class="c">${esc(z.g)}</div></div>` : ''}
        ${z.w ? `<div class="hint">Affected: ${esc(z.w)}</div>` : ''}</div>`).join(''); }).join('')}
      <p class="hint" style="text-align:center;margin-top:16px">From HSM Electrical HIRAC register</p></div>`;
}
async function sopDocs() {
  const b = $('#sbody');
  b.innerHTML = `<div class="tabs" id="dt" style="border-top:1px solid var(--line)">${DOC_AREAS.map(a => `<button data-a="${a}" class="${a === S.docArea ? 'on' : ''}">${a}</button>`).join('')}</div>
    <main class="scroll" id="dl" style="padding-bottom:90px"><div class="spin">Loading…</div></main>
    <label class="fab" style="cursor:pointer;bottom:24px">${ic('upload', 22)} Add document<input type="file" id="up" hidden accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"></label>`;
  $('#dt').onclick = e => { const x = e.target.closest('[data-a]'); if (!x) return; S.docArea = x.dataset.a; sopDocs(); };
  $('#up').onchange = async e => {
    const file = e.target.files[0]; if (!file) return;
    if (file.size > 50 * 1024 * 1024) return toast('File is larger than 50 MB');
    if (!(await ask(`Upload to ${S.docArea}?`, file.name, 'Upload'))) return;
    toast('Uploading…', 20000);
    try { await storageUpload(`${S.docArea}/${file.name.replace(/[\\/#?%]/g, '_')}`, file); toast('Document uploaded'); sopDocs(); }
    catch (err) { netErr(err); }
  };
  try {
    const items = (await storageList(`${S.docArea}/`)).filter(o => o.id && o.name !== '.emptyFolderPlaceholder');
    const typ = n => (n.split('.').pop() || '').toUpperCase().slice(0, 4);
    const size = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
    $('#dl').innerHTML = items.length ? `<div class="pad"><div class="label">${items.length} document${items.length > 1 ? 's' : ''} · ${esc(S.docArea)}</div><div class="list">${items.map(o => `<button class="lrow" data-p="${esc(S.docArea + '/' + o.name)}">
        <span class="ic" style="font-size:12px;font-weight:800">${esc(typ(o.name))}</span><span class="tx"><span class="a" style="font-size:16px">${esc(o.name.replace(/\.[^.]+$/, ''))}</span><span class="b">${o.metadata ? size(o.metadata.size) : ''}${o.updated_at ? ' · ' + fmtShort(new Date(o.updated_at)) : ''}</span></span><span class="chev">${ic('chev', 22)}</span></button>`).join('')}</div></div>`
      : `<div class="empty"><b>No documents in ${esc(S.docArea)} yet</b>Tap “Add document” to upload a SOP (PDF, Word, photo).</div>`;
    $('#dl').onclick = async e => { const r = e.target.closest('[data-p]'); if (!r) return;
      try { await openDoc(r.dataset.p, SOP_BUCKET); } catch (err) { netErr(err); } };
  } catch (e) { $('#dl').innerHTML = '<div class="empty"><b>Could not load documents</b></div>'; netErr(e); }
}

/* ================= SOP's OF MILL PROCESS ================= */
async function viewMillProcessSops() {
  const admin = !!ME.is_admin;
  $('#app').innerHTML = `${bar('SOP\'s of Mill Process', 'home')}<main class="scroll" id="ml" style="${admin ? 'padding-bottom:90px' : ''}"><div class="spin">Loading…</div></main>
    ${admin ? `<label class="fab" style="cursor:pointer;bottom:88px">${ic('upload', 22)} Add SOP<input type="file" id="mup" hidden accept=".docx,.pdf"></label>` : ''}${nav('mill')}`;
  const size = n => n > 1048576 ? (n / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB';
  if (!MILL_AREAS.some(a => a[0] === S.millArea)) S.millArea = 'CB';
  const label = f => (MILL_AREAS.find(a => a[0] === f) || [f, f])[1];
  const draw = async () => {
    const btns = `<div class="label">Select area</div>
      <div class="grid" style="grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:20px">${MILL_AREAS.map(([f, t]) => `<button class="card" data-area="${f}" style="padding:12px;text-align:center;font-weight:700;border:2px solid ${S.millArea === f ? 'var(--red, #C8102E)' : 'transparent'};border-radius:10px">${esc(t)}</button>`).join('')}</div>`;
    $('#ml').innerHTML = `<div class="pad">${btns}<div class="spin">Loading…</div></div>`;
    let items = [];
    try { items = (await storageList(`${S.millArea}/`, MILL_PROCESS_BUCKET)).filter(o => o.id && o.name && /\.(docx?|pdf)$/i.test(o.name)); }
    catch (e) { $('#ml').innerHTML = `<div class="pad">${btns}<div class="empty"><b>Could not load procedures</b>Check the network and try again.</div></div>`; netErr(e); return; }
    const typ = n => (n.split('.').pop() || '').toUpperCase().slice(0, 4);
    const row = o => `<button class="lrow" data-f="${esc(S.millArea + '/' + o.name)}" style="${admin ? 'flex:1;min-width:0' : ''}">
        <span class="ic" style="font-size:12px;font-weight:800">${esc(typ(o.name))}</span><span class="tx"><span class="a" style="font-size:16px">${esc(o.name.replace(/\.[^.]+$/, ''))}</span><span class="b">${o.metadata ? size(o.metadata.size) : ''}${o.updated_at ? ' · ' + fmtShort(new Date(o.updated_at)) : ''}</span></span>${admin ? '' : `<span class="chev">${ic('chev', 22)}</span>`}</button>`;
    $('#ml').innerHTML = `<div class="pad">${btns}
      <div class="label">${items.length} procedure${items.length === 1 ? '' : 's'} · ${esc(label(S.millArea))}</div>
      <div class="list">${items.length ? items.map(o => admin ? `<div style="display:flex;align-items:center">${row(o)}<button class="ib" data-del="${esc(S.millArea + '/' + o.name)}" aria-label="Delete ${esc(o.name)}" style="color:var(--ink-2);margin-right:6px">${ic('x', 22)}</button></div>` : row(o)).join('')
        : `<div class="empty"><b>No SOPs in ${esc(label(S.millArea))} yet</b>${admin ? 'Tap “Add SOP” to upload a Word or PDF file.' : ''}</div>`}</div></div>`;
  };
  $('#ml').onclick = async e => {
    const area = e.target.closest('[data-area]'); if (area) { S.millArea = area.dataset.area; draw(); return; }
    const d = e.target.closest('[data-del]');
    if (d) { const name = d.dataset.del.split('/').pop();
      if (!(await ask('Delete this SOP?', `${name}\nIt is removed for everyone.`, 'Delete', 'Cancel', true))) return;
      try { await storageDelete(d.dataset.del, MILL_PROCESS_BUCKET); toast('SOP deleted'); draw(); } catch (err) { netErr(err); } return; }
    const r = e.target.closest('[data-f]'); if (!r) return;
    try { await openDoc(r.dataset.f, MILL_PROCESS_BUCKET); } catch (err) { netErr(err); } };
  if ($('#mup')) $('#mup').onchange = async e => {
    const file = e.target.files[0]; e.target.value = ''; if (!file) return;
    if (!/\.(docx|pdf)$/i.test(file.name)) return toast('Choose a Word (.docx) or PDF file');
    if (file.size > 50 * 1024 * 1024) return toast('File is larger than 50 MB');
    const path = `${S.millArea}/${file.name.replace(/[\\/#?%]/g, '_')}`;
    if (!(await ask(`Add to ${label(S.millArea)}?`, file.name, 'Upload'))) return;
    toast('Uploading…', 60000);
    try { await storageUpload(path, file, MILL_PROCESS_BUCKET); toast('SOP added'); draw(); }
    catch (err) {
      if (err.exists && await ask('Replace the existing SOP?', `${file.name} is already in ${label(S.millArea)}.`, 'Replace')) {
        try { toast('Uploading…', 60000); await storageUpload(path, file, MILL_PROCESS_BUCKET, true); toast('SOP replaced'); draw(); } catch (e2) { netErr(e2); }
      } else if (!err.exists) netErr(err); else toast('Not uploaded');
    }
  };
  draw();
}

/* ================= ADMIN UPLOADS (Excel → cloud) ================= */
const xv = v => { if (v == null) return null; if (v instanceof Date) return v; if (typeof v === 'object') { if ('result' in v) return xv(v.result); if (v.richText) return v.richText.map(t => t.text).join(''); if ('text' in v) return v.text; if ('error' in v) return null; } return v; };
const xt = v => { v = xv(v); return v == null || v instanceof Date ? '' : String(v).replace(/ /g, ' ').replace(/\s+/g, ' ').trim(); };
const cleanName = n => String(n || '').replace(/ /g, ' ').trim().replace(/^(mr|mrs|ms|miss)\.?\s+/i, '').replace(/\s+/g, ' ').trim()
  .split(' ').map(w => /^[A-Z]\.$/i.test(w) ? w.toUpperCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
const cleanArea = a => { a = String(a || '').trim(); if (!a) return ''; return a.length <= 3 || /\d/.test(a) ? a.toUpperCase() : a.charAt(0).toUpperCase() + a.slice(1).toLowerCase(); };
async function readBook(file) { const wb = new ExcelJS.Workbook(); await wb.xlsx.load(await file.arrayBuffer()); return wb; }
function parseRoster(ws) {
  let hr = 0; for (let i = 1; i <= Math.min(ws.rowCount, 15) && !hr; i++) ws.getRow(i).eachCell(c => { if (xt(c.value).toUpperCase() === 'NAME') hr = i; });
  if (!hr) return null;
  const cols = { days: {} };
  ws.getRow(hr).eachCell((c, ci) => { const v = xv(c.value), t = xt(c.value).toUpperCase();
    if (typeof v === 'number' && Number.isInteger(v) && v >= 1 && v <= 31) cols.days[ci] = v;
    else if (t === 'NAME') cols.name = ci; else if (t.startsWith('SAP')) cols.sap = ci; else if (t === 'AREA') cols.area = ci; else if (t.startsWith('RANK')) cols.rank = ci; });
  if (!cols.name || Object.keys(cols.days).length < 28) return null;
  let month = null; for (let i = 1; i <= hr && !month; i++) ws.getRow(i).eachCell(c => { const v = xv(c.value); if (!month && v instanceof Date) month = v; });
  const people = [], bad = {};
  for (let i = hr + 1; i <= ws.rowCount; i++) {
    const row = ws.getRow(i), name = cleanName(xt(row.getCell(cols.name).value)); if (!name || /^\d+$/.test(name) || /^(name|sr\.? ?no)$/i.test(name)) continue;
    const shifts = {};
    for (const [ci, d] of Object.entries(cols.days)) { let sh = xt(row.getCell(+ci).value).toUpperCase(); if (!sh) continue;
      if (/^(MON|TUE|WED|THU|FRI|SAT|SUN)/.test(sh)) continue; if (sh === 'O' || sh === 'OFF') sh = 'WO'; if (!['A', 'B', 'C', 'G', 'L', 'WO'].includes(sh)) { bad[sh] = (bad[sh] || 0) + 1; continue; } shifts[d] = sh; }
    if (!Object.keys(shifts).length) continue;
    people.push({ name, sap_id: cols.sap ? xt(row.getCell(cols.sap).value).replace(/\.0$/, '') : '', area: cols.area ? cleanArea(xt(row.getCell(cols.area).value)) : '',
      ranking: cols.rank ? (parseInt(xt(row.getCell(cols.rank).value), 10) || null) : null, shifts });
  }
  return people.length ? { people, month, bad, maxDay: Math.max(...Object.values(cols.days)) } : null;
}
function parseTeam(ws) {
  let hr = 0, cols = {};
  for (let i = 1; i <= Math.min(ws.rowCount, 10) && !hr; i++) { const m = {};
    ws.getRow(i).eachCell((c, ci) => { const t = xt(c.value).toLowerCase().replace(/[^a-z]/g, '');
      if (t === 'fullname' || (t === 'name' && !m.name)) m.name = ci; else if (t.startsWith('sap')) m.sap = ci; else if (t === 'plant') m.plant = ci;
      else if (t === 'role' || t === 'company') m.company = ci; else if (t.includes('mobile') || t === 'phone') m.mobile = ci; else if (t.includes('email')) m.email = ci; });
    if (m.name && (m.mobile || m.email || m.sap)) { hr = i; cols = m; } }
  if (!hr) return null;
  const rows = [];
  for (let i = hr + 1; i <= ws.rowCount; i++) { const r = ws.getRow(i), g = k => cols[k] ? xt(r.getCell(cols[k]).value) : '';
    const name = cleanName(g('name')); if (!name) continue; const sap = g('sap').replace(/\.0$/, '');
    rows.push({ name, sap_id: /^n\/?a$/i.test(sap) ? '' : sap, plant: g('plant').toUpperCase(), company: g('company'), mobile: g('mobile').replace(/\.0$/, ''), email: g('email').replace(/,/g, '.') }); }
  return rows.length ? rows : null;
}
function viewAdmin() {
  if (!ME.is_admin) return go('home');
  $('#app').innerHTML = `${bar('Admin uploads', 'profile')}<main class="scroll"><div class="pad">
    <div class="card" style="padding:16px;margin-bottom:14px"><div style="display:flex;gap:12px;align-items:center"><span class="ic">${ic('cal', 24)}</span><div><div style="font-size:18px;font-weight:700">Shift schedule</div><div class="hint">Monthly Excel (NAME, SAP ID, day columns 1–31, Area, Ranking). Replaces that month for everyone.</div></div></div>
      <label class="btn block" style="margin-top:12px;cursor:pointer">${ic('upload')} Choose Excel file<input type="file" id="xr" hidden accept=".xlsx"></label></div>
    <div class="card" style="padding:16px;margin-bottom:14px"><div style="display:flex;gap:12px;align-items:center"><span class="ic">${ic('users', 24)}</span><div><div style="font-size:18px;font-weight:700">Team list</div><div class="hint">Team Members Excel (Full Name, SAP ID, Role, Mobile, Email, Plant). Replaces the whole Team list.</div></div></div>
      <label class="btn block" style="margin-top:12px;cursor:pointer">${ic('upload')} Choose Excel file<input type="file" id="xtm" hidden accept=".xlsx"></label></div>
    <div class="card" style="padding:16px"><div style="display:flex;gap:12px;align-items:center"><span class="ic">${ic('doc', 24)}</span><div><div style="font-size:18px;font-weight:700">SOP's of Mill Process</div><div class="hint">Open an area and tap “Add SOP” (Word or PDF). Tap ✕ next to a SOP to delete it.</div></div></div>
      <button class="btn block" data-go="mill" style="margin-top:12px">${ic('chev')} Open SOP's of Mill Process</button></div>
    <div id="xprev"></div><div style="height:30px"></div></div></main>`;
  const prev = $('#xprev');
  $('#xr').onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    let wb; try { toast('Reading Excel…'); wb = await readBook(f); } catch (err) { return toast('Could not read this Excel file'); }
    const sheets = wb.worksheets.map(ws => ({ ws, r: parseRoster(ws) })).filter(x => x.r);
    if (!sheets.length) return toast('No shift schedule found. The sheet needs a NAME column and day columns 1–31.');
    const show = k => {
      const { ws, r } = sheets[k];
      const m = r.month || new Date(); const mv = `${m.getUTCFullYear()}-${String(m.getUTCMonth() + 1).padStart(2, '0')}`;
      prev.innerHTML = `<div class="card" style="padding:16px;margin-top:16px;border:2px solid var(--red)"><div class="label" style="margin:0 0 10px">Check before uploading</div>
        ${sheets.length > 1 ? `<div class="fld" style="margin-bottom:10px"><label for="xsh">Sheet</label><select id="xsh">${sheets.map((x, i) => `<option value="${i}" ${i === k ? 'selected' : ''}>${esc(x.ws.name)}</option>`).join('')}</select></div>` : ''}
        <div class="fld" style="margin-bottom:10px"><label for="xmo">Month</label><input type="month" id="xmo" value="${mv}"></div>
        <div id="xsum"></div>
        <div class="two" style="margin-top:12px"><button class="btn ghost" id="xno">Cancel</button><button class="btn pri" id="xgo">${ic('upload')} Upload</button></div></div>`;
      const sum = () => { const [y, mo] = $('#xmo').value.split('-').map(Number); const dim = new Date(y, mo, 0).getDate();
        const rows = []; r.people.forEach(p => Object.entries(p.shifts).forEach(([d, sh]) => { if (+d <= dim) rows.push({ day: `${y}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`, name: p.name, sap_id: p.sap_id, shift: sh, area: p.area, ranking: p.ranking }); }));
        const c = rows.filter(x => x.day.endsWith('-01')).reduce((a, x) => (a[x.shift] = (a[x.shift] || 0) + 1, a), {});
        const warn = [r.maxDay < dim ? `Only days 1–${r.maxDay} are in the sheet; ${r.maxDay + 1 === dim ? `day ${dim}` : `days ${r.maxDay + 1}–${dim}`} will be empty.` : '',
          Object.keys(r.bad).length ? `Skipped unknown codes: ${Object.entries(r.bad).map(([k2, n]) => `${esc(k2)} ×${n}`).join(', ')}` : '',
          r.people.some(p => !p.sap_id) ? `${r.people.filter(p => !p.sap_id).length} people have no SAP ID.` : ''].filter(Boolean);
        $('#xsum').innerHTML = `<div style="font-size:16px"><b>${r.people.length} people</b> · ${rows.length} shift entries · ${MONTHS[mo - 1]} ${y}</div>
          <div class="hint" style="margin-top:4px">Day 1: ${['A', 'B', 'C', 'G', 'L', 'WO'].map(k2 => `${k2} ${c[k2] || 0}`).join(' · ')}</div>
          ${warn.map(w => `<div class="hint" style="color:var(--amber);margin-top:6px">⚠ ${w}</div>`).join('')}`;
        return { rows, month: `${y}-${String(mo).padStart(2, '0')}-01`, label: `${MONTHS[mo - 1]} ${y}` }; };
      sum();
      $('#xmo').onchange = sum; if ($('#xsh')) $('#xsh').onchange = e2 => show(+e2.target.value);
      $('#xno').onclick = () => { prev.innerHTML = ''; };
      $('#xgo').onclick = async () => { const d = sum();
        if (!(await ask(`Replace the ${d.label} schedule?`, `${d.rows.length} entries from “${ws.name}”. Everyone sees the new schedule at once.`, 'Upload'))) return;
        $('#xgo').disabled = true;
        try { const n = await rpc('hsm_upload_roster', { p_month: d.month, p_rows: d.rows }); toast(`${d.label} schedule uploaded (${n} entries)`); prev.innerHTML = ''; }
        catch (err) { netErr(err); $('#xgo').disabled = false; } };
      prev.scrollIntoView({ behavior: 'smooth' });
    };
    show(0);
  };
  $('#xtm').onchange = async e => {
    const f = e.target.files[0]; e.target.value = ''; if (!f) return;
    let wb; try { toast('Reading Excel…'); wb = await readBook(f); } catch (err) { return toast('Could not read this Excel file'); }
    const hit = wb.worksheets.map(ws => ({ ws, rows: parseTeam(ws) })).find(x => x.rows);
    if (!hit) return toast('No team list found. The sheet needs a Full Name column with Mobile, Email or SAP ID.');
    const rows = hit.rows;
    prev.innerHTML = `<div class="card" style="padding:16px;margin-top:16px;border:2px solid var(--red)"><div class="label" style="margin:0 0 10px">Check before uploading</div>
      <div style="font-size:16px"><b>${rows.length} members</b> from sheet “${esc(hit.ws.name)}”</div>
      <div class="hint" style="margin-top:4px">${rows.filter(r => r.sap_id).length} with SAP ID · ${rows.filter(r => r.mobile).length} with mobile · ${rows.filter(r => r.email).length} with e-mail</div>
      <div class="hint" style="margin-top:4px">First: ${rows.slice(0, 3).map(r => esc(r.name)).join(', ')}…</div>
      <div class="hint" style="margin-top:6px">Area comes from the latest shift schedule (matched by SAP ID).</div>
      <div class="two" style="margin-top:12px"><button class="btn ghost" id="xno">Cancel</button><button class="btn pri" id="xgo">${ic('upload')} Upload</button></div></div>`;
    $('#xno').onclick = () => { prev.innerHTML = ''; };
    $('#xgo').onclick = async () => {
      if (!(await ask('Replace the Team list?', `${rows.length} members. Everyone sees the new list at once.`, 'Upload'))) return;
      $('#xgo').disabled = true;
      try { const n = await rpc('hsm_upload_team', { p_rows: rows }); TEAM = null; toast(`Team list uploaded (${n} members)`); prev.innerHTML = ''; }
      catch (err) { netErr(err); $('#xgo').disabled = false; } };
    prev.scrollIntoView({ behavior: 'smooth' });
  };
}

/* ================= TEAM ================= */
async function viewTeam() {
  $('#app').innerHTML = `${bar('Team', 'home')}
  <div class="searchwrap"><div class="search">${ic('search', 22)}<input id="tq" type="search" placeholder="Search name, area, SAP ID, mobile" aria-label="Search team" value="${esc(S.teamQuery)}"></div></div>
  <main class="scroll" id="tl"><div class="spin">Loading…</div></main>`;
  let rows = [], today = [];
  let pics = [];
  try { [rows, today, pics] = await Promise.all([team(), can('schedule') ? api(`shift_roster?select=name,shift&day=eq.${ymd(new Date())}`) : [], avatars()]); } catch (e) { netErr(e); }
  const photoOf = r => ((r.sap_id && pics.find(p => p.sap_id === r.sap_id)) || pics.find(p => sameName(p.full_name, r.name)) || {}).avatar_url;
  const shiftOf = n => (today.find(r => r.name === n) || today.find(r => sameName(r.name, n)) || {}).shift;
  const tagOf = s => !s ? '' : s === 'WO' ? '<span class="tag">Off</span>' : s === 'L' ? '<span class="tag amber">Leave</span>' : s === 'G' ? '<span class="tag">G</span>' : `<span class="tag red">${s}</span>`;
  const link = (href, icon, txt) => `<a href="${href}" style="display:inline-flex;align-items:center;gap:6px;margin:4px 14px 0 0;color:var(--red, #C8102E);font-weight:600;text-decoration:none">${ic(icon, 18)}${esc(txt)}</a>`;
  const draw = () => {
    const q = S.teamQuery.toLowerCase();
    const f = rows.filter(r => !q || [r.name, r.area, r.company, r.mobile, r.sap_id, r.email].some(v => (v || '').toLowerCase().includes(q)));
    $('#tl').innerHTML = `<div class="pad"><div class="label">${f.length} members · today's shift shown</div><div class="list">` + f.map(r => {
      const sub = [r.area === 'Shift' ? 'Shift crew' : r.area, r.company, r.plant].filter(Boolean).join(' · ') || 'E&A';
      const det = [r.sap_id ? `<span class="hint" style="margin-top:4px">SAP ID: <b style="color:var(--ink)">${esc(r.sap_id)}</b></span>` : '',
        r.mobile ? link('tel:' + r.mobile.replace(/[^0-9+]/g, ''), 'phone', r.mobile) : '',
        r.email ? link('mailto:' + r.email, 'mail', r.email) : ''].filter(Boolean).join('');
      return `<div class="lrow" style="flex-wrap:wrap;align-items:flex-start">${avHtml(photoOf(r), r.name)}<span class="tx"><span class="a">${esc(r.name)}</span><span class="b">${esc(sub)}</span>${det ? `<span style="display:flex;flex-direction:column;align-items:flex-start;margin-top:2px;overflow-wrap:anywhere">${det}</span>` : ''}</span>${tagOf(shiftOf(r.name))}</div>`;
    }).join('') + '</div></div>';
  };
  draw();
  $('#tq').oninput = e => { S.teamQuery = e.target.value.trim(); draw(); };
}

/* ================= START ================= */
render();
