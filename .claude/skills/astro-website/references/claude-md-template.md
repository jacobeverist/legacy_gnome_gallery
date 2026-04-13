# Project Instructions

## About This Site

**[your-domain.com]** — [One-sentence site description]. Built with Astro, deployed to Cloudflare Pages via GitHub.

### Site Purpose
[What this site does and why it exists]

### Target Audience
- [Primary audience]
- [Secondary audience]

### Content Sections
[List each page/section with a short description, e.g.]
- **Home**: Hero + overview + CTA
- **Articles**: Main content library
- **About**: Background + author bios
- **Contact**: Contact form or redirect

### Author
[Your Name]

## Before Making Changes

1. Read existing code before modifying
2. Check for existing utilities/hooks that handle the use case
3. Follow existing patterns in the codebase
4. Remove any code that becomes unused after changes
5. **Always follow DESIGN.md** — All UI changes must adhere to the design system

## Architecture

- **Framework:** Astro 5 (static site generation)
- **Deployment:** Cloudflare Pages (via wrangler)
- **Data:** TypeScript arrays in `src/data/` (not markdown content collections)
- **Styling:** Scoped component CSS + global.css with CSS custom properties
- **Sitemap:** `@astrojs/sitemap` integration
- **Forms:** Formspree (user to provide endpoint)

## Task Management

- **Remove completed tasks from markdown files** — After completing a task documented in DESIGN.md, TODO.md, or similar files, remove it from the document to keep the list current and actionable.

## Deployment

```bash
npm run build          # Build to ./dist
npx wrangler pages deploy ./dist --project-name=[project-name]
```

GitHub repo should be set up with Cloudflare Pages connected for auto-deploy on push to main.
