## Multi-folder Landing Pages

Reusable HTML5 + Tailwind landing pages for every product folder in this repo. Metadata lives in `data/products.json` and a lightweight TypeScript generator hydrates the shared template under `templates/landing.html`.

### Project structure

- `data/products.json` – product metadata (title, summary, stats, CTAs, themes).
- `templates/landing.html` – shared HTML5 shell with placeholder tokens.
- `scripts/build-landing-pages.ts` – reads data + template and writes `dist/<product>/index.html`.
- `src/styles.css` – Tailwind entry (base, components, utilities) plus custom tokens.
- `dist/` – compiled Tailwind CSS and generated landing pages (gitignored).

### Getting started

```bash
npm install
npm run build        # clean + compile Tailwind + emit /dist pages
npm run dev          # regenerate HTML on metadata/template changes
```

During development, run `npm run build:css -- --watch` in a separate terminal if you need Tailwind to rebuild continuously.

### Adding a new landing page

1. Duplicate a product block inside `data/products.json`.
2. Update the `id`, `title`, `folderPath`, copy, stats, features, testimonials, and CTA links.
3. Choose a gradient from the safelisted palette (`from-... via-... to-...`) and accent text color.
4. `npm run build` to regenerate `dist/<id>/index.html`.

The generator automatically updates navigation links so every page can jump between sibling products.

### Deployment

`npm run build` is wired into `.github/workflows/pages.yml`. On every push to `main`, GitHub Actions:

1. Checks out the repo.
2. Installs dependencies with `npm ci`.
3. Builds Tailwind + HTML into `dist/`.
4. Publishes `dist/` to GitHub Pages with `actions/deploy-pages`.

Once merged to `main`, visit the Pages URL shown in the workflow summary to view all landing pages.

### Verification checklist

- `npm run build` completes without errors.
- Open any file in `dist/<product-id>/index.html` to manually QA layout, navigation, and CTA links.
- Spot check `dist/assets/tailwind.css` is referenced with a relative path (`../assets/tailwind.css`) on every page.

