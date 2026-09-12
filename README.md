# Lin's EDC Calculator — v1.3.4
by Weiping Lin, D.O., FACOG, FACOOG

Installable, offline-capable web app (PWA) for pregnancy dating: LMP, reported EDC,
ultrasound (GA or CRL), IVF, ACOG Committee Opinion No. 700 redating advice, prenatal
timeline, GA on any date, and a copy-for-chart line. No server, no data leaves the device.

## Deploy to Netlify (first time)
1. Unzip this folder.
2. Go to https://app.netlify.com/drop and drag this zip file (or the unzipped `lins-edc` folder) onto the page.
3. Rename the site under Site configuration → Change site name (e.g. `lins-edc`).
4. Open the link on a phone and install it (see below). Share the link.

## Publish an update
1. Edit the files.
2. Raise the version in both places:
   - `sw.js` → `const VERSION = "1.3";`
   - `index.html` → `const VERSION="v1.3";` (and the build date in the About panel)
3. Netlify → your site → Deploys → drag the updated folder onto the deploy area.

Installed copies check for updates on open and hourly, then show
"A new version is ready — Reload". Keep the same Netlify address.

## Install
- iPhone/iPad: open in Safari → Share → Add to Home Screen.
- Android: Chrome → Install app.
- Computer: Chrome/Edge → install icon in the address bar.

## License
© 2026 Weiping Lin, D.O., FACOG, FACOOG. Licensed CC BY 4.0 (attribution required). See `LICENSE.md`.

## Files
- `index.html` — the app
- `manifest.json` — name, icons, colors
- `sw.js` — offline cache and self-update
- `LICENSE.md` — license terms
- `icons/` — app icon (all sizes), Dr. Lin avatar (header), and photo (About panel)

## Source
Redating thresholds and IVF dating: ACOG Committee Opinion No. 700, Methods for Estimating
the Due Date, May 2017 (with AIUM and SMFM). Obstet Gynecol 2017;129(5):e150–e154.
