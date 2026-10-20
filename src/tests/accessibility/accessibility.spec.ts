import { test, expect } from '../../fixtures';
import { accessibility } from '../../config/data/accessibility';
import knownIssues from '../../config/data/known-issues.json';
import { menu } from '../../config/data/menu';
import { pages } from '../../config/data/pages';
import { site } from '../../config/data/site';
import { settings } from '../../config/settings';
import { axeFindings, axeFindingsByTags, type AxeFinding } from '../../helpers/axe';
import { reportWarning } from '../../helpers/report';
import { sitemapPaths } from '../../helpers/site-pages';
import { pause } from '../../utils/throttle';

// Known findings are left out here and checked by their own known-issue test, so other serious problems still fail.
const isKnown = (f: AxeFinding) => knownIssues.axeFindings.some((issue) => issue.rule === f.rule && issue.target === f.target);
const failing = (findings: AxeFinding[]) => findings.filter((f) => (accessibility.failingImpacts as readonly string[]).includes(f.impact) && !isKnown(f));
const minor = (findings: AxeFinding[]) => findings.filter((f) => !(accessibility.failingImpacts as readonly string[]).includes(f.impact));
// Safari moves Tab only between form fields unless the user turns on "Press Tab to highlight each item".
const safariTabReason = 'Safari skips links on Tab by default; keyboard use is checked in Chrome and Firefox';
const smokeOn = (path: string) => (path === pages.home || path === pages.contact ? ['@smoke'] : []);

test.describe('US-008: Accessibility', () => {
  for (const path of site.samplePages) {
    test(`AK1, AK2: ${path} has no serious accessibility problems`, { tag: ['@full', ...smokeOn(path)] }, async ({ contentPage, page }) => {
      await contentPage.open(path);
      const findings = await axeFindingsByTags(page, accessibility.wcagTags, accessibility.rulesCheckedElsewhere);
      reportWarning('minor accessibility problem', minor(findings).map((f) => `${f.rule} (${f.impact}): ${f.target}`));
      expect(failing(findings)).toEqual([]);
    });

    test(`AK3: ${path} is marked as Czech`, { tag: '@full' }, async ({ contentPage }) => {
      await contentPage.open(path);
      expect(await contentPage.language()).toBe('cs');
    });

    test(`AK6: ${path} images have a text alternative`, { tag: '@full' }, async ({ contentPage, page }) => {
      await contentPage.open(path);
      expect(await axeFindings(page, [...accessibility.imageRules])).toEqual([]);
    });
  }

  test('AK1, AK2, AK6: every sitemap page has no serious problems and all images have a text alternative', { tag: '@full' }, async ({ contentPage, page, request, browserName, isMobile }) => {
    // axe reads the same page structure in every browser; one browser keeps the load on the live site low.
    test.skip(browserName !== 'chromium' || isMobile, 'All sitemap pages are checked in desktop Chrome only (load on the live site)');
    test.setTimeout(1_200_000);
    const paths = await sitemapPaths(request, settings.baseURL);
    expect(paths.length).toBeGreaterThan(0);
    const warnings: string[] = [];
    for (const path of paths) {
      await contentPage.open(path);
      const findings = await axeFindingsByTags(page, accessibility.wcagTags, accessibility.rulesCheckedElsewhere);
      warnings.push(...minor(findings).map((f) => `${path} ${f.rule} (${f.impact}): ${f.target}`));
      expect.soft(failing(findings), path).toEqual([]);
      expect.soft(await axeFindings(page, [...accessibility.imageRules]), `${path} images`).toEqual([]);
      await pause(site.throttle.browserTestDelayMs);
    }
    reportWarning('minor accessibility problem', warnings);
  });

  for (const issue of knownIssues.axeFindings) {
    test(`AK1: ${issue.rule} on ${issue.target} (known issue)`, { tag: '@full' }, async ({ contentPage, page, isMobile }) => {
      test.skip(isMobile, 'The element is in the desktop header only');
      test.fail(true, issue.ref);
      await contentPage.open(pages.home);
      expect((await axeFindings(page, [issue.rule])).filter((f) => f.target === issue.target)).toEqual([]);
    });
  }

  test('AK4: the keyboard reaches every main menu item and shows where it is', { tag: '@full' }, async ({ contentPage, keyboard, isMobile, browserName }) => {
    test.skip(isMobile, 'Phones are not used with a keyboard');
    test.skip(browserName === 'webkit', safariTabReason);
    await contentPage.open(pages.home);
    const stops = await keyboard.tabThrough(accessibility.maxTabStops);
    const reached = stops.map((stop) => stop.name);
    for (const item of menu) expect.soft(reached, `menu item "${item.name}"`).toContain(item.name);
    expect.soft(stops.some((stop) => stop.inMain), 'a link in the main content').toBe(true);
    expect(stops.filter((stop) => stop.name && !stop.hasIndicator).map((stop) => stop.name), 'focus without a visible indicator').toEqual([]);
  });

  test('AK5: "skip to content" link moves the keyboard to the main content', { tag: '@full' }, async ({ contentPage, keyboard, isMobile, browserName }) => {
    test.skip(isMobile, 'Phones are not used with a keyboard');
    test.skip(browserName === 'webkit', safariTabReason);
    await contentPage.open(pages.home);
    await keyboard.pressTab();
    await expect(keyboard.skipLink).toBeFocused();
    await expect(keyboard.skipLink).toBeVisible();
    await keyboard.pressEnter();
    await keyboard.pressTab();
    expect(await keyboard.focusIsInMain()).toBe(true);
  });
});
