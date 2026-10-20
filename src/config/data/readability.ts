import { pages } from './pages';

// Limits for US-004. Values are in the requirement too (for people); keep both in sync.
export const readability = {
  pages: [pages.home, pages.passwordArticle, pages.articles, pages.contact, pages.games, pages.downloads],
  // Browser zoom 200 % in a 1280 px window lays the page out like a 640 px window (Playwright has no zoom API).
  zoom200Viewport: { width: 640, height: 720 },
  // WCAG 1.4.10 reflow width.
  narrowViewport: { width: 320, height: 720 },
  minTextFontPx: 18,
  // Shorter paragraphs are labels or captions, not body text.
  minParagraphChars: 40,
  // Smallest size measured on 2026-10-19 in each group (Tomáš: "at least as large as today").
  minTargetPx: { actionButton: 42, menuLink: 36, footerLink: 22 },
  // WCAG 2.5.5 (AAA): smaller targets are only reported.
  recommendedTargetPx: 44,
  // Browser default font size and an enlarged setting (150 %) for AK6.
  defaultFontPx: 16,
  enlargedFontPx: 24,
  // axe-core rule ids: 4.5:1 (WCAG 1.4.3, AA) fails the test, 7:1 (WCAG 1.4.6, AAA) is only reported.
  contrastRule: 'color-contrast',
  enhancedContrastRule: 'color-contrast-enhanced',
} as const;
