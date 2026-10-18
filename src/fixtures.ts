import { test as base } from '@playwright/test';
import site from './config/data/site.json';
import { pause } from './utils/throttle';
import { ContactPage } from './pages/ContactPage';
import { ContentPage } from './pages/ContentPage';
import { Footer } from './pages/components/Footer';
import { MainMenu } from './pages/components/MainMenu';

type PageFixtures = {
  contentPage: ContentPage;
  contactPage: ContactPage;
  mainMenu: MainMenu;
  footer: Footer;
};

export const test = base.extend<PageFixtures>({
  // Tests must not show up as visitors in the site statistics.
  page: async ({ page }, use) => {
    await page.route(new RegExp(site.analyticsUrlPattern), (route) => route.abort());
    await use(page);
    // Deliberate pause between browser tests to keep the load on the live site low.
    await pause(site.throttle.browserTestDelayMs);
  },
  contentPage: async ({ page }, use) => use(new ContentPage(page)),
  contactPage: async ({ page }, use) => use(new ContactPage(page)),
  mainMenu: async ({ page, isMobile }, use) => use(new MainMenu(page, isMobile)),
  footer: async ({ page }, use) => use(new Footer(page)),
});
export { expect } from '@playwright/test';
