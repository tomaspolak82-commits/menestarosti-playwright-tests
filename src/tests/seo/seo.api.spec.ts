import { test, expect } from '../../fixtures';
import knownIssues from '../../config/data/known-issues.json';
import { seo } from '../../config/data/seo';
import { site } from '../../config/data/site';
import { settings } from '../../config/settings';
import { politeGet, politeHead } from '../../helpers/polite-request';
import { reportWarning } from '../../helpers/report';
import { articles, fetchPage, sitemapPaths } from '../../helpers/site-pages';
import { extractCanonical, extractMeta, extractTitle } from '../../utils/html';
import { disallowedPrefixes, sitemapUrls } from '../../utils/robots';
import { duplicateGroups, lengthOutside, type PageText } from '../../utils/texts';

const titleSuffixPattern = new RegExp(`${seo.titleSuffix.replace(/[|]/g, '\\|')}$`);

test.describe('US-009: SEO and sharing', { tag: '@full' }, () => {
  // Every test reads all sitemap pages; the first one fetches them, the rest use the cache.
  test.describe.configure({ timeout: 600_000 });

  async function pageTexts(request: Parameters<typeof fetchPage>[0], read: (html: string) => string | null): Promise<PageText[]> {
    const texts: PageText[] = [];
    for (const path of await sitemapPaths(request, settings.baseURL)) {
      texts.push({ path, text: read((await fetchPage(request, path)).html) ?? '' });
    }
    // An empty list would make every check below pass without checking anything.
    expect(texts.length, 'pages found in the sitemap').toBeGreaterThan(0);
    return texts;
  }

  test('AK1: every page has a title', async ({ request }) => {
    const titles = await pageTexts(request, extractTitle);
    for (const { path, text } of titles) expect.soft(text, path).not.toBe('');
    reportWarning(`title length outside ${seo.titleLength.min}–${seo.titleLength.max}`, lengthOutside(titles, seo.titleLength));
  });

  test('AK2: no two pages share a title or a description', async ({ request }) => {
    expect.soft(duplicateGroups(await pageTexts(request, extractTitle)), 'pages with the same title').toEqual([]);
    expect.soft(duplicateGroups(await pageTexts(request, (html) => extractMeta(html, 'description'))), 'pages with the same description').toEqual([]);
  });

  test('AK3: every page has a description for search engines', async ({ request }) => {
    const descriptions = await pageTexts(request, (html) => extractMeta(html, 'description'));
    for (const { path, text } of descriptions) expect.soft(text, path).not.toBe('');
    reportWarning(`description length outside ${seo.descriptionLength.min}–${seo.descriptionLength.max}`, lengthOutside(descriptions, seo.descriptionLength));
  });

  test('AK4: every page has a canonical address pointing to itself', async ({ request }) => {
    for (const { path, text } of await pageTexts(request, extractCanonical)) {
      expect.soft(text, path).toBe(new URL(path, settings.baseURL).href);
    }
  });

  test('AK5: no sitemap page is marked noindex or blocked in robots.txt', async ({ request }) => {
    const blocked = disallowedPrefixes(await (await politeGet(request, site.robotsPath)).text());
    for (const { path, text } of await pageTexts(request, (html) => extractMeta(html, 'robots'))) {
      expect.soft(text, `${path} robots meta`).not.toMatch(/noindex/i);
      expect.soft(blocked.filter((prefix) => path.startsWith(prefix)), `${path} robots.txt`).toEqual([]);
    }
  });

  test('AK6: robots.txt exists and points to the sitemap', async ({ request }) => {
    const response = await politeGet(request, site.robotsPath);
    expect(response.status()).toBe(200);
    expect(sitemapUrls(await response.text())).toContain(new URL(site.sitemapIndexPath, settings.baseURL).href);
  });

  test('AK7: every article has sharing data and its image loads', async ({ request }) => {
    const list = await articles(request, settings.baseURL);
    expect(list.length).toBeGreaterThan(0);
    for (const article of list) {
      const html = (await fetchPage(request, article.path)).html;
      for (const tag of seo.shareTags) expect.soft(extractMeta(html, tag), `${article.path} ${tag}`).toBeTruthy();
      // Missing og:image is already reported above; the empty address then fails on its own.
      const image = extractMeta(html, 'og:image') ?? '';
      expect.soft(image && (await politeHead(request, image)).status(), `${article.path} og:image loads`).toBe(200);
    }
  });

  test('AK8: every title ends with the site name (known issue)', async ({ request }) => {
    test.fail(true, knownIssues.titleSuffix.ref);
    for (const { path, text } of await pageTexts(request, extractTitle)) {
      expect.soft(text, path).toMatch(titleSuffixPattern);
    }
  });
});
