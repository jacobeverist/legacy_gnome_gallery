# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Purpose

This is a media gallery repository — it stores rendered output images and videos from legacy visualization code. There is no source code here; the generating code lives elsewhere.

## Structure

All content lives under `illustrations/`, organized into subdirectories by visualization type (e.g., `hex_2d_subspace`, `hypergrid_visualization_combinations`, `voronoi_2d_grid`, etc.). Each subdirectory typically contains PNGs (static frames or final images), GIFs (animations), and/or MKV videos.

## Git LFS

All binary media files are tracked via Git LFS:
- `*.png` — static images and animation frames
- `*.gif` — animated sequences
- `*.mkv` — video files

When adding new rendered outputs, ensure Git LFS is initialized (`git lfs install`) before committing. New file types should be added to `.gitattributes` with LFS tracking before the first commit.
