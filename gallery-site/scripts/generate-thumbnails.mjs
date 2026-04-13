/**
 * Build-time thumbnail generator.
 * Extracts the first frame of every GIF under illustrations/ and videos/,
 * saves a 400×300 JPEG to public/thumbnails/ mirroring the source path.
 * Skips files that are already up-to-date (mtime comparison).
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const GALLERY    = path.resolve(__dirname, '..');
const PROJECT    = path.resolve(GALLERY, '..');
const THUMBS_DIR = path.join(GALLERY, 'public', 'thumbnails');

/** Recursively collect all .gif paths under a directory. */
function findGifs(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findGifs(full, out);
    else if (entry.name.toLowerCase().endsWith('.gif')) out.push(full);
  }
  return out;
}

/** Derive thumbnail dest path from source gif path. */
function thumbPath(gifAbs) {
  const rel = path.relative(PROJECT, gifAbs);          // e.g. illustrations/foo/bar.gif
  return path.join(THUMBS_DIR, rel.replace(/\.gif$/i, '.jpg'));
}

async function generateThumb(src, dest) {
  // Skip if thumb is newer than the source gif
  if (fs.existsSync(dest)) {
    const srcMtime  = fs.statSync(src).mtimeMs;
    const destMtime = fs.statSync(dest).mtimeMs;
    if (destMtime >= srcMtime) return;
  }

  fs.mkdirSync(path.dirname(dest), { recursive: true });

  try {
    await sharp(src, { pages: 1, animated: false })
      .resize(400, 300, { fit: 'cover', position: 'top' })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(dest);
    console.log(`  ✓  ${path.relative(PROJECT, dest)}`);
  } catch (err) {
    console.warn(`  ✗  ${path.relative(PROJECT, src)}: ${err.message}`);
  }
}

async function main() {
  const gifs = [
    ...findGifs(path.join(PROJECT, 'illustrations')),
    ...findGifs(path.join(PROJECT, 'videos')),
  ];

  console.log(`Generating thumbnails for ${gifs.length} GIFs…`);
  for (const gif of gifs) {
    await generateThumb(gif, thumbPath(gif));
  }
  console.log('Thumbnails done.');
}

main().catch((e) => { console.error(e); process.exit(1); });
