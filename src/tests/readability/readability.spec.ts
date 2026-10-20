import { test, expect } from '../../fixtures';
import knownIssues from '../../config/data/known-issues.json';
import { menu } from '../../config/data/menu';
import { pages } from '../../config/data/pages';
import { readability } from '../../config/data/readability';
import { axeFindings } from '../../helpers/axe';
import { reportWarning } from '../../helpers/report';
import { smallerThan } from '../../utils/sizes';

// Daily run checks the home page only; the full run checks every page in the list.
const smokeOnHome = (path: string) => (path === pages.home ? ['@smoke'] : []);

test.describe('US-004: Readability', () => {
  test.describe('at 200 % zoom', () => {
    test.use({ viewport: readability.zoom200Viewport });

    for (const path of readability.pages) {
      test(`AK1: ${path} keeps content and controls usable at 200 % zoom`, { tag: ['@full', ...smokeOnHome(path)] }, async ({ contentPage, mainMenu, footer, isMobile }) => {
        test.skip(isMobile, 'Phones zoom by pinching without reflow; phone width is covered by AK2 at 320 px');
        await contentPage.open(path);
        await expect(contentPage.mainHeading).toBeVisible();
        await mainMenu.openIfMobile();
        for (const item of menu) {
          await expect(mainMenu.link(item.name)).toBeVisible();
          // Trial click: checks the link can really be clicked (nothing covers it) without navigating away.
          await mainMenu.link(item.name).click({ trial: true });
        }
        await mainMenu.close();
        await footer.privacyLink.click({ trial: true });
      });

      test(`AK2: ${path} has no horizontal scrolling at 200 % zoom`, { tag: ['@full', ...smokeOnHome(path)] }, async ({ contentPage, readability: layout, isMobile }) => {
        test.skip(isMobile, 'Phones zoom by pinching without reflow; phone width is covered by AK2 at 320 px');
        await contentPage.open(path);
        await expect.poll(() => layout.horizontalOverflowPx()).toBeLessThanOrEqual(0);
      });
    }
  });

  test.describe('at 320 px width', () => {
    test.use({ viewport: readability.narrowViewport });

    for (const path of readability.pages) {
      test(`AK2: ${path} has no horizontal scrolling at 320 px`, { tag: ['@full', ...smokeOnHome(path)] }, async ({ contentPage, readability: layout }) => {
        await contentPage.open(path);
        await expect.poll(() => layout.horizontalOverflowPx()).toBeLessThanOrEqual(0);
      });
    }
  });

  for (const path of readability.pages) {
    test(`AK3: ${path} body text is at least ${readability.minTextFontPx} px`, { tag: '@full' }, async ({ contentPage, readability: layout, isMobile }) => {
      const knownIssue = knownIssues.mediumFontPreset.find((issue) => issue.path === path);
      test.fail(isMobile && !!knownIssue, knownIssue?.ref);
      await contentPage.open(path);
      const sizes = await layout.bodyTextSizes();
      expect(sizes.length, 'page has body text paragraphs').toBeGreaterThan(0);
      expect(sizes.filter((size) => size.fontSizePx < readability.minTextFontPx)).toEqual([]);
    });

    test(`AK4: ${path} buttons and links are not smaller than today`, { tag: '@full' }, async ({ contentPage, readability: layout, mainMenu, footer }) => {
      await contentPage.open(path);
      const buttons = await layout.sizesOf(layout.actionButtons);
      const footerLinks = await layout.sizesOf(footer.links);
      await mainMenu.openIfMobile();
      const menuLinks = await layout.sizesOf(mainMenu.links);

      reportWarning(`below ${readability.recommendedTargetPx} px`, smallerThan([...buttons, ...footerLinks, ...menuLinks], readability.recommendedTargetPx));

      expect(buttons.length, 'page has buttons').toBeGreaterThan(0);
      expect(menuLinks.length, 'menu has links').toBeGreaterThan(0);
      expect(smallerThan(buttons, readability.minTargetPx.actionButton), 'buttons').toEqual([]);
      expect(smallerThan(footerLinks, readability.minTargetPx.footerLink), 'footer links').toEqual([]);
      expect(smallerThan(menuLinks, readability.minTargetPx.menuLink), 'menu links').toEqual([]);
    });

    test(`AK5: ${path} text contrast is at least 4.5:1 (known issue)`, { tag: '@full' }, async ({ contentPage, page }) => {
      test.fail(true, knownIssues.lowContrast.ref);
      await contentPage.open(path);
      reportWarning('contrast below 7:1', (await axeFindings(page, [readability.enhancedContrastRule])).map((finding) => finding.target));
      expect(await axeFindings(page, [readability.contrastRule])).toEqual([]);
    });

    test(`AK6: ${path} text grows with the browser font size setting (known issue)`, { tag: '@full' }, async ({ contentPage, readability: layout, browserName }) => {
      test.skip(browserName !== 'chromium', 'The default font size can be set only through the Chromium DevTools protocol');
      test.fail(true, knownIssues.defaultFontSizeIgnored.ref);
      const expectedMinPx = (readability.minTextFontPx * readability.enlargedFontPx) / readability.defaultFontPx;
      await layout.setDefaultFontSize(readability.enlargedFontPx);
      await contentPage.open(path);
      const sizes = await layout.bodyTextSizes();
      expect(sizes.length, 'page has body text paragraphs').toBeGreaterThan(0);
      expect(sizes.filter((size) => size.fontSizePx < expectedMinPx)).toEqual([]);
    });
  }
});
