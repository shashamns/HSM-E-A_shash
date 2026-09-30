/* HSM E&A – start-up loader with automatic app updates.
 * Runs the newest app version: the one bundled in the APK, or a newer one downloaded from the cloud.
 * New versions are downloaded in the background and used from the next start (or at once via the banner). */
(function () {
  'use strict';
  var BUILT = Number('__BUILD__') || 0;             // version bundled in this APK (set by the build)
  var URL = 'https://jqxabsioebndhslyagxc.supabase.co/rest/v1/rpc/';
  var KEY = 'sb_publishable_iemA7-rKgs1VdZSH9hd2Kw__8458frU';
  var SLOT = 'hsm_bundle';

  function cached() { try { var b = JSON.parse(localStorage.getItem(SLOT) || 'null'); return b && b.version > BUILT && b.js && b.css ? b : null; } catch (e) { return null; } }
  function inline(b) {
    var st = document.createElement('style'); st.textContent = b.css; document.head.appendChild(st);
    var sc = document.createElement('script'); sc.text = b.js; document.body.appendChild(sc);
  }
  function bundled() {
    var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'app.css'; document.head.appendChild(l);
    ['xlreport.js', 'app.js'].forEach(function (f) { var s = document.createElement('script'); s.src = f; s.async = false; document.body.appendChild(s); });
  }
  function rpc(fn, body) {
    return fetch(URL + fn, { method: 'POST', headers: { apikey: KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  function banner() {
    if (document.getElementById('upd')) return;
    var b = document.createElement('button');
    b.id = 'upd'; b.type = 'button'; b.textContent = 'App updated – tap to restart';
    b.style.cssText = 'position:fixed;left:50%;top:calc(10px + env(safe-area-inset-top));transform:translateX(-50%);z-index:70;padding:12px 18px;border:0;border-radius:24px;background:#17803A;color:#fff;font:700 15px Barlow,system-ui,sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.25)';
    b.onclick = function () { location.reload(); };
    document.body.appendChild(b);
  }

  var cur = cached();
  var running = cur ? cur.version : BUILT;
  window.HSM_APP_VERSION = running;
  try { if (cur) inline(cur); else bundled(); } catch (e) { try { localStorage.removeItem(SLOT); } catch (x) {} bundled(); }

  // look for a newer version in the background
  setTimeout(function () {
    rpc('hsm_bundle_version').then(function (v) {
      if (!v || v <= running) return;
      return rpc('hsm_bundle_get', { p_version: v }).then(function (b) {
        if (!b || !b.js || !b.css || b.version !== v) return;
        try { localStorage.setItem(SLOT, JSON.stringify(b)); banner(); } catch (e) {}
      });
    }).catch(function () {});
  }, 1500);
})();
