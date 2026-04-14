# Legacy Gnome Gallery

A media archive and gallery website for rendered output from legacy visualization research — grid encodings, hypergrid experiments, hexagonal subspaces, and similarity metrics.

**Live site:** https://jacobeverist.github.io/legacy_gnome_gallery/

**Generating source code:** https://github.com/jacobeverist/legacy_gnome_visuals

## Contents

Media is organized into two directories:

- **`illustrations/`** — static PNG image collections, grouped by visualization type (encoding comparisons, hypergrid combinations, similarity curves, etc.)
- **`videos/`** — animated GIFs and MKV videos, including both top-level standalone animations and named subdirectories containing related sequences

All binary files are tracked with **Git LFS**.

## Gallery Site

The site is a static Astro app in `gallery-site/`. It generates a dark-themed gallery with:

- **Image Collections** — browsable pages for each subdirectory of PNGs, with a lightbox viewer
- **Animations** — thumbnail cards for all GIFs that open a full-size lightbox on click

### Local development

Requires Node.js ≥ 22 and Git LFS.

```bash
git lfs pull

# Create symlinks so Astro can serve the media files
ln -s ../../illustrations gallery-site/public/illustrations
ln -s ../../videos        gallery-site/public/videos

cd gallery-site
npm install
npm run dev
```

### Build

```bash
cd gallery-site
npm run build
```

The build runs thumbnail generation (first-frame JPEGs from every GIF) before the Astro compile step.

## Deployment

Deployed automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`. The workflow pulls LFS files, builds the site, trims unreferenced media from the output, and deploys `gallery-site/dist/`.

To enable for the first time: **Settings → Pages → Source: GitHub Actions**.
