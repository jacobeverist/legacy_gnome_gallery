---
name: astro-website
description: Build multi-page Astro websites from provided content (markdown articles, PDFs, eBooks). Use this skill when asked to build a website, create a new site, set up a web project, or turn content into a website. Triggers on phrases like "build a website", "new site", "create a website", "set up a site", "turn this into a website", "make a site from these". Always deployed to GitHub + Cloudflare Pages with a custom domain. This skill should be used in an empty project folder where the user has already placed their source content.
---

# Astro Website Builder

Build polished, multi-page static websites from provided content using Astro 5, deployed to Cloudflare Pages with custom domains.

## When This Skill Applies

The user provides content in one of these forms (placed in the project root before starting):
- Markdown (.md) articles
- A PDF or eBook on a topic
- A collection of text files on a theme
- A WordPress XML export
- Sometimes just a topic and verbal description

The job is to transform that into a professional, fast, accessible website.

## Before Starting: Gather Requirements

Ask these questions (skip any already answered):

1. **Site name and domain** — What's it called? What custom domain? (e.g., myproject.com)
2. **Purpose and audience** — Who is this for?
3. **Content sections** — What pages should the site have? (Suggest a structure based on the provided content)
4. **Theme preference** — Dark mode default, light mode, or both with toggle? Color preferences?
5. **Font style** — Editorial/serif, clean modern, or technical? (See `references/design-tokens.md` for options)

## Project Initialization

Run in the empty project folder:

```bash
npm create astro@latest . -- --template minimal --typescript strict --install --git --no
npm install @astrojs/sitemap marked sanitize-html
```

Create the folder structure:
```
src/
├── components/    # Header, Footer, cards, reusable UI
├── layouts/       # BaseLayout.astro
├── pages/         # File-based routes
├── data/          # Content as TypeScript arrays
├── styles/        # global.css
└── utils/         # Helpers (if needed)
public/
├── images/
├── fonts/         # Self-hosted fonts (if any)
├── favicon.svg
├── favicon.ico
├── robots.txt
└── _headers
```

Create these config files:

**astro.config.mjs:**
```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://[your-domain.com]',
  integrations: [sitemap()],
});
```

**wrangler.jsonc:**
```jsonc
{
  "name": "[project-name]",
  "compatibility_date": "[YYYY-MM-DD]",
  "assets": { "directory": "./dist" }
}
```

**tsconfig.json** — use Astro's strict preset with path alias:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"],
  "compilerOptions": { "paths": { "@/*": ["src/*"] } }
}
```

Then create `CLAUDE.md` (read `references/claude-md-template.md`) and `DESIGN.md` (read `references/design-tokens.md` and customize for the project).

## Content Processing

### Step 1: Read the source material

Scan the project root for content files. Read all of them to understand scope, themes, and structure.

### Step 2: Plan information architecture

A typical site has: Home, core content pages (articles/chapters/resources), About, Contact, and a 404 page. For larger content sets, add topic indexes, dynamic `[slug].astro` routes, resource pages, or case studies. Propose the structure to the user before building.

### Step 3: Transform content into TypeScript data

Structure all content as typed TypeScript arrays in `src/data/`. This is the established pattern — TypeScript data files, not markdown content collections.

```typescript
// src/data/articles.ts
export interface Article {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;      // Full markdown content as string
  image?: string;
  imageCredit?: string;
  tags?: string[];
  categories?: string[];
  section?: string;
}
export const articles: Article[] = [ /* populated from source content */ ];
```

For markdown files: extract title from first heading, generate slug, create excerpt from first paragraph, store full content as markdown string.

For PDFs: extract text, identify chapters/sections, split into logical articles.

### Step 4: Build pages

Read `references/component-patterns.md` before building components. Key architecture:

**BaseLayout.astro** wraps every page with: HTML document setup, SEO meta tags (title, description, Open Graph, Twitter Cards), canonical URLs, theme initialization (inline script in `<head>` to prevent flash), font loading, global CSS import, skip-to-main-content link, and Header + `<main>` slot + Footer.

**Dynamic routes** for collections:
```astro
---
// src/pages/articles/[slug].astro
import { articles } from '../../data/articles';
export function getStaticPaths() {
  return articles.map(a => ({ params: { slug: a.slug }, props: { article: a } }));
}
const { article } = Astro.props;
---
```

**Markdown rendering** uses `marked` + `sanitize-html` for security. See `references/component-patterns.md` for the sanitization config.

## Styling Approach

Read `references/design-tokens.md` before writing any CSS. Key principles:

- **No Tailwind** — custom CSS with CSS custom properties
- **"Barely-there UI"** — minimal chrome, let content breathe
- **Fluid typography** — `clamp()` for responsive headings
- **Glass border effect** — conic gradient + mask compositing on cards
- **Cursor-following image zoom** on card images
- **Smooth easing** — `cubic-bezier(0.16, 1, 0.3, 1)` everywhere
- **Accessibility** — skip links, focus-visible, prefers-reduced-motion

Theme toggle (if applicable): `data-theme` attribute on `<html>`, localStorage persistence, inline `<script>` in `<head>` to set before render.

## SEO

Every site includes: meta tags in BaseLayout, Open Graph + Twitter Card tags, canonical URLs, JSON-LD structured data on article pages, sitemap via `@astrojs/sitemap`, `robots.txt`, and semantic HTML throughout.

## Deployment

Build: `npm run build`. Production deployment is GitHub → Cloudflare Pages auto-deploy on push to `main`.

Cloudflare setup: push repo to GitHub → Cloudflare Pages → Create → Connect to Git → build command `npm run build`, output `dist` → add custom domain in settings.

## Stability Checklist

Before considering complete: all pages render, build succeeds, no TS errors, images lazy-loaded, SEO meta on all pages, sitemap works, 404 page exists, mobile responsive (375/768/1024/1440px), keyboard nav works, no console errors, theme toggle works (if applicable), all source content included.

## Reference Files

Read these before building:
- `references/design-tokens.md` — Full design system: colors, typography, spacing, glass borders, animation, responsive breakpoints
- `references/component-patterns.md` — Established component patterns: Header, Footer, cards, layouts, prose styling, modals
- `references/claude-md-template.md` — Template for the project's CLAUDE.md file
