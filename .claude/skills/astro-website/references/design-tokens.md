# Design System Reference

## Philosophy

**Barely-there UI with controlled boldness.** Minimal chrome, maximum breathing room for content. The design should disappear to reveal the ideas. Intentional use of accent colors and typography hierarchy to guide attention without distraction.

---

## Color Palettes

Choose one palette per project based on content tone and audience.

### Option A: Dark Mode (Default)

```css
:root[data-theme="dark-a"] {
  --bg: #0a0f0f;
  --bg-elevated: #141a1a;
  --bg-card: #1a2626;
  --text: #f5f5f5;
  --text-muted: #a0a8a8;
  --accent: #2dd4a8;
  --accent-hover: #1bae86;
  --accent-secondary: #f59e0b;
  --border: #2a3535;
  --border-light: #1a2626;
}
```

**Visual Character:** Cool, sophisticated, modern. Emerald accent conveys growth and learning; amber secondary provides warmth for CTAs.

---

### Option B: Dark Mode Editorial

```css
:root[data-theme="dark-b"] {
  --bg: #0a0a10;
  --bg-elevated: #13131f;
  --bg-card: #1a1a2e;
  --text: #f5f5f7;
  --text-muted: #9ca3af;
  --accent: #8b5cf6;
  --accent-hover: #7c3aed;
  --accent-secondary: #3b82f6;
  --border: #2a2a3e;
  --border-light: #1a1a2e;
}
```

**Visual Character:** Deep, introspective. Purple accent suggests depth and reflection; blue secondary adds technical credibility.

---

### Option C: Light Mode Warm

```css
:root[data-theme="light-c"] {
  --bg: #fafaf8;
  --bg-elevated: #ffffff;
  --bg-card: #f3f0ed;
  --text: #1f2019;
  --text-muted: #6b6b63;
  --accent: #4f46e5;
  --accent-hover: #4338ca;
  --accent-secondary: #ec4899;
  --border: #e2e8f0;
  --border-light: #f3f0ed;
}
```

**Visual Character:** Warm, accessible. Indigo accent conveys intelligence; subtle cream tones keep it approachable.

---

## Typography

Select one option per project. All options use system fallbacks for performance.

### Option A: Clean Modern (Recommended Default)
Inter for display and body — contemporary, excellent readability.

```css
:root[data-font="option-a"] {
  --font-display: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-body: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

### Option B: Editorial Feel
Playfair Display for display (serif), Source Sans 3 or Source Serif 4 for body. Conveys authority and tradition.

```css
:root[data-font="option-b"] {
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Source Sans 3", -apple-system, BlinkMacSystemFont, sans-serif;
  /* Alternative: "Source Serif 4" for body if more formality needed */
}
```

### Option C: Technical
Space Grotesk for display (geometric clarity), DM Sans for body (highly legible).

```css
:root[data-font="option-c"] {
  --font-display: "Space Grotesk", -apple-system, BlinkMacSystemFont, sans-serif;
  --font-body: "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

### Typography Hierarchy

```css
/* Headings */
h1 {
  font: 700 clamp(2.5rem, 8vw, 5rem) / 1.1 var(--font-display);
  letter-spacing: -0.02em;
}

h2 {
  font: 700 clamp(1.75rem, 4vw, 2.5rem) / 1.2 var(--font-display);
  letter-spacing: -0.01em;
}

h3 {
  font: 700 1.25rem / 1.3 var(--font-display);
  letter-spacing: 0;
}

h4, h5, h6 {
  font: 700 1rem / 1.4 var(--font-body);
}

/* Body */
body, p {
  font: 400 1rem / 1.6 var(--font-body);
  color: var(--text);
}

/* Smaller text */
small, .text-small {
  font-size: 0.875rem;
  line-height: 1.5;
}

/* Tags, labels, caps */
.tag, .label, .cap {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 600;
}

/* Link styling */
a {
  color: var(--accent);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color var(--transition-fast), border-color var(--transition-fast);
}

a:hover {
  color: var(--accent-hover);
  border-bottom: 1px solid var(--accent);
}

/* Code blocks */
code {
  font-family: "Fira Code", "Monaco", monospace;
  font-size: 0.875em;
}

pre code {
  font-size: 0.75rem;
}
```

---

## Spacing Scale

Consistent rhythm across all projects. Use CSS custom properties:

```css
:root {
  --space-xs: 0.5rem;   /* 8px */
  --space-sm: 1rem;     /* 16px */
  --space-md: 1.5rem;   /* 24px */
  --space-lg: 3rem;     /* 48px */
  --space-xl: 6rem;     /* 96px */
}
```

**Usage Examples:**
- Padding inside cards: `--space-md` to `--space-lg`
- Margin between sections: `--space-lg` to `--space-xl`
- Gaps in grids: `--space-md` to `--space-lg`
- Padding around body text: `--space-md`

---

## Animation & Transitions

```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --transition-fast: 0.2s var(--ease-out);
  --transition: 0.4s var(--ease-out);
  --transition-slow: 0.6s var(--ease-out);
}

/* Reduce motion for accessible users */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Guidance:** Use `--transition-fast` for hover states, `--transition` for navigation transitions, `--transition-slow` for entrance animations.

---

## Glass Border Effect

Full CSS pattern for a signature conic gradient border. Use on high-emphasis cards or featured sections.

```css
.glass-border {
  position: relative;
  background: var(--bg-card);
  border-radius: 16px;
  padding: 1px; /* Border thickness */
  overflow: hidden;

  /* Prevent pseudo-element overflow */
  &::before {
    content: "";
    position: absolute;
    inset: 0; /* Top, right, bottom, left all 0 */
    border-radius: 16px;
    background: conic-gradient(
      from 45deg at 50% 50%,
      var(--accent) 0deg,
      var(--accent-secondary) 60deg,
      var(--accent) 120deg,
      transparent 180deg
    );
    opacity: 0.5;
    -webkit-mask-image: radial-gradient(
      circle at 50% 50%,
      black 0%,
      transparent 100%
    );
    mask-image: radial-gradient(
      circle at 50% 50%,
      black 0%,
      transparent 100%
    );
    pointer-events: none;
    animation: rotate 8s linear infinite;
  }

  /* Inner container */
  > * {
    position: relative;
    z-index: 1;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
```

**Application:** Wrap content in `.glass-border` for featured article cards, primary CTAs, or key sections. The gradient border appears as a subtle shimmer.

---

## Card Hover States

Two primary patterns. Choose based on card content:

### Pattern A: Scale & Lift (For image-heavy cards)

```css
.card-hover-a {
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: var(--space-md);
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: pointer;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 40px rgba(45, 212, 168, 0.15); /* Uses accent color */
  }
}
```

### Pattern B: Lift & Shadow (For text-heavy cards)

```css
.card-hover-b {
  border-radius: 16px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  padding: var(--space-md);
  transition: transform var(--transition), box-shadow var(--transition);
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 32px rgba(0, 0, 0, 0.3);
  }
}
```

**Recommendation:** Use Pattern A for article previews with hero images. Use Pattern B for text-based content cards.

---

## Cursor-Following Image Zoom

Advanced pattern for interactive image cards. Creates a zoom effect that follows cursor position within the card.

```css
.cursor-card {
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  width: 100%;
  height: 280px;
}

.cursor-card img {
  position: absolute;
  width: 120%;
  height: 120%;
  object-fit: cover;
  transition: transform var(--transition-fast);
  left: -10%;
  top: -10%;
}

.cursor-card:hover img {
  transform: scale(1.1);
}
```

**JavaScript Implementation:**

```javascript
document.querySelectorAll(".cursor-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize to -1 to 1 range
    const normalizedX = (x / rect.width) * 2 - 1;
    const normalizedY = (y / rect.height) * 2 - 1;

    // Calculate zoom offset (0 to 20%)
    const offsetX = normalizedX * 5;
    const offsetY = normalizedY * 5;

    const img = card.querySelector("img");
    img.style.transform = `translate(${offsetX}%, ${offsetY}%) scale(1.1)`;
  });

  card.addEventListener("mouseleave", () => {
    const img = card.querySelector("img");
    img.style.transform = "translate(0, 0) scale(1)";
  });
});
```

**Use Case:** Feature cards with layered text overlay where subtle interactivity enhances engagement without distraction.

---

## Gradient Patterns

### Card Overlay (Bottom-Up Text Protection)

Protects white text over images using a transparent-to-opaque gradient:

```css
.card-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0.7) 100%);
  pointer-events: none;
  border-radius: 16px;
}
```

### Divider Line Gradient

Horizontal rule with color transition:

```css
.divider-gradient {
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--accent) 50%,
    transparent 100%
  );
  border: none;
  margin: var(--space-lg) 0;
}
```

### Hero Gradient Background

Large section backgrounds with directional color flow:

```css
.hero-gradient {
  background: linear-gradient(135deg, var(--bg) 0%, #1a3a3a 50%, var(--bg) 100%);
  position: relative;
}

/* Optional: Radial accent in top-right */
.hero-gradient::before {
  content: "";
  position: absolute;
  top: -200px;
  right: -200px;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--accent) 0%, transparent 70%);
  opacity: 0.05;
  pointer-events: none;
}
```

### Gradient Text

Colored text using CSS background-clip:

```css
.gradient-text {
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

**Usage:** Primary headlines, key CTAs, section titles.

---

## Border Radius

Consistent corner softness across components:

```css
:root {
  --radius-card: 16px;        /* Cards, boxes */
  --radius-button: 100px;     /* Buttons, pills */
  --radius-small: 4px;        /* Tiny elements */
  --radius-medium: 8px;       /* Form inputs */
}

/* Component examples */
.card {
  border-radius: var(--radius-card);
}

button, .btn {
  border-radius: var(--radius-button);
}

input, select, textarea {
  border-radius: var(--radius-medium);
}

.badge {
  border-radius: var(--radius-button);
}
```

---

## Responsive Breakpoints

Design mobile-first, enhance at larger screens:

```css
/* Breakpoints (mobile-first) */
@media (min-width: 480px) {
  /* Small mobile adjustments (larger phones) */
}

@media (min-width: 640px) {
  /* Tablet */
}

@media (min-width: 768px) {
  /* Small desktop */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Wide desktop */
}

@media (min-width: 1920px) {
  /* Extra wide screens */
}
```

**Responsive Spacing:** Use clamp() for automatic scaling:

```css
body {
  padding: clamp(1rem, 5vw, 2rem);
}

section {
  margin-block: clamp(2rem, 8vw, 6rem);
}
```

**Responsive Typography:** Already defined with clamp() in heading hierarchy.

---

## Accessibility

### Skip Link Pattern

Allow keyboard users to bypass navigation:

```html
<!-- Place at top of body -->
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent);
  color: var(--bg);
  padding: 0.5rem 1rem;
  text-decoration: none;
  border-radius: var(--radius-button);
  z-index: 100;

  &:focus {
    top: 0;
  }
}
```

### Focus-Visible Outline

Visible focus indicator for keyboard navigation:

```css
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: var(--radius-small);
}

/* Remove for mouse users (optional enhancement) */
*:focus:not(:focus-visible) {
  outline: none;
}
```

### Prefers Reduced Motion

Respect user motion preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Only (sr-only)

Hide content visually but keep accessible to screen readers:

```css
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
```

**Usage Example:**
```html
<button>
  <svg aria-hidden="true"><!-- menu icon --></svg>
  <span class="sr-only">Open navigation menu</span>
</button>
```

### Form Accessibility

```css
label {
  display: block;
  margin-bottom: var(--space-xs);
  font: 600 0.875rem var(--font-body);
  color: var(--text);
}

input,
select,
textarea {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--border);
  border-radius: var(--radius-medium);
  font: 1rem var(--font-body);
  color: var(--text);
  background: var(--bg-elevated);
  transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(45, 212, 168, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

textarea {
  resize: vertical;
  min-height: 120px;
}
```

---

## Theme Toggle & Persistence

### HTML Attribute System

Use `data-theme` attribute on `<html>` element:

```html
<html data-theme="dark-a">
  <!-- content -->
</html>
```

### CSS Implementation

```css
:root[data-theme="dark-a"] {
  --bg: #0a0f0f;
  --text: #f5f5f5;
  /* ...other vars */
}

:root[data-theme="light-c"] {
  --bg: #fafaf8;
  --text: #1f2019;
  /* ...other vars */
}
```

### localStorage Persistence

Store user preference without page jump:

```javascript
// Set in localStorage
function setTheme(themeName) {
  document.documentElement.setAttribute("data-theme", themeName);
  localStorage.setItem("preferred-theme", themeName);
}

// Retrieve on page load
function loadTheme() {
  const saved = localStorage.getItem("preferred-theme");
  if (saved) {
    document.documentElement.setAttribute("data-theme", saved);
  }
}
```

### Head Script (Prevent Flash)

Place this in `<head>` **before** CSS loads to prevent theme flash:

```html
<script>
  (function () {
    const saved = localStorage.getItem("preferred-theme");
    const theme = saved || "dark-a"; // default theme
    document.documentElement.setAttribute("data-theme", theme);
  })();
</script>
```

### Theme Toggle Component

```html
<button id="theme-toggle" aria-label="Toggle theme">
  <svg class="icon-light" aria-hidden="true"><!-- sun icon --></svg>
  <svg class="icon-dark" aria-hidden="true"><!-- moon icon --></svg>
</button>

<script>
  const toggle = document.getElementById("theme-toggle");
  const html = document.documentElement;

  toggle.addEventListener("click", () => {
    const current = html.getAttribute("data-theme");
    const next = current === "dark-a" ? "light-c" : "dark-a";
    setTheme(next);
  });
</script>
```

---

## Component Patterns

### Button Styles

```css
button, .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius-button);
  font: 600 1rem var(--font-body);
  color: var(--bg);
  background: var(--accent);
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(45, 212, 168, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
}

.btn-secondary {
  color: var(--accent);
  background: transparent;
  border: 1px solid var(--accent);

  &:hover {
    background: var(--accent);
    color: var(--bg);
  }
}
```

### Article Meta

```css
.article-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-bottom: var(--space-md);
  font-size: 0.875rem;
  color: var(--text-muted);

  > * + * {
    padding-left: var(--space-sm);
    border-left: 1px solid var(--border);
  }
}
```

### Navigation

```css
nav {
  display: flex;
  gap: var(--space-lg);
  font: 500 1rem var(--font-body);

  a {
    position: relative;
    color: var(--text);
    border-bottom: none;

    &::after {
      content: "";
      position: absolute;
      bottom: -4px;
      left: 0;
      width: 0;
      height: 2px;
      background: var(--accent);
      transition: width var(--transition-fast);
    }

    &:hover::after,
    &.active::after {
      width: 100%;
    }
  }
}
```

---

## Usage Guidelines

### Selecting a Palette
- **Option A (Dark Emerald):** Default for most educational/modern sites. Warm and inviting.
- **Option B (Dark Purple):** For more philosophical, introspective content. Use when depth/reflection is central.
- **Option C (Light Warm):** When accessibility or daytime context requires it.

### Selecting Typography
- **Option A (Inter):** Default. Fast, modern, universally readable. Use 90% of the time.
- **Option B (Playfair + Source Sans):** For editorial, long-form content with thought-leadership tone.
- **Option C (Space Grotesk + DM Sans):** For technical, code-heavy, or developer-audience content.

### Animation Budget
Use animations sparingly. The "barely-there UI" philosophy means:
- Hover states: Always use `--transition-fast` (0.2s)
- Page transitions: `--transition` (0.4s)
- Entrance animations: Only on first viewport entry, `--transition-slow` (0.6s)
- Avoid: Multiple simultaneous animations, spinning loaders, bouncing text

### Content-First Approach
The design system exists to support content, not decorate it. When adding visual effects:
1. Does it clarify the message?
2. Does it improve readability?
3. Does it guide attention to important content?

If the answer is "no," remove it.

---

## Implementation Checklist

When building a new site:

- [ ] Choose color palette (A/B/C) and set `:root[data-theme]` variables
- [ ] Choose typography option and load fonts
- [ ] Implement spacing scale as CSS custom properties
- [ ] Set responsive breakpoints in layout wrapper
- [ ] Add accessibility primitives (skip link, focus-visible, sr-only)
- [ ] Implement theme toggle with localStorage persistence
- [ ] Create card components with appropriate hover states
- [ ] Set up responsive typography with clamp()
- [ ] Test with prefers-reduced-motion enabled
- [ ] Test focus navigation with keyboard
- [ ] Audit with Lighthouse & WAVE accessibility tools

---

## Resources & References

**Font Pairing Inspiration:**
- Inter: Open-source, excellent at all sizes (https://rsms.me/inter/)
- Playfair Display: Google Fonts serif display (https://fonts.google.com/specimen/Playfair+Display)
- Source Sans / Source Serif: Adobe open-source family (https://github.com/adobe-fonts/source-sans)
- Space Grotesk: Geometric clarity (https://fonts.google.com/specimen/Space+Grotesk)
- DM Sans: Geometric humanist (https://fonts.google.com/specimen/DM+Sans)

**Tools & Utilities:**
- Easing functions visualizer: https://easings.net/
- Color contrast checker: https://webaim.org/resources/contrastchecker/
- Responsive design tester: Built into browser DevTools
- Accessibility audit: WAVE (https://wave.webaim.org/)
