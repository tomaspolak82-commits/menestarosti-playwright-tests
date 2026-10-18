import { test, expect } from '../../fixtures';
import knownIssues from '../../config/data/known-issues.json';
import { site } from '../../config/data/site';
import { politeGet } from '../../helpers/polite-request';
import { collectSitePaths } from '../../helpers/site-urls';
import { settings } from '../../config/settings';
import { countH1 } from '../../utils/html';

const knownH1Issues = new Set(knownIssues.h1Count.map((issue) => issue.path));

test.describe('US-001: Site availability', { tag: '@full' }, () => {
  test('AK1: every sitemap and footer page responds 200', async ({ request }) => {
    test.setTimeout(600_000);
    const paths = await collectSitePaths(request, settings.baseURL);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      const response = await politeGet(request, path);
      expect.soft(response.status(), path).toBe(200);
    }
  });

  test('AK1: every page has exactly one main heading (h1)', async ({ request }) => {
    test.setTimeout(600_000);
    const paths = await collectSitePaths(request, settings.baseURL);
    for (const path of paths.filter((p) => !knownH1Issues.has(p))) {
      const html = await (await politeGet(request, path)).text();
      expect.soft(countH1(html), path).toBe(1);
    }
  });

  for (const issue of knownIssues.h1Count) {
    test(`AK1: ${issue.path} has exactly one main heading (known issue)`, async ({ request }) => {
      test.fail(true, issue.ref);
      const html = await (await politeGet(request, issue.path)).text();
      expect(countH1(html)).toBe(1);
    });
  }

  for (const redirect of site.redirects) {
    test(`AK6: ${redirect.from} redirects permanently to ${redirect.to}`, { tag: '@smoke' }, async ({ request }) => {
      const response = await politeGet(request, redirect.from, { maxRedirects: 0 });
      expect(response.status()).toBe(301);
      expect(new URL(response.headers()['location'], settings.baseURL).pathname).toBe(redirect.to);
    });
  }
});
