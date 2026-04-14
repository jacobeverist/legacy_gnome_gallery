/**
 * Post-build media trimmer.
 *
 * Scans every HTML file in dist/ for media references (src, href, data-src,
 * data-full attributes pointing to .png/.gif/.jpg/.mkv/.jpeg files), then
 * deletes any file under dist/illustrations/, dist/videos/, and
 * dist/thumbnails/ that is not referenced.
 *
 * Usage:
 *   SITE_BASE=/legacy_gnome_gallery node scripts/trim-dist.mjs
 *
 * SITE_BASE must match the `base` option in astro.config.mjs (no trailing slash).
 * Leave it unset (or empty) when building without a base path.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST      = path.resolve(__dirname, '../dist');
const SITE_BASE = (process.env.SITE_BASE || '').replace(/\/$/, '');

const MEDIA_DIRS = ['illustrations', 'videos', 'thumbnails'];
const MEDIA_EXT  = /\.(png|gif|jpg|jpeg|mkv)$/i;
const ATTR_RE    = /(?:src|href|data-src|data-full)="([^"]+)"/gi;

// ── 1. Collect all referenced media paths ─────────────────────────────────────

function scanHtml(dir, refs = new Set()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanHtml(full, refs);
    } else if (entry.name.endsWith('.html')) {
      const html = fs.readFileSync(full, 'utf8');
      for (const [, raw] of html.matchAll(ATTR_RE)) {
        // Strip query strings and fragments
        const urlPath = raw.split('?')[0].split('#')[0];
        if (!MEDIA_EXT.test(urlPath)) continue;
        // Strip the site base prefix so we get a dist-relative path
        const rel = SITE_BASE && urlPath.startsWith(SITE_BASE)
          ? urlPath.slice(SITE_BASE.length)
          : urlPath;
        if (rel) refs.add(rel); // e.g. /illustrations/foo/bar.png
      }
    }
  }
  return refs;
}

const refs = scanHtml(DIST);
console.log(`trim-dist: ${refs.size} media files referenced in HTML.`);

// ── 2. Delete unreferenced files ──────────────────────────────────────────────

function listFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(full, out);
    else out.push(full);
  }
  return out;
}

function removeEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) removeEmptyDirs(path.join(dir, entry.name));
  }
  const remaining = fs.readdirSync(dir);
  if (remaining.length === 0) fs.rmdirSync(dir);
}

let kept = 0;
let removed = 0;

for (const mediaDirName of MEDIA_DIRS) {
  const mediaDir = path.join(DIST, mediaDirName);
  for (const absFile of listFiles(mediaDir)) {
    // Convert to a URL path relative to dist root  e.g. /illustrations/foo/bar.png
    const urlPath = '/' + path.relative(DIST, absFile).replace(/\\/g, '/');
    if (refs.has(urlPath)) {
      kept++;
    } else {
      fs.unlinkSync(absFile);
      removed++;
    }
  }
  removeEmptyDirs(mediaDir);
}

console.log(`trim-dist: kept ${kept}, removed ${removed} unreferenced files.`);
