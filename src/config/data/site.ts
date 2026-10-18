import { pages } from './pages';

export const site = {
  sitemapIndexPath: '/sitemap_index.xml',
  samplePages: [pages.home, pages.passwordArticle, pages.games, pages.contact],
  // from: old address that must keep redirecting, so it stays as text here.
  redirects: [{ from: '/kontakt/', to: pages.contact }],
  // Deliberately non-existent address, not a page.
  notFoundPath: '/tato-stranka-neexistuje-automaticky-test/',
  analyticsUrlPattern: 'google-analytics\\.com|googletagmanager\\.com',
  // Tests are deliberately slowed down: the live site stopped responding under full-speed runs (2026-10-17).
  throttle: {
    requestDelayMs: 1500,
    browserTestDelayMs: 3000,
  },
} as const;
