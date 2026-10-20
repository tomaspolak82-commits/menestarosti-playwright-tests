import { pages } from './pages';

export const site = {
  sitemapIndexPath: '/sitemap_index.xml',
  samplePages: [pages.home, pages.passwordArticle, pages.games, pages.contact],
  // from: old address that must keep redirecting, so it stays as text here.
  redirects: [{ from: '/kontakt/', to: pages.contact }],
  // Deliberately non-existent address, not a page.
  notFoundPath: '/tato-stranka-neexistuje-automaticky-test/',
  // Below this window width the theme shows the mobile header with the menu drawer (Kadence CSS, checked 2026-10-19).
  mobileHeaderBreakpointPx: 1040,
  analyticsUrlPattern: 'google-analytics\\.com|googletagmanager\\.com',
  // Tests are deliberately slowed down: the live site stopped responding under full-speed runs (2026-10-17).
  throttle: {
    requestDelayMs: 1500,
    browserTestDelayMs: 3000,
  },
} as const;
