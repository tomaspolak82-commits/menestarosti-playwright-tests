import { test, expect } from '../../fixtures';
import { articleChecks } from '../../config/data/articles';
import { pages } from '../../config/data/pages';
import { site } from '../../config/data/site';
import { settings } from '../../config/settings';
import { articles } from '../../helpers/site-pages';
import { pause } from '../../utils/throttle';

test.describe('US-005: Articles', () => {
  test('AK1: sample article shows its heading and text', { tag: ['@smoke', '@full'] }, async ({ articlePage }) => {
    await articlePage.open(pages.passwordArticle);
    await expect(articlePage.heading).toBeVisible();
    await expect(articlePage.heading).toHaveText(/\S/);
    expect(await articlePage.textLength()).toBeGreaterThanOrEqual(articleChecks.minTextChars);
  });

  test('AK2: sample article images load', { tag: ['@smoke', '@full'] }, async ({ articlePage }) => {
    await articlePage.open(pages.passwordArticle);
    const images = await articlePage.imageReport(articleChecks.imageLoadTimeoutMs);
    expect(images.total, 'images in the article').toBeGreaterThan(0);
    expect(images.broken).toEqual([]);
  });

  test('AK1, AK2: every article shows its heading and text and its images load', { tag: '@full' }, async ({ articlePage, request, browserName, isMobile }) => {
    // The page renders the same in every browser; one browser keeps the load on the live site low (phones get the sample).
    test.skip(browserName !== 'chromium' || isMobile, 'All articles are checked in desktop Chrome only (load on the live site)');
    test.setTimeout(1_200_000);
    const list = await articles(request, settings.baseURL);
    expect(list.length, 'articles in the REST API').toBeGreaterThan(0);
    let imageCount = 0;
    for (const { path } of list) {
      await articlePage.open(path);
      await expect.soft(articlePage.nonEmptyHeadings, `${path} heading`).not.toHaveCount(0);
      expect.soft(await articlePage.textLength(), `${path} text length`).toBeGreaterThanOrEqual(articleChecks.minTextChars);
      const images = await articlePage.imageReport(articleChecks.imageLoadTimeoutMs);
      expect.soft(images.broken, `${path} broken images`).toEqual([]);
      imageCount += images.total;
      await pause(site.throttle.browserTestDelayMs);
    }
    // No image in any article would mean the images were not found at all, not that they all load.
    expect(imageCount, 'images in all articles').toBeGreaterThan(0);
  });
});
