// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://jacobeverist.github.io',
  base: '/legacy_gnome_gallery',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  vite: {
    plugins: [
      {
        name: 'media-cache-headers',
        configureServer(server) {
          // During dev, serve media assets with a 1-hour cache so that
          // history.pushState (lightbox open) doesn't trigger re-validation.
          server.middlewares.use((req, res, next) => {
            const url = req.url ?? '';
            if (
              url.startsWith('/illustrations/') ||
              url.startsWith('/videos/') ||
              url.startsWith('/thumbnails/')
            ) {
              res.setHeader('Cache-Control', 'public, max-age=3600');
            }
            next();
          });
        },
      },
    ],
  },
});
