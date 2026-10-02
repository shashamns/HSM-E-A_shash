#!/usr/bin/env bash
# Builds the iPhone/Android web app (site/) from the app source.
# Usage: scripts/build-site.sh [build-number]
set -euo pipefail
cd "$(dirname "$0")/.."
BUILD="${1:-$(cat BUILD_NUMBER)}"
SRC=app/src/main/assets/www
rm -rf site && mkdir -p site
cp -r "$SRC"/. site/
cp web/manifest.webmanifest web/sw.js site/
cp -r web/icons site/
cp web/qr-download.html site/download.html
touch site/.nojekyll
sed -i "s/__BUILD__/$BUILD/" site/boot.js
sed -i "s/const CACHE = '[^']*'/const CACHE = 'hsm-ea-$BUILD'/" site/sw.js
# add home-screen (PWA) tags to the page
python3 - <<'PY'
p='site/index.html'; h=open(p,encoding='utf-8').read()
head='''<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="HSM E&amp;A">
<meta name="robots" content="noindex, nofollow">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<link rel="icon" type="image/png" href="icons/icon-192.png">
'''
sw="<script>if ('serviceWorker' in navigator) window.addEventListener('load', function () { navigator.serviceWorker.register('sw.js').catch(function () {}); });</script>\n"
h=h.replace('</head>', head+'</head>',1).replace('</body>', sw+'</body>',1)
open(p,'w',encoding='utf-8').write(h)
PY
echo "site/ built (build $BUILD)"
