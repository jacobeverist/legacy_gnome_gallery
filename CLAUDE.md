# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

A media archive of rendered visualization outputs paired with a static gallery website. The generating source code lives at `https://github.com/jacobeverist/legacy_gnome_visuals`.

## Repository Structure

```
legacy_gnome_gallery/
├── illustrations/        # PNG image collections (organized by visualization type)
├── videos/               # GIF animations and MKV videos
│   ├── *.gif             # Top-level standalone GIFs (shown in Animations section)
│   └── <named-dirs>/     # Subdirectory animations (one GIF+MKV each)
├── gallery-site/         # Astro static site source
└── .github/workflows/    # GitHub Pages deploy workflow
```

## Git LFS

All binary media files (`*.png`, `*.gif`, `*.mkv`) are tracked via Git LFS. Run `git lfs install` before committing new media. The GitHub Actions deploy workflow pulls LFS files automatically.

## Gallery Site

### Commands (run from `gallery-site/`)

```bash
npm run dev      # generate thumbnails then start dev server
npm run build    # generate thumbnails then build to dist/
npm run preview  # preview the production build locally
```

Before `dev` or `build`, two symlinks must exist in `gallery-site/public/`:
```bash
ln -s ../../illustrations gallery-site/public/illustrations
ln -s ../../videos        gallery-site/public/videos
```
These are `.gitignore`d — they're created automatically in CI but must be created manually for local dev.

### Architecture

**Media catalog** (`src/data/collections.ts`) — the single source of truth for what the site displays. Runs in Node.js context at build time (uses `fs`). Exports:
- `collections` — PNG-based image series, each with an explicit file list and thumbnail
- `standaloneAnimations` — single-GIF entries pointing into `videos/<dir>/`
- `videoGifs` — top-level GIFs in `videos/`, auto-scanned with `EXCLUDED_VIDEO_GIFS` filtering out older revisions
- `gifToThumbnail(gifPublicPath)` — derives thumbnail URL: `BASE/thumbnails/<path>.jpg`

All exported URL paths include `BASE` (derived from `import.meta.env.BASE_URL`), which is `/legacy_gnome_gallery` in production and `` (empty) in dev. Always strip the trailing slash: `const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')`.

**Thumbnail generation** (`scripts/generate-thumbnails.mjs`) — runs at build time before Astro. Extracts the first frame of every GIF under `illustrations/` and `videos/` as a 400×300 JPEG into `public/thumbnails/`, mirroring the source path. Skips files where the thumbnail is newer than the source.

**Post-build media trimming** (`scripts/trim-dist.mjs`) — run in CI after `npm run build`. Scans all HTML in `dist/` for referenced media files and deletes everything unreferenced from `dist/illustrations/`, `dist/videos/`, and `dist/thumbnails/`. This keeps the GitHub Pages artifact small. Run as:
```bash
SITE_BASE=/legacy_gnome_gallery node scripts/trim-dist.mjs
```

**Lightbox** (`src/layouts/BaseLayout.astro`) — implemented as a single `is:inline` script with event delegation on `[data-lightbox]` elements. Uses `history.pushState` on open so the browser back button closes it; manual close uses `history.replaceState` to avoid triggering a page reload. The `siteBase` variable is injected via `define:vars` so the GitHub URL builder can strip the base prefix from asset paths.

**Collection pages** — `src/pages/collection/[slug].astro` generates one static page per entry in `collections`. Standalone animations and video GIFs are not collection pages; they open directly in the lightbox from the home page.

### Deployment

Deployed to GitHub Pages at `https://jacobeverist.github.io/legacy_gnome_gallery/`. The workflow (`.github/workflows/deploy.yml`) checks out with LFS, creates symlinks, builds, trims, and deploys. Enable via **Settings → Pages → Source: GitHub Actions**.

The `base` in `astro.config.mjs` is `/legacy_gnome_gallery`. Any hardcoded URL paths in `.astro` files must use `import.meta.env.BASE_URL` (for home links) or `base` (strip trailing slash first) for all other paths. Paths in `collections.ts` use the module-level `BASE` constant.
