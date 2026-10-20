import { test as base } from '@playwright/test';
import { site } from './config/data/site';
import { pause } from './utils/throttle';
import { ArticlePage } from './pages/ArticlePage';
import { ContactPage } from './pages/ContactPage';
import { ContentPage } from './pages/ContentPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { GamesPage } from './pages/GamesPage';
import { PuzzlePage } from './pages/PuzzlePage';
import { ScamGamePage } from './pages/ScamGamePage';
import { Footer } from './pages/components/Footer';
import { Keyboard } from './pages/components/Keyboard';
import { MainMenu } from './pages/components/MainMenu';
import { Readability } from './pages/components/Readability';

type PageFixtures = {
  articlePage: ArticlePage;
  contentPage: ContentPage;
  contactPage: ContactPage;
  downloadsPage: DownloadsPage;
  gamesPage: GamesPage;
  puzzlePage: PuzzlePage;
  scamGamePage: ScamGamePage;
  mainMenu: MainMenu;
  footer: Footer;
  keyboard: Keyboard;
  readability: Readability;
};

export const test = base.extend<PageFixtures>({
  // Tests must not show up as visitors in the site statistics.
  page: async ({ page }, use) => {
    await page.route(new RegExp(site.analyticsUrlPattern), (route) => route.abort());
    await use(page);
    // Deliberate pause between browser tests to keep the load on the live site low.
    await pause(site.throttle.browserTestDelayMs);
  },
  articlePage: async ({ page }, use) => use(new ArticlePage(page)),
  contentPage: async ({ page }, use) => use(new ContentPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  downloadsPage: async ({ page }, use) => use(new DownloadsPage(page)),
  gamesPage: async ({ page }, use) => use(new GamesPage(page)),
  puzzlePage: async ({ page }, use) => use(new PuzzlePage(page)),
  scamGamePage: async ({ page }, use) => use(new ScamGamePage(page)),
  // A narrow desktop window (e.g. simulated 200 % zoom) gets the mobile header too.
  mainMenu: async ({ page, isMobile, viewport }, use) =>
    use(new MainMenu(page, isMobile || (viewport?.width ?? 0) < site.mobileHeaderBreakpointPx)),
  footer: async ({ page }, use) => use(new Footer(page)),
  keyboard: async ({ page }, use) => use(new Keyboard(page)),
  readability: async ({ page }, use) => use(new Readability(page)),
});
export { expect } from '@playwright/test';
