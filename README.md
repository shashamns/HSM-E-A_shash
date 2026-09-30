# HSM E&A App (v2.5)

One source, two apps:
- **Android**: APK built automatically by GitHub.
- **iPhone (and Android without APK)**: web app published automatically on GitHub Pages; add it to the Home Screen from Safari.

App source: `app/src/main/assets/www/` (app.js, app.css, index.html…). Edit only here.

## How it builds (no npm, no Cordova, nothing to install on the PC)
Every push to `main` runs `.github/workflows/build.yml`, which:
1. Builds the Android APK and puts it at
   `https://github.com/<USER>/<REPO>/releases/latest/download/HSM-EA-App.apk`
2. Builds the iPhone web app (`scripts/build-site.sh`) and publishes it at
   `https://<USER>.github.io/<REPO>/`
3. Publishes a QR download page at `https://<USER>.github.io/<REPO>/download.html`

## One-time GitHub setup
1. Create an empty repo on github.com (e.g. `hsm-e-a`), no README.
2. Upload this folder (GitHub Desktop, or "Add file → Upload files", or `git push`).
3. Repo **Settings → Pages → Source: GitHub Actions**.
4. Open the **Actions** tab and wait for the green tick (~5 min). Done.

## Releasing a new version
Change files in `app/src/main/assets/www/`, add 1 to the number in `BUILD_NUMBER`
(and `versionCode` in `app/build.gradle`), push. GitHub rebuilds both apps.

## Features
Shift schedule (Excel templates in `xl/`), check lists, spares, SOP & HIRAC,
SOP's of Mill Process with area selection (CB, DC, FM, LEVEL1, RHF, RM) from Supabase Storage.
