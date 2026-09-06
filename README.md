# Benchy website

Official Benchy website for `benchy-app.com`, built as a static Vite multi-page site.

## Development

```bash
npm install
npm run dev
```

## Production

```bash
npm run build
npm run preview
```

The build output is `dist/`. It contains the generated HTML routes, compiled Tailwind CSS, bundled JavaScript, public screenshots, `version.json`, and `CNAME`.

## Routes

- `/` homepage
- `/download/` Windows download page
- `/changelog/` update page
- `/premium/` Premium page
- `/plus/` compatibility route for Benchy+
- `/checkout/` PayPal-ready checkout state
- `/legal/` legal information

## Assets

Real assets are copied into `public/assets/` with clean public names:

- `images/benchy-logo.png`
- `screenshots/benchy-games.png`
- `screenshots/benchy-hardware.png`
- `screenshots/benchy-compare.png`
- `icons/windows.svg`

The original supplied files remain under `assets/images/`.

## Releases

`version.json` is the source of truth for the displayed version, notes, and installer URL. Set `downloadUrl` to the direct GitHub Release asset when the Windows installer is published. Until then, buttons remain styled but show `Téléchargement bientôt disponible`.

## GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` runs `npm ci`, `npm run build`, uploads `dist/`, and deploys GitHub Pages. The custom domain is preserved through `public/CNAME`.

## Premium and PayPal

Premium pricing remains unavailable until configured. PayPal secrets belong only in the Cloudflare Worker environment. Never add server credentials to `config.js`, `public/`, or frontend source.
