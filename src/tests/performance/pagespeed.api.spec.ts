import { test, expect } from '../../fixtures';
import knownIssues from '../../config/data/known-issues.json';
import perf from '../../config/data/performance.json';
import { pages } from '../../config/data/pages';
import { site } from '../../config/data/site';
import { settings } from '../../config/settings';
import { measureMedian, type PageSpeedResult } from '../../helpers/pagespeed';
import { politeGet, politeHead } from '../../helpers/polite-request';
import { collectSitePaths } from '../../helpers/site-urls';
import { extractImageUrls } from '../../utils/html';

// A trace could record the PageSpeed request URL, which contains the API key.
// Playwright allows this option only for the whole file.
test.use({ trace: 'off' });

test.describe('US-003: Homepage speed on mobile', { tag: '@smoke' }, () => {
  test.describe.configure({ mode: 'serial', timeout: 300_000 });
  let homepage: PageSpeedResult;

  test.beforeAll(async ({ playwright }) => {
    test.setTimeout(300_000);
    const request = await playwright.request.newContext();
    homepage = await measureMedian(request, new URL(pages.home, settings.baseURL).href, 'mobile', perf.runs);
    await request.dispose();
  });

  test('AK1: performance score is at least the lower limit', async () => {
    expect(homepage.score).toBeGreaterThanOrEqual(perf.homepageMinScore);
  });

  test('AK2: largest contentful paint is within the limit (known issue)', async () => {
    test.fail(true, knownIssues.homepageMobileLcp.ref);
    expect(homepage.lcpMs).toBeLessThanOrEqual(perf.lcpMaxMs);
  });

  test('AK2: layout shift is within the limit', async () => {
    expect(homepage.cls).toBeLessThanOrEqual(perf.clsMax);
  });
});

test.describe('US-003: Image sizes', { tag: '@full' }, () => {
  test('AK4: no image is larger than the size limit', async ({ request }) => {
    test.setTimeout(900_000);
    const paths = await collectSitePaths(request, settings.baseURL);
    const images = new Set<string>();
    for (const path of [...new Set([...paths, ...site.samplePages])]) {
      const html = await (await politeGet(request, path)).text();
      for (const src of extractImageUrls(html)) images.add(new URL(src, settings.baseURL).href);
    }
    for (const image of images) {
      const response = await politeHead(request, image);
      const size = Number(response.headers()['content-length'] ?? 0);
      expect.soft(size, image).toBeLessThanOrEqual(perf.maxImageBytes);
    }
  });
});
