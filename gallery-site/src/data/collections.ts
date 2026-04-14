import fs from 'fs';
import path from 'path';

// process.cwd() is the gallery-site/ directory during both dev and build
const ILLUS_DIR  = path.resolve(process.cwd(), '../illustrations');
const VIDEOS_DIR = path.resolve(process.cwd(), '../videos');

// Strip trailing slash so we can safely do `${BASE}/path`
// BASE_URL is '/' in dev without a base, or '/legacy_gnome_gallery/' when base is set.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export interface MediaItem {
  type: 'gif' | 'mkv' | 'png';
  filename: string;
  path: string;  // /illustrations/... URL path for <img src>
}

export interface Collection {
  slug: string;
  name: string;
  dirPath: string;
  thumbnail: string;
  items: MediaItem[];
}

export interface TopLevelImage {
  filename: string;
  path: string;
}

export interface StandaloneAnimation {
  name: string;
  gif: string;
  dirPath: string;
}

// No more standalone top-level images — all moved into collections
export const topLevelImages: TopLevelImage[] = [];

function illustrationsPath(rel: string) {
  return `${BASE}/illustrations/${rel}`;
}

function videosPath(rel: string) {
  return `${BASE}/videos/${rel}`;
}

/**
 * Derives the thumbnail URL for a GIF by mirroring its public path
 * under /thumbnails/ with a .jpg extension.
 * e.g. /illustrations/foo/bar.gif  →  /thumbnails/illustrations/foo/bar.jpg
 *      /videos/foo.gif             →  /thumbnails/videos/foo.jpg
 */
export function gifToThumbnail(gifPublicPath: string): string {
  // gifPublicPath already includes BASE (e.g. /legacy_gnome_gallery/videos/foo.gif)
  // thumbnail lives at BASE/thumbnails/<path-without-base>.jpg
  const pathWithoutBase = gifPublicPath.slice(BASE.length);
  return `${BASE}/thumbnails${pathWithoutBase.replace(/\.gif$/i, '.jpg')}`;
}

function makeItems(
  dir: string,
  gifs: string[],
  mkvs: string[],
  pngs: string[]
): MediaItem[] {
  const items: MediaItem[] = [];
  for (const f of gifs) items.push({ type: 'gif', filename: f, path: illustrationsPath(`${dir}/${f}`) });
  for (const f of mkvs) items.push({ type: 'mkv', filename: f, path: illustrationsPath(`${dir}/${f}`) });
  for (const f of pngs) items.push({ type: 'png', filename: f, path: illustrationsPath(`${dir}/${f}`) });
  return items;
}

export interface VideoGif {
  filename: string;
  path: string;  // /videos/<filename>
}

/**
 * Earlier revisions and exact duplicates to suppress.
 * For each series only the latest version is shown.
 */
const EXCLUDED_VIDEO_GIFS = new Set([
  // grid_2D_0_90 / 0.66_1.33 periods_8_bins — keep v5
  'grid_2D_0_90_angles_0.66_1.33_periods_8_bins.gif',
  'grid_2D_0_90_angles_0.66_1.33_periods_8_bins_v2.gif',
  'grid_2D_0_90_angles_0.66_1.33_periods_8_bins_v3.gif',
  'grid_2D_0_90_angles_0.66_1.33_periods_8_bins_v4.gif',
  // grid_2D_0_90 / 1.0 periods_8_bins — keep v1
  'grid_2D_0_90_angles_1.0_periods_8_bins.gif',
  // grid_2D_0_90 / 1 period, 4 bins — keep the v1 with decimal naming
  'grid_2D_0_90_angles_1_periods_4_bins.gif',
  // hypergrid_lemniscate faded series — keep _5
  'hypergrid_lemniscate_faded_periodic_visual_1.gif',
  'hypergrid_lemniscate_faded_periodic_visual_2.gif',
  'hypergrid_lemniscate_faded_periodic_visual_3.gif',
  'hypergrid_lemniscate_faded_periodic_visual_4.gif',
  // showbits color-coded unit_periods — keep _2
  'hypergrid_showbits_color_coded_unit_periods_1.gif',
  // duplicates of the subdirectory standalone animations
  'overlapping_3_2D_grids.gif',
  'overlapping_3_random_2D_grids.gif',
]);

/** All GIFs in the top-level videos/ directory, scanned at build time. */
export const videoGifs: VideoGif[] = fs
  .readdirSync(VIDEOS_DIR)
  .filter((f) => f.toLowerCase().endsWith('.gif') && !EXCLUDED_VIDEO_GIFS.has(f))
  .sort()
  .map((f) => ({ filename: f, path: `${BASE}/videos/${f}` }));

/** Recursively collect all PNGs under a directory, returning paths relative to ILLUS_DIR. */
function scanPngs(absDir: string): MediaItem[] {
  const items: MediaItem[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.png')) {
        const rel = path.relative(ILLUS_DIR, full).replace(/\\/g, '/');
        items.push({ type: 'png', filename: entry.name, path: `${BASE}/illustrations/${rel}` });
      }
    }
  }
  walk(absDir);
  items.sort((a, b) => a.path.localeCompare(b.path));
  return items;
}

// ─── Standalone animations (GIF + MKV only, no PNGs) ─────────────────────────
export const standaloneAnimations: StandaloneAnimation[] = [
  {
    name: '45° Orthogonal 2D Subspace',
    gif: videosPath('45_orthogonal_2d_subspace/visual_test.gif'),
    dirPath: '45_orthogonal_2d_subspace',
  },
  {
    name: 'Actual Hex Grid',
    gif: videosPath('actual_hex_grid/actual_hex_grid.gif'),
    dirPath: 'actual_hex_grid',
  },
  {
    name: 'Hex 2D Subspace',
    gif: videosPath('hex_2d_subspace/visual_test.gif'),
    dirPath: 'hex_2d_subspace',
  },
  {
    name: 'Hexagonal Grid Example',
    gif: videosPath('hexagonal_grid_example/hexagonal_2D_grid.gif'),
    dirPath: 'hexagonal_grid_example',
  },
  {
    name: 'Hexagonal Grid Similarity',
    gif: videosPath('hexagonal_grid_similarity/hexagonal_grid_similarity.gif'),
    dirPath: 'hexagonal_grid_similarity',
  },
  {
    name: 'Multi Basis Visuals',
    gif: videosPath('multi_basis_visuals/multi_basis_visuals.gif'),
    dirPath: 'multi_basis_visuals',
  },
  {
    name: 'Overlaid Actual Hex Grid',
    gif: videosPath('overlaid_actual_hex_grid/visual_test.gif'),
    dirPath: 'overlaid_actual_hex_grid',
  },
  {
    name: 'Overlaid Grid',
    gif: videosPath('overlaid_grid/overlaid_grid.gif'),
    dirPath: 'overlaid_grid',
  },
  {
    name: 'Overlaid Theory Grid',
    gif: videosPath('overlaid_theory_grid/overlaid_theory_grid.gif'),
    dirPath: 'overlaid_theory_grid',
  },
  {
    name: 'Overlapping 3 2D Grids',
    gif: videosPath('overlapping_3_2D_grids/overlapping_3_2D_grids.gif'),
    dirPath: 'overlapping_3_2D_grids',
  },
  {
    name: 'Overlapping 3 Random 2D Grids',
    gif: videosPath('overlapping_3_random_2D_grids/overlapping_3_random_2D_grids.gif'),
    dirPath: 'overlapping_3_random_2D_grids',
  },
  {
    name: 'Theory Hex Grid',
    gif: videosPath('theory_hex_grid/theory_hex_grid.gif'),
    dirPath: 'theory_hex_grid',
  },
  {
    name: 'Visualize Subspace Bases',
    gif: videosPath('visualize_subspace_bases/visualize_subspace_bases.gif'),
    dirPath: 'visualize_subspace_bases',
  },
  {
    name: 'Voronoi 2D Grid',
    gif: videosPath('voronoi_2d_grid/visual_test.gif'),
    dirPath: 'voronoi_2d_grid',
  },
];

// ─── Collections ──────────────────────────────────────────────────────────────
export const collections: Collection[] = [
  // ── New collections from reorganized standalone images ──
  {
    slug: '1d-hypergrid-assorted',
    name: '1D Hypergrid Assorted',
    dirPath: '1d_hypergrid_assorted',
    thumbnail: illustrationsPath('1d_hypergrid_assorted/hypergrid_illustration_1.png'),
    items: makeItems('1d_hypergrid_assorted', [], [], [
      'grid_illustration_1.png',
      'grid_not_spaced.png',
      'grid_not_spaced_rotated.png',
      'grid_spaced.png',
      'grid_spaced_rotated.png',
      'hypergrid_experiment_1D_1.png',
      'hypergrid_experiment_1D_2.png',
      'hypergrid_experiment_1D_semantic_similarity_random_magnitude.png',
      'hypergrid_experiment_1D_semantic_similarity_uniform_magnitude.png',
      'hypergrid_experiment_1D_semantic_similarity_uniform_magnitude_legend.png',
      'hypergrid_experiment_1D_unscaled.png',
      'hypergrid_experiment_64_grids_even_mags_1D.png',
      'hypergrid_experiment_64_grids_random_mags_1D.png',
      'hypergrid_experiment_n_grids_1_to_64_1D.png',
      'hypergrid_illustration_1.png',
      'hypergrid_illustration_2.png',
      'hypergrid_illustration_3.png',
      'hypergrid_illustration_4.png',
      'hypergrid_illustration_5.png',
      'multi_similarity_plot_n_w__06_03__07_03__08_03__09_03__10_03__12_03.png',
    ]),
  },
  {
    slug: '2d-hypergrid-assorted',
    name: '2D Hypergrid Assorted',
    dirPath: '2d_hypergrid_assorted',
    thumbnail: illustrationsPath('2d_hypergrid_assorted/hypergrid_2D_illustration_1.png'),
    items: makeItems('2d_hypergrid_assorted', [], [], [
      'floating_illustration.png',
      'hypergrid_2D_frames_6_00000.png',
      'hypergrid_2D_illustration_1.png',
      'hypergrid_2D_illustration_2.png',
      'hypergrid_projection_illustration_1.png',
      'hypergrid_projection_illustration_2.png',
      'hypergrid_projection_illustration_3.png',
      'multi_basis_visual_grid_and_similarity.png',
      'visual_test01.png',
      'visual_test02.png',
      'visualization_of_subspace_bases.png',
    ]),
  },
  {
    slug: 'vector-and-set-visual',
    name: 'Vector and Set Visual',
    dirPath: 'vector_and_set_visual',
    thumbnail: illustrationsPath('vector_and_set_visual/simple_grid.png'),
    items: makeItems('vector_and_set_visual', [], [], [
      'simple_grid.png',
      'simple_vector.png',
    ]),
  },
  {
    slug: 'similarity-anomalies',
    name: 'Similarity Anomalies',
    dirPath: 'similarity_anomalies',
    thumbnail: illustrationsPath('similarity_anomalies/hypergrid_2D_similarity_frames_2_00008.png'),
    items: makeItems('similarity_anomalies', [], [], [
      'hypergrid_2D_similarity_frames_2_00008.png',
      'hypergrid_2D_similarity_frames_2_00009.png',
      'hypergrid_2D_similarity_frames_2_00010.png',
      'hypergrid_2D_similarity_frames_2_00036.png',
      'hypergrid_2D_similarity_frames_2_00037.png',
      'hypergrid_2D_similarity_frames_2_00038.png',
      'hypergrid_2D_similarity_frames_2_00065.png',
      'hypergrid_2D_similarity_frames_2_00066.png',
      'hypergrid_2D_similarity_frames_2_00067.png',
      'hypergrid_2D_similarity_frames_2_00132.png',
      'hypergrid_2D_similarity_frames_2_00133.png',
      'hypergrid_2D_similarity_frames_2_00134.png',
      'hypergrid_2D_similarity_frames_2_00161.png',
      'hypergrid_2D_similarity_frames_2_00162.png',
      'hypergrid_2D_similarity_frames_2_00163.png',
      'hypergrid_2D_similarity_frames_2_00189.png',
      'hypergrid_2D_similarity_frames_2_00190.png',
      'hypergrid_2D_similarity_frames_2_00191.png',
    ]),
  },
  {
    slug: 'parallel-one-hot-combinations-interval-graphs',
    name: 'Parallel One Hot Combinations Interval Graphs',
    dirPath: 'parallel_one_hot_combinations_interval_graphs',
    thumbnail: illustrationsPath(
      'parallel_one_hot_combinations_interval_graphs/interval_plots_2020_01_26/bin_interval_graph_02_grids_bins_02_03.png'
    ),
    items: scanPngs(path.join(ILLUS_DIR, 'parallel_one_hot_combinations_interval_graphs')),
  },
  // ── Existing collections (PNG-based) ──
  {
    slug: 'cyclic-encoding-similarity',
    name: 'Cyclic Encoding Similarity',
    dirPath: 'cyclic_encoding_similarity',
    thumbnail: illustrationsPath('cyclic_encoding_similarity/01_04_cyclic_similarity.png'),
    items: makeItems('cyclic_encoding_similarity', [], [], [
      '01_04_cyclic_similarity.png','01_05_cyclic_similarity.png','01_06_cyclic_similarity.png',
      '01_07_cyclic_similarity.png','01_08_cyclic_similarity.png','01_09_cyclic_similarity.png',
      '01_10_cyclic_similarity.png','01_11_cyclic_similarity.png','01_12_cyclic_similarity.png',
      '02_04_cyclic_similarity.png','02_05_cyclic_similarity.png','02_06_cyclic_similarity.png',
      '02_07_cyclic_similarity.png','02_08_cyclic_similarity.png','02_09_cyclic_similarity.png',
      '02_10_cyclic_similarity.png','02_11_cyclic_similarity.png','02_12_cyclic_similarity.png',
      '03_06_cyclic_similarity.png','03_07_cyclic_similarity.png','03_08_cyclic_similarity.png',
      '03_09_cyclic_similarity.png','03_10_cyclic_similarity.png','03_11_cyclic_similarity.png',
      '03_12_cyclic_similarity.png','04_08_cyclic_similarity.png','04_09_cyclic_similarity.png',
      '04_10_cyclic_similarity.png','04_11_cyclic_similarity.png','04_12_cyclic_similarity.png',
      '05_10_cyclic_similarity.png','05_11_cyclic_similarity.png','05_12_cyclic_similarity.png',
      '06_12_cyclic_similarity.png',
    ]),
  },
  {
    slug: 'encoding-comparisons',
    name: 'Encoding Comparisons',
    dirPath: 'encoding_comparisons',
    thumbnail: illustrationsPath('encoding_comparisons/08_encoding.png'),
    items: makeItems('encoding_comparisons', [], [], [
      '08_encoding.png','08_similarity.png','08_base_2_similarity.png',
      '12_encoding.png','12_base_2_similarity.png',
      '16_base_2_similarity.png','16_base_2_similarity_version_1.png',
      '20_base_2_similarity.png',
      '01_similary_n_w__06_03.png','01_similary_n_w__07_03.png','01_similary_n_w__08_03.png',
      '01_similary_n_w__08_04.png','01_similary_n_w__09_03.png','01_similary_n_w__09_04.png',
      '01_similary_n_w__10_03.png','01_similary_n_w__10_04.png','01_similary_n_w__10_05.png',
      '01_similary_n_w__12_03.png','01_similary_n_w__12_04.png','01_similary_n_w__12_05.png',
      '01_similary_n_w__12_06.png','01_similary_n_w__16_03.png',
    ]),
  },
  {
    slug: 'finite-encoding-similarity',
    name: 'Finite Encoding Similarity',
    dirPath: 'finite_encoding_similarity',
    thumbnail: illustrationsPath('finite_encoding_similarity/01_04_interval_similarity.png'),
    items: makeItems('finite_encoding_similarity', [], [], [
      '01_04_interval_similarity.png','01_05_interval_similarity.png','01_06_interval_similarity.png',
      '01_07_interval_similarity.png','01_08_interval_similarity.png','01_09_interval_similarity.png',
      '01_10_interval_similarity.png','01_11_interval_similarity.png','01_12_interval_similarity.png',
      '02_04_interval_similarity.png','02_05_interval_similarity.png','02_06_interval_similarity.png',
      '02_07_interval_similarity.png','02_08_interval_similarity.png','02_09_interval_similarity.png',
      '02_10_interval_similarity.png','02_11_interval_similarity.png','02_12_interval_similarity.png',
      '03_06_interval_similarity.png','03_07_interval_similarity.png','03_08_interval_similarity.png',
      '03_09_interval_similarity.png','03_10_interval_similarity.png','03_11_interval_similarity.png',
      '03_12_interval_similarity.png','04_08_interval_similarity.png','04_09_interval_similarity.png',
      '04_10_interval_similarity.png','04_11_interval_similarity.png','04_12_interval_similarity.png',
      '05_10_interval_similarity.png','05_11_interval_similarity.png','05_12_interval_similarity.png',
      '06_12_interval_similarity.png',
    ]),
  },
  {
    slug: 'finite-vs-cyclical-encoding-similarity',
    name: 'Finite vs Cyclical Encoding Similarity',
    dirPath: 'finite_vs_cyclical_encoding_similarity',
    thumbnail: illustrationsPath('finite_vs_cyclical_encoding_similarity/01_04_cyclic_similarity.png'),
    items: makeItems('finite_vs_cyclical_encoding_similarity', [], [], [
      '01_04_cyclic_similarity.png','01_04_finite_similarity.png',
      '01_05_cyclic_similarity.png','01_05_finite_similarity.png',
      '01_06_cyclic_similarity.png','01_06_finite_similarity.png',
      '01_07_cyclic_similarity.png','01_07_finite_similarity.png',
      '01_08_cyclic_similarity.png','01_08_finite_similarity.png',
      '01_09_cyclic_similarity.png','01_09_finite_similarity.png',
      '01_10_cyclic_similarity.png','01_10_finite_similarity.png',
      '01_11_cyclic_similarity.png','01_11_finite_similarity.png',
      '02_04_cyclic_similarity.png','02_04_finite_similarity.png',
      '02_05_cyclic_similarity.png','02_05_finite_similarity.png',
      '02_06_cyclic_similarity.png','02_06_finite_similarity.png',
      '02_07_cyclic_similarity.png','02_07_finite_similarity.png',
      '02_08_cyclic_similarity.png','02_08_finite_similarity.png',
      '02_09_cyclic_similarity.png','02_09_finite_similarity.png',
      '02_10_cyclic_similarity.png','02_10_finite_similarity.png',
      '02_11_cyclic_similarity.png','02_11_finite_similarity.png',
      '03_06_cyclic_similarity.png','03_06_finite_similarity.png',
      '03_07_cyclic_similarity.png','03_07_finite_similarity.png',
      '03_08_cyclic_similarity.png','03_08_finite_similarity.png',
      '03_09_cyclic_similarity.png','03_09_finite_similarity.png',
      '03_10_cyclic_similarity.png','03_10_finite_similarity.png',
      '03_11_cyclic_similarity.png','03_11_finite_similarity.png',
      '04_08_cyclic_similarity.png','04_08_finite_similarity.png',
      '04_09_cyclic_similarity.png','04_09_finite_similarity.png',
      '04_10_cyclic_similarity.png','04_10_finite_similarity.png',
      '04_11_finite_similarity.png',
      '05_10_cyclic_similarity.png','05_10_finite_similarity.png',
    ]),
  },
  {
    slug: 'hypergrid-visualization-combinations',
    name: 'Hypergrid Visualization Combinations',
    dirPath: 'hypergrid_visualization_combinations',
    thumbnail: illustrationsPath('hypergrid_visualization_combinations/grid_2D_1_angles_1_periods_4_bins_frames_00000.png'),
    items: makeItems('hypergrid_visualization_combinations', [], [], [
      'grid_2D_1_angles_1_periods_4_bins_frames_00000.png',
      'grid_2D_1_angles_1_periods_8_bins_frames_00000.png',
      'grid_2D_2_angles_1_periods_4_bins_frames_00000.png',
      'grid_2D_2_angles_1_periods_8_bins_frames_00000.png',
      'grid_2D_2_angles_2_periods_4_bins_frames_00000.png',
      'grid_2D_2_angles_2_periods_8_bins_frames_00000.png',
      'grid_2D_2_angles_3_periods_4_bins_frames_00000.png',
      'grid_2D_2_angles_3_periods_8_bins_frames_00000.png',
      'grid_2D_4_angles_1_periods_4_bins_frames_00000.png',
      'grid_2D_4_angles_1_periods_8_bins_frames_00000.png',
      'grid_2D_4_angles_2_periods_4_bins_frames_00000.png',
      'grid_2D_4_angles_2_periods_8_bins_frames_00000.png',
      'grid_2D_4_angles_3_periods_4_bins_frames_00000.png',
      'grid_2D_4_angles_3_periods_8_bins_frames_00000.png',
    ]),
  },
  {
    slug: 'matplotlib-heatmap-examples',
    name: 'Matplotlib Heatmap Examples',
    dirPath: 'matplotlib_heatmap_examples',
    thumbnail: illustrationsPath('matplotlib_heatmap_examples/test1.png'),
    items: makeItems('matplotlib_heatmap_examples', [], [], [
      'palette.png','test1.png','test2.png','test3.png','test4.png',
      'test5.png','test6.png','test7.png','test8.png','test9.png','test10.png',
    ]),
  },
  {
    slug: 'parallel-encodings-m-n-w-combinations',
    name: 'Parallel Encodings M N W Combinations',
    dirPath: 'parallel_encodings_m_n_w_combinations',
    thumbnail: illustrationsPath('parallel_encodings_m_n_w_combinations/01_parallel_encoders_n_w__04_01.png'),
    items: makeItems('parallel_encodings_m_n_w_combinations', [], [], [
      '01_parallel_encoders_n_w__04_01.png','01_parallel_encoders_n_w__09_01.png',
      '01_parallel_encoders_n_w__09_02.png','01_parallel_encoders_n_w__09_03.png',
      '01_parallel_encoders_n_w__09_04.png','01_parallel_encoders_n_w__09_05.png',
      '01_parallel_encoders_n_w__09_06.png','01_parallel_encoders_n_w__16_01.png',
      '01_parallel_encoders_n_w__16_02.png','01_parallel_encoders_n_w__16_03.png',
      '01_parallel_encoders_n_w__16_04.png','01_parallel_encoders_n_w__16_05.png',
      '01_parallel_encoders_n_w__16_06.png','01_parallel_encoders_n_w__16_07.png',
      '01_parallel_encoders_n_w__16_08.png','01_parallel_encoders_n_w__256_01.png',
      '01_parallel_encoders_n_w__256_02.png','01_parallel_encoders_n_w__256_03.png',
      '01_parallel_encoders_n_w__256_08.png','01_parallel_encoders_n_w__256_16.png',
      '01_parallel_encoders_n_w__256_32.png','01_parallel_encoders_n_w__256_64.png',
      '01_parallel_encoders_n_w__256_128.png',
      '02_parallel_encoders_n_w__04_01__08_01.png','02_parallel_encoders_n_w__07_01__12_01.png',
      '02_parallel_encoders_n_w__08_01__16_01.png',
      '03_parallel_encoders_n_w__10_01__11_01__12_01.png',
      '04_parallel_encoders_n_w__02_01__04_01__08_01__16_01.png',
      '04_parallel_encoders_n_w__05_01__07_01__09_01__11_01.png',
      '04_parallel_encoders_n_w__09_01__10_01__11_01__12_01.png',
      '06_parallel_encoders_n_w__07_01__08_01__09_01__10_01__11_01__12_01.png',
      '07_parallel_encoders_n_w__05_01__06_01__07_01__08_01__09_01__10_01__12_01.png',
    ]),
  },
  {
    slug: 'parallel-encodings-prime-numbers',
    name: 'Parallel Encodings Prime Numbers',
    dirPath: 'parallel_encodings_prime_numbers',
    thumbnail: illustrationsPath('parallel_encodings_prime_numbers/04_parallel_encoders_n_w__05_01__07_01__11_01__13_01.png'),
    items: makeItems('parallel_encodings_prime_numbers', [], [], [
      '04_parallel_encoders_n_w__05_01__07_01__11_01__13_01.png',
      '04_parallel_encoders_n_w__05_01__07_01__11_01__17_01.png',
      '04_parallel_encoders_n_w__05_01__07_01__13_01__17_01.png',
      '04_parallel_encoders_n_w__05_01__11_01__13_01__17_01.png',
      '04_parallel_encoders_n_w__05_02__07_02__11_02__13_02.png',
      '04_parallel_encoders_n_w__05_03__07_03__11_03__13_03.png',
      '04_parallel_encoders_n_w__07_01__11_01__13_01__17_01.png',
      '05_parallel_encoders_n_w__05_01__07_01__11_01__13_01__17_01.png',
      '05_parallel_encoders_n_w__05_02__07_02__11_02__13_02__17_02.png',
      '05_parallel_encoders_n_w__05_03__07_03__11_03__13_03__17_03.png',
    ]),
  },
];
