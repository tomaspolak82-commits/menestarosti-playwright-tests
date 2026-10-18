import { test, expect } from '../../fixtures';
import { footer as footerData } from '../../config/data/footer';
import knownIssues from '../../config/data/known-issues.json';
import { menu } from '../../config/data/menu';
import { site } from '../../config/data/site';
import { settings } from '../../config/settings';

test.describe('US-001: Navigation', () => {
  for (const path of site.samplePages) {
    test(`AK2: ${path} shows main heading and menu`, { tag: ['@smoke', '@full'] }, async ({ contentPage, mainMenu }) => {
      await contentPage.open(path);
      await expect(contentPage.mainHeading).toBeVisible();
      await expect(contentPage.mainHeading).not.toBeEmpty();
      await expect(mainMenu.entryPoint).toBeVisible();
    });
  }

  for (const item of menu) {
    test(`AK3: menu item "${item.name}" leads to ${item.path}`, { tag: ['@smoke', '@full'] }, async ({ contentPage, mainMenu, page }) => {
      await contentPage.open('/');
      await mainMenu.openIfMobile();
      await expect(mainMenu.link(item.name)).toHaveAttribute('href', new URL(item.path, settings.baseURL).href);
      await mainMenu.link(item.name).click();
      await expect(page).toHaveURL(new URL(item.path, settings.baseURL).href);
      await expect(contentPage.nonEmptyMainHeading).not.toHaveCount(0);
    });
  }

  test('AK3: menu contains exactly the expected items', { tag: ['@smoke', '@full'] }, async ({ contentPage, mainMenu }) => {
    await contentPage.open('/');
    await mainMenu.openIfMobile();
    await expect(mainMenu.links).toHaveCount(menu.length);
    for (const item of menu) await expect(mainMenu.link(item.name)).toBeVisible();
  });

  test('AK4: mobile menu opens and closes', { tag: ['@smoke', '@full'] }, async ({ contentPage, mainMenu, isMobile }) => {
    test.skip(!isMobile, 'Mobile only');
    await contentPage.open('/');
    await mainMenu.openIfMobile();
    await expect(mainMenu.navigation).toBeVisible();
    await mainMenu.close();
    await expect(mainMenu.navigation).toBeHidden();
    await expect(mainMenu.openButton).toBeVisible();
  });

  test('AK5: footer links to privacy policy and Facebook', { tag: ['@smoke', '@full'] }, async ({ contentPage, footer }) => {
    await contentPage.open('/');
    await expect(footer.privacyLink).toHaveAttribute('href', new URL(footerData.privacyPath, settings.baseURL).href);
    await expect(footer.facebookLink).toHaveAttribute('href', footerData.facebookUrl);
  });

  test('AK7: unknown address shows a "not found" page', { tag: '@full' }, async ({ contentPage }) => {
    const response = await contentPage.open(site.notFoundPath);
    expect(response?.status()).toBe(404);
    await expect(contentPage.nonEmptyMainHeading).not.toHaveCount(0);
  });

  test('AK7: "not found" page links to the home page in its content (known issue)', { tag: '@full' }, async ({ contentPage }) => {
    test.fail(true, knownIssues.notFoundWithoutHomeLink.ref);
    await contentPage.open(site.notFoundPath);
    await expect(contentPage.homeLinkInContent(new URL('/', settings.baseURL).href)).not.toHaveCount(0);
  });
});
