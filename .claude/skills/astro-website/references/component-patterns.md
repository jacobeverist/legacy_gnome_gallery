# Astro Website Component Patterns

Reference guide for established component patterns used in Astro static websites built with this skill.

---

## BaseLayout.astro

The foundational layout component wrapping all pages with meta tags, theme initialization, and semantic structure.

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description?: string;
  image?: string;
  type?: 'article' | 'website';
  publishedDate?: string;
  canonicalUrl?: string;
}

const {
  title,
  description = '[Your Site Name] — [Default description for SEO]',
  image = '/og-image.jpg',
  type = 'website',
  publishedDate,
  canonicalUrl = Astro.url.href,
} = Astro.props;

const siteUrl = import.meta.env.SITE;
const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;
---

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="canonical" href={canonicalUrl} />

    <!-- Primary Meta Tags -->
    <meta name="title" content={title} />
    <meta name="description" content={description} />

    <!-- Open Graph -->
    <meta property="og:type" content={type} />
    <meta property="og:url" content={canonicalUrl} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={fullImageUrl} />
    {publishedDate && (
      <meta property="article:published_time" content={publishedDate} />
    )}

    <!-- Twitter Card -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={canonicalUrl} />
    <meta property="twitter:title" content={title} />
    <meta property="twitter:description" content={description} />
    <meta property="twitter:image" content={fullImageUrl} />

    <title>{title}</title>

    <!-- Theme initialization (runs before DOM renders) -->
    <script is:inline>
      (function () {
        const storedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = storedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
      })();
    </script>
  </head>

  <body>
    <!-- Skip to main content link -->
    <a href="#main" class="sr-only focus:not-sr-only">
      Skip to main content
    </a>

    <Header />
    <main id="main">
      <slot />
    </main>
    <Footer />
  </body>
</html>

<style is:global>
  :root {
    --color-bg: #ffffff;
    --color-text: #1a1a1a;
    --color-accent: #0066cc;
    --color-muted: #666666;
  }

  [data-theme="dark"] {
    --color-bg: #1a1a1a;
    --color-text: #ffffff;
    --color-accent: #0066ff;
    --color-muted: #999999;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  body {
    background-color: var(--color-bg);
    color: var(--color-text);
    transition: background-color 0.3s, color 0.3s;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .focus\:not-sr-only:focus {
    position: static;
    width: auto;
    height: auto;
    padding: inherit;
    margin: inherit;
    overflow: visible;
    clip: auto;
    white-space: normal;
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
</style>
```

---

## Header.astro

Navigation header with theme toggle, mobile menu, and active state detection.

```astro
---
// src/components/Header.astro
const currentPath = Astro.url.pathname;

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
---

<header class="header">
  <div class="header-content">
    <a href="/" class="logo">
      <span class="logo-text">[Site Name]</span>
    </a>

    <nav class="nav-desktop">
      {navLinks.map(link => (
        <a
          href={link.href}
          class={`nav-link ${
            currentPath === link.href ||
            (link.href !== '/' && currentPath.startsWith(link.href))
              ? 'active'
              : ''
          }`}
        >
          {link.label}
        </a>
      ))}
    </nav>

    <div class="header-actions">
      <button
        id="theme-toggle"
        class="theme-toggle"
        aria-label="Toggle dark mode"
        title="Toggle dark mode"
      >
        <svg
          class="sun-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
        <svg
          class="moon-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </button>

      <button
        id="menu-toggle"
        class="menu-toggle"
        aria-label="Toggle menu"
        aria-expanded="false"
        aria-controls="mobile-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
    </div>
  </div>

  <nav id="mobile-menu" class="mobile-menu" aria-hidden="true">
    {navLinks.map(link => (
      <a
        href={link.href}
        class={`mobile-nav-link ${
          currentPath === link.href ||
          (link.href !== '/' && currentPath.startsWith(link.href))
            ? 'active'
            : ''
        }`}
      >
        {link.label}
      </a>
    ))}
  </nav>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 0;
  }

  [data-theme="dark"] .header {
    background: rgba(26, 26, 26, 0.8);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
  }

  .logo {
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
    color: var(--color-text);
    transition: opacity 0.3s;
  }

  .logo:hover {
    opacity: 0.8;
  }

  .nav-desktop {
    display: flex;
    gap: 2rem;
    list-style: none;
  }

  .nav-link {
    text-decoration: none;
    color: var(--color-text);
    padding: 0.5rem 0;
    border-bottom: 2px solid transparent;
    transition: border-color 0.3s;
  }

  .nav-link:hover {
    border-bottom-color: var(--color-accent);
  }

  .nav-link.active {
    border-bottom-color: var(--color-accent);
    font-weight: 500;
  }

  .header-actions {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .theme-toggle,
  .menu-toggle {
    background: none;
    border: none;
    cursor: pointer;
    color: var(--color-text);
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    transition: background-color 0.3s;
  }

  .theme-toggle:hover,
  .menu-toggle:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] .theme-toggle:hover,
  [data-theme="dark"] .menu-toggle:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .moon-icon {
    display: none;
  }

  [data-theme="dark"] .sun-icon {
    display: none;
  }

  [data-theme="dark"] .moon-icon {
    display: block;
  }

  .menu-toggle {
    display: none;
    flex-direction: column;
    gap: 0.35rem;
  }

  .menu-toggle span {
    width: 24px;
    height: 2px;
    background-color: var(--color-text);
    transition: all 0.3s;
  }

  .menu-toggle[aria-expanded="true"] span:nth-child(1) {
    transform: rotate(45deg) translate(8px, 8px);
  }

  .menu-toggle[aria-expanded="true"] span:nth-child(2) {
    opacity: 0;
  }

  .menu-toggle[aria-expanded="true"] span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -7px);
  }

  .mobile-menu {
    display: none;
    position: fixed;
    top: 60px;
    right: 0;
    height: calc(100vh - 60px);
    width: 100%;
    max-width: 300px;
    background: var(--color-bg);
    border-left: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 50;
  }

  [data-theme="dark"] .mobile-menu {
    border-left-color: rgba(255, 255, 255, 0.1);
  }

  .mobile-menu[aria-hidden="false"] {
    transform: translateX(0);
  }

  .mobile-nav-link {
    display: block;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: var(--color-text);
    border-radius: 0.5rem;
    border-left: 3px solid transparent;
    transition: border-left-color 0.3s;
  }

  .mobile-nav-link:hover {
    border-left-color: var(--color-accent);
  }

  .mobile-nav-link.active {
    border-left-color: var(--color-accent);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .nav-desktop {
      display: none;
    }

    .menu-toggle {
      display: flex;
    }
  }
</style>

<script>
  function initHeader() {
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    // Theme toggle
    themeToggle?.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });

    // Mobile menu toggle
    menuToggle?.addEventListener('click', () => {
      const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!isExpanded));
      mobileMenu?.setAttribute('aria-hidden', String(isExpanded));
    });

    // Close mobile menu on link click
    const mobileLinks = mobileMenu?.querySelectorAll('.mobile-nav-link');
    mobileLinks?.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle?.setAttribute('aria-expanded', 'false');
        mobileMenu?.setAttribute('aria-hidden', 'true');
      });
    });

    // Close mobile menu on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu?.getAttribute('aria-hidden') === 'false') {
        menuToggle?.setAttribute('aria-expanded', 'false');
        mobileMenu?.setAttribute('aria-hidden', 'true');
      }
    });
  }

  initHeader();
</script>
```

---

## Footer.astro

Footer with site navigation and copyright.

```astro
---
// src/components/Footer.astro
const year = new Date().getFullYear();

// Optional: link to your other projects
const otherSites = [
  // { label: 'My Other Project', url: 'https://example.com' },
];
---

<footer class="footer">
  <div class="gradient-divider"></div>

  <div class="footer-content">
    <div class="footer-section">
      <h3>[Site Name]</h3>
      <nav class="footer-nav">
        <a href="/">Home</a>
        <a href="/articles">Articles</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </nav>
    </div>

    {otherSites.length > 0 && (
      <div class="footer-section">
        <h3>Other Projects</h3>
        <nav class="footer-nav">
          {otherSites.map(site => (
            <a href={site.url} target="_blank" rel="noopener noreferrer">
              {site.label}
            </a>
          ))}
        </nav>
      </div>
    )}
  </div>

  <div class="footer-bottom">
    <p>&copy; {year} [Your Name]. All rights reserved.</p>
    <p class="attribution">
      Built with <a href="https://astro.build" target="_blank" rel="noopener noreferrer">Astro</a>
    </p>
  </div>
</footer>

<style>
  .footer {
    background: var(--color-bg);
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    margin-top: 4rem;
  }

  [data-theme="dark"] .footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .gradient-divider {
    height: 2px;
    background: linear-gradient(
      to right,
      var(--color-accent),
      transparent 50%,
      var(--color-accent)
    );
  }

  .footer-content {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
  }

  .footer-section h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
    color: var(--color-text);
  }

  .footer-nav {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .footer-nav a {
    color: var(--color-muted);
    text-decoration: none;
    transition: color 0.3s;
  }

  .footer-nav a:hover {
    color: var(--color-accent);
  }

  .footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    gap: 2rem;
    flex-wrap: wrap;
  }

  [data-theme="dark"] .footer-bottom {
    border-top-color: rgba(255, 255, 255, 0.05);
  }

  .footer-bottom p {
    font-size: 0.875rem;
    color: var(--color-muted);
    margin: 0;
  }

  .attribution a {
    color: var(--color-accent);
    text-decoration: none;
  }

  .attribution a:hover {
    text-decoration: underline;
  }

  @media (max-width: 768px) {
    .footer-bottom {
      flex-direction: column;
      justify-content: center;
      text-align: center;
    }
  }
</style>
```

---

## Card Components: ArticleCard

Reusable card component with glass border effect, hover animations, and cursor-following zoom.

```astro
---
// src/components/ArticleCard.astro
interface Props {
  title: string;
  description: string;
  image: string;
  url: string;
  date: Date;
  tags?: string[];
}

const { title, description, image, url, date, tags = [] } = Astro.props;

const formattedDate = date.toLocaleDateString('en-AU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<a href={url} class="article-card">
  <div class="card-border"></div>

  <div class="card-image-wrapper">
    <img src={image} alt={title} class="card-image" />
    <div class="card-image-overlay"></div>
  </div>

  <div class="card-content">
    <h3 class="card-title">{title}</h3>
    <p class="card-description">{description}</p>

    {tags.length > 0 && (
      <div class="card-tags">
        {tags.map(tag => (
          <span class="tag">{tag}</span>
        ))}
      </div>
    )}

    <div class="card-footer">
      <time class="card-date" datetime={date.toISOString()}>
        {formattedDate}
      </time>
    </div>
  </div>
</a>

<style>
  .article-card {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 1rem;
    overflow: hidden;
    text-decoration: none;
    color: inherit;
    transition: transform 0.3s, box-shadow 0.3s;
    background: var(--color-bg);
  }

  .article-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  }

  [data-theme="dark"] .article-card:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  }

  /* Glass border effect */
  .card-border {
    position: absolute;
    inset: 0;
    border-radius: 1rem;
    padding: 1px;
    background: conic-gradient(
      from 0deg,
      var(--color-accent),
      rgb(100, 200, 255),
      var(--color-accent)
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    opacity: 0;
    transition: opacity 0.3s;
    pointer-events: none;
  }

  .article-card:hover .card-border {
    opacity: 1;
  }

  .card-image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }

  .article-card:hover .card-image {
    transform: scale(1.05);
  }

  .card-image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0.3)
    );
  }

  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: 600;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: -webkit-box;
    color: var(--color-text);
  }

  .card-description {
    font-size: 0.95rem;
    color: var(--color-muted);
    line-clamp: 2;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    display: -webkit-box;
  }

  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    display: inline-block;
    font-size: 0.75rem;
    padding: 0.375rem 0.75rem;
    background: rgba(0, 102, 204, 0.1);
    color: var(--color-accent);
    border-radius: 9999px;
    font-weight: 500;
  }

  [data-theme="dark"] .tag {
    background: rgba(0, 102, 255, 0.15);
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
    padding-top: 1rem;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  [data-theme="dark"] .card-footer {
    border-top-color: rgba(255, 255, 255, 0.05);
  }

  .card-date {
    font-size: 0.875rem;
    color: var(--color-muted);
  }
</style>

<script>
  function initCardZoom(card: HTMLElement) {
    const img = card.querySelector('.card-image') as HTMLImageElement;

    card.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (img) {
        img.style.transformOrigin = `${x}% ${y}%`;
      }
    });
  }

  document.querySelectorAll('.article-card').forEach(card => {
    initCardZoom(card as HTMLElement);
  });
</script>
```

---

## Dynamic Route Pages: articles/[slug].astro

Pattern for generating static pages from data with markdown rendering.

```astro
---
// src/pages/articles/[slug].astro
import BaseLayout from '../../layouts/BaseLayout.astro';
import { articles } from '../../data/articles';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

export function getStaticPaths() {
  return articles.map(article => ({
    params: { slug: article.slug },
    props: { article },
  }));
}

const { article } = Astro.props;

// Render markdown
const html = await marked(article.content);

// Sanitize HTML
const sanitized = sanitizeHtml(html, {
  allowedTags: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'span', 'em', 'strong', 'u', 's',
    'a', 'img', 'blockquote', 'code', 'pre',
    'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title'],
    code: ['class'],
    pre: ['class'],
  },
  allowedIframeHostnames: ['www.youtube.com', 'youtube.com', 'vimeo.com'],
});

// JSON-LD structured data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.excerpt,
  image: article.image,
  datePublished: article.date,
  author: {
    '@type': 'Person',
    name: '[Your Name]',
  },
};
---

<BaseLayout
  title={article.title}
  description={article.excerpt}
  image={article.image}
  type="article"
  publishedDate={article.date}
  canonicalUrl={`${import.meta.env.SITE}articles/${article.slug}`}
>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />

  <article class="article-container">
    <header class="article-header">
      <h1 class="article-title">{article.title}</h1>

      <div class="article-meta">
        <time datetime={article.date}>
          {new Date(article.date).toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>

        {article.tags && (
          <div class="article-tags">
            {article.tags.map(tag => (
              <span class="article-tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </header>

    {article.image && (
      <img
        src={article.image}
        alt={article.title}
        class="article-image"
      />
    )}

    <div class="prose" set:html={sanitized} />

    <footer class="article-footer">
      <a href="/articles" class="back-link">← Back to articles</a>
    </footer>
  </article>
</BaseLayout>

<style>
  .article-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem;
  }

  .article-header {
    margin-bottom: 2rem;
  }

  .article-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--color-text);
    margin-bottom: 1rem;
    line-height: 1.2;
  }

  .article-meta {
    display: flex;
    gap: 2rem;
    align-items: center;
    flex-wrap: wrap;
    color: var(--color-muted);
    font-size: 0.95rem;
  }

  .article-tags {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .article-tag {
    padding: 0.35rem 0.75rem;
    background: rgba(0, 102, 204, 0.1);
    color: var(--color-accent);
    border-radius: 9999px;
    font-size: 0.85rem;
  }

  .article-image {
    width: 100%;
    height: auto;
    border-radius: 1rem;
    margin: 2rem 0;
    max-height: 500px;
    object-fit: cover;
  }

  .article-footer {
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
  }

  [data-theme="dark"] .article-footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .back-link {
    color: var(--color-accent);
    text-decoration: none;
    transition: text-decoration 0.3s;
  }

  .back-link:hover {
    text-decoration: underline;
  }
</style>
```

---

## Prose Styling

CSS for rendered markdown content with semantic styling for all elements.

```css
/* src/styles/prose.css */

.prose {
  max-width: 72ch;
  margin: 0 auto;
  line-height: 1.75;
}

.prose h1,
.prose h2,
.prose h3,
.prose h4,
.prose h5,
.prose h6 {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 600;
  line-height: 1.3;
  color: var(--color-text);
}

.prose h1 {
  font-size: 2rem;
}

.prose h2 {
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  padding-bottom: 0.5em;
}

[data-theme="dark"] .prose h2 {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.prose h3 {
  font-size: 1.25rem;
}

.prose h4,
.prose h5,
.prose h6 {
  font-size: 1rem;
}

.prose p {
  margin: 1em 0;
}

.prose a {
  color: var(--color-accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.3s;
}

.prose a:hover {
  border-bottom-color: var(--color-accent);
}

.prose strong {
  font-weight: 600;
  color: var(--color-text);
}

.prose em {
  font-style: italic;
  color: var(--color-muted);
}

.prose blockquote {
  border-left: 4px solid var(--color-accent);
  padding-left: 1em;
  margin: 1.5em 0;
  font-style: italic;
  color: var(--color-muted);
}

.prose code {
  font-family: 'Monaco', 'Courier New', monospace;
  font-size: 0.9em;
  background: rgba(0, 0, 0, 0.05);
  color: var(--color-accent);
  padding: 0.2em 0.4em;
  border-radius: 0.3em;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .prose code {
  background: rgba(0, 102, 255, 0.1);
  border-color: rgba(0, 102, 255, 0.2);
}

.prose pre {
  background: rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 1.5em;
  border-radius: 0.75em;
  overflow-x: auto;
  margin: 1.5em 0;
  line-height: 1.5;
}

[data-theme="dark"] .prose pre {
  background: rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.1);
}

.prose pre code {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  font-size: 0.95em;
}

.prose ul,
.prose ol {
  margin: 1em 0;
  padding-left: 2em;
}

.prose li {
  margin: 0.5em 0;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5em 0;
}

.prose th,
.prose td {
  padding: 0.75em;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] .prose th,
[data-theme="dark"] .prose td {
  border-bottom-color: rgba(255, 255, 255, 0.1);
}

.prose th {
  font-weight: 600;
  background: rgba(0, 0, 0, 0.03);
}

[data-theme="dark"] .prose th {
  background: rgba(255, 255, 255, 0.03);
}

.prose img {
  max-width: 100%;
  height: auto;
  border-radius: 0.75em;
  margin: 1.5em 0;
}

.prose hr {
  border: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  margin: 2em 0;
}

[data-theme="dark"] .prose hr {
  border-top-color: rgba(255, 255, 255, 0.1);
}
```

---

## Activity/Content Filtering (Client-Side)

Pattern for filterable grids with URL deep-linking support.

```astro
---
// src/components/FilterableGrid.astro
interface Props {
  items: any[];
  filterKey: string;
}

const { items, filterKey } = Astro.props;

// Get unique filter values
const filterValues = [...new Set(items.flatMap(item => item[filterKey] || []))].sort();
---

<div class="filterable-grid">
  <div class="filter-controls">
    <button class="filter-btn active" data-filter="all">
      All <span class="count-badge">{items.length}</span>
    </button>
    {filterValues.map(value => {
      const count = items.filter(item =>
        Array.isArray(item[filterKey])
          ? item[filterKey].includes(value)
          : item[filterKey] === value
      ).length;
      return (
        <button class="filter-btn" data-filter={value}>
          {value} <span class="count-badge">{count}</span>
        </button>
      );
    })}
  </div>

  <div id="grid" class="items-grid">
    <slot />
  </div>

  <div id="no-results" class="no-results" style="display: none;">
    <p>No items found for this filter.</p>
    <button id="clear-filters" class="clear-btn">Clear filters</button>
  </div>
</div>

<style>
  .filterable-grid {
    width: 100%;
  }

  .filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  .filter-btn {
    padding: 0.5rem 1rem;
    border: 2px solid rgba(0, 0, 0, 0.1);
    background: transparent;
    color: var(--color-text);
    border-radius: 9999px;
    cursor: pointer;
    transition: all 0.3s;
    font-weight: 500;
  }

  [data-theme="dark"] .filter-btn {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .filter-btn:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .filter-btn.active {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }

  .count-badge {
    display: inline-block;
    margin-left: 0.5rem;
    padding: 0.2rem 0.5rem;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 0.25rem;
    font-size: 0.85rem;
  }

  .filter-btn.active .count-badge {
    background: rgba(255, 255, 255, 0.4);
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .items-grid.filtered {
    animation: fadeIn 0.3s;
  }

  @keyframes fadeIn {
    from {
      opacity: 0.5;
    }
    to {
      opacity: 1;
    }
  }

  .no-results {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem;
    color: var(--color-muted);
  }

  .clear-btn {
    margin-top: 1rem;
    padding: 0.5rem 1.5rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: opacity 0.3s;
  }

  .clear-btn:hover {
    opacity: 0.9;
  }
</style>

<script>
  function initFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gridItems = document.querySelectorAll('[data-filter-values]');
    const grid = document.getElementById('grid');
    const noResults = document.getElementById('no-results');
    const clearBtn = document.getElementById('clear-filters');

    const params = new URLSearchParams(window.location.search);
    const initialFilter = params.get('filter') || 'all';

    function applyFilter(filter: string) {
      let visibleCount = 0;

      gridItems.forEach(item => {
        const values = (item.getAttribute('data-filter-values') || '').split(',');
        const show = filter === 'all' || values.includes(filter);
        (item as HTMLElement).style.display = show ? '' : 'none';
        if (show) visibleCount++;
      });

      // Update active button
      filterBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
      });

      // Show/hide no results
      if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
      }

      // Update URL
      if (filter === 'all') {
        window.history.replaceState({}, '', window.location.pathname);
      } else {
        window.history.replaceState({}, '', `?filter=${filter}`);
      }
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        applyFilter(btn.getAttribute('data-filter') || '');
      });
    });

    clearBtn?.addEventListener('click', () => {
      applyFilter('all');
    });

    // Apply initial filter from URL
    applyFilter(initialFilter);
  }

  initFilter();
</script>
```

---

## Carousel/Slider

Vanilla JavaScript carousel with smooth scrolling and button state management.

```astro
---
// src/components/Carousel.astro
interface Props {
  title?: string;
}

const { title } = Astro.props;
---

<div class="carousel-container">
  {title && <h2 class="carousel-title">{title}</h2>}

  <div class="carousel-wrapper">
    <button
      id="carousel-prev"
      class="carousel-btn carousel-prev"
      aria-label="Previous slide"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
    </button>

    <div id="carousel-scroll" class="carousel-scroll">
      <slot />
    </div>

    <button
      id="carousel-next"
      class="carousel-btn carousel-next"
      aria-label="Next slide"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</div>

<style>
  .carousel-container {
    width: 100%;
  }

  .carousel-title {
    font-size: 1.75rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    color: var(--color-text);
  }

  .carousel-wrapper {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .carousel-scroll {
    flex: 1;
    display: flex;
    gap: 1.5rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    /* Hide scrollbar */
    scrollbar-width: none;
  }

  .carousel-scroll::-webkit-scrollbar {
    display: none;
  }

  .carousel-scroll > * {
    flex: 0 0 auto;
    width: clamp(280px, 30vw, 400px);
    scroll-snap-align: start;
  }

  .carousel-btn {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(0, 0, 0, 0.1);
    background: var(--color-bg);
    color: var(--color-text);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;
  }

  [data-theme="dark"] .carousel-btn {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .carousel-btn:hover:not(:disabled) {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }

  .carousel-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    .carousel-btn {
      width: 36px;
      height: 36px;
    }

    .carousel-scroll > * {
      width: clamp(250px, 80vw, 350px);
    }
  }
</style>

<script>
  function initCarousel() {
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const carousel = document.getElementById('carousel-scroll');

    if (!carousel) return;

    const scrollAmount = 400;

    function updateButtons() {
      const atStart = carousel.scrollLeft === 0;
      const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 10;

      prevBtn?.setAttribute('disabled', atStart ? 'true' : 'false');
      nextBtn?.setAttribute('disabled', atEnd ? 'true' : 'false');
    }

    prevBtn?.addEventListener('click', () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });

    nextBtn?.addEventListener('click', () => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    carousel.addEventListener('scroll', updateButtons);
    window.addEventListener('resize', updateButtons);

    // Initial state
    setTimeout(updateButtons, 100);
  }

  initCarousel();
</script>
```

---

## Contact Forms

Formspree integration pattern with client-side validation and honeypot spam prevention.

```astro
---
// src/components/ContactForm.astro
---

<form id="contact-form" class="contact-form" method="POST" action="https://formspree.io/f/[your-form-id]">
  <!-- Honeypot field for spam prevention -->
  <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off" />

  <div class="form-group">
    <label for="name" class="form-label">Name *</label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="form-input"
      placeholder="Your name"
    />
    <span class="error-message" id="name-error"></span>
  </div>

  <div class="form-group">
    <label for="email" class="form-label">Email *</label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="form-input"
      placeholder="your@email.com"
    />
    <span class="error-message" id="email-error"></span>
  </div>

  <div class="form-group">
    <label for="message" class="form-label">Message *</label>
    <textarea
      id="message"
      name="message"
      required
      rows="6"
      class="form-input"
      placeholder="Your message here..."
    ></textarea>
    <span class="error-message" id="message-error"></span>
  </div>

  <button type="submit" class="submit-btn">Send Message</button>

  <div id="success-message" class="success-message" style="display: none;">
    <p>Thanks for your message!</p>
  </div>
</form>

<style>
  .contact-form {
    max-width: 600px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-label {
    font-weight: 500;
    color: var(--color-text);
  }

  .form-input {
    padding: 0.75rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    background: var(--color-bg);
    color: var(--color-text);
    font-family: inherit;
    font-size: 1rem;
    transition: border-color 0.3s;
  }

  [data-theme="dark"] .form-input {
    border-color: rgba(255, 255, 255, 0.1);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
  }

  .form-input.error {
    border-color: #ef4444;
  }

  .error-message {
    font-size: 0.85rem;
    color: #ef4444;
    display: none;
  }

  .form-input.error + .error-message {
    display: block;
  }

  .submit-btn {
    padding: 0.75rem 1.5rem;
    background: var(--color-accent);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.3s;
    margin-top: 1rem;
  }

  .submit-btn:hover {
    opacity: 0.9;
  }

  .submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .success-message {
    padding: 1rem;
    background: rgba(34, 197, 94, 0.1);
    border: 1px solid #22c55e;
    border-radius: 0.5rem;
    color: #16a34a;
    text-align: center;
  }
</style>

<script>
  function initForm() {
    const form = document.getElementById('contact-form') as HTMLFormElement;
    if (!form) return;

    const nameInput = document.getElementById('name') as HTMLInputElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const messageInput = document.getElementById('message') as HTMLTextAreaElement;
    const successMsg = document.getElementById('success-message');

    function validateField(field: HTMLInputElement | HTMLTextAreaElement) {
      const errorId = `${field.id}-error`;
      const errorEl = document.getElementById(errorId);
      let isValid = true;
      let message = '';

      if (field.type === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
          isValid = false;
          message = 'Please enter a valid email address';
        }
      } else if (!field.value.trim()) {
        isValid = false;
        message = 'This field is required';
      }

      field.classList.toggle('error', !isValid);
      if (errorEl) errorEl.textContent = message;

      return isValid;
    }

    [nameInput, emailInput, messageInput].forEach(field => {
      field.addEventListener('blur', () => validateField(field));
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isMessageValid = validateField(messageInput);

      if (!isNameValid || !isEmailValid || !isMessageValid) return;

      // Form submission handled by Formspree
      form.submit();
    });
  }

  initForm();
</script>
```

---

## 404 Page

Friendly 404 page with consistent styling.

```astro
---
// src/pages/404.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page Not Found" description="This page could not be found.">
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-message">
        Oops! The page you're looking for doesn't exist.
      </p>
      <a href="/" class="back-home-btn">← Back to Home</a>
    </div>
  </div>
</BaseLayout>

<style>
  .not-found-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60vh;
    padding: 2rem;
  }

  .not-found-content {
    text-align: center;
    max-width: 600px;
  }

  .not-found-title {
    font-size: 6rem;
    font-weight: bold;
    color: var(--color-accent);
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--color-accent), #7c3aed);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .not-found-message {
    font-size: 1.25rem;
    color: var(--color-muted);
    margin-bottom: 2rem;
  }

  .back-home-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--color-accent);
    color: white;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.3s;
  }

  .back-home-btn:hover {
    opacity: 0.9;
  }
</style>
```

---

## Key Patterns Summary

### Theme System
- Inline script in BaseLayout checks localStorage and `prefers-color-scheme`
- Sets `data-theme` attribute on `<html>` before DOM renders
- CSS variables adapt to theme: `--color-bg`, `--color-text`, `--color-accent`, `--color-muted`

### Navigation
- Active state detection based on `Astro.url.pathname`
- Mobile menu uses slide-in animation
- Keyboard support: Escape to close mobile menu
- All interactivity via inline JavaScript

### Data-Driven Components
- Use `data-*` attributes for filtering and sorting
- Preserve filter state in URL parameters
- Count badges update dynamically

### Content Rendering
- Markdown via `marked` library
- HTML sanitization with `sanitize-html` (allows semantic HTML, links, images)
- JSON-LD structured data for SEO

### Animations
- Staggered grid entrance animations
- Hover scale/translateY effects
- Smooth scroll behavior for carousels
- CSS transitions for theme changes

### Accessibility
- Semantic HTML (`<article>`, `<main>`, `<nav>`, `<time>`)
- ARIA labels for interactive controls
- Skip-to-main-content link
- Keyboard navigation support

**Note:** Replace the Formspree form ID in the contact form (`[your-form-id]`) with your actual ID from your Formspree account.
