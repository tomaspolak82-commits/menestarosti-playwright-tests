import { test, expect } from '../../fixtures';
import knownIssues from '../../config/data/known-issues.json';
import { links } from '../../config/data/links';
import { settings } from '../../config/settings';
import { checkExternal, checkInternal } from '../../helpers/link-check';
import { reportWarning } from '../../helpers/report';
import { fetchPage, sitemapPaths } from '../../helpers/site-pages';
import { extractLinks } from '../../utils/html';
import { hasElementWithId, linkKind, withoutFragment, type LinkKind } from '../../utils/links';

type PageLink = { page: string; href: string; kind: LinkKind };

const knownDeadLinks = new Set(knownIssues.deadExternalLinks.map((issue) => issue.url));

// All links on all sitemap pages (content, menu and footer).
async function siteLinks(request: Parameters<typeof fetchPage>[0]): Promise<PageLink[]> {
  const found: PageLink[] = [];
  for (const page of await sitemapPaths(request, settings.baseURL)) {
    for (const { href } of extractLinks((await fetchPage(request, page)).html)) {
      found.push({ page, href, kind: linkKind(href, settings.baseURL) });
    }
  }
  // An empty list would make every check below pass without checking anything.
  expect(found.length, 'links found').toBeGreaterThan(0);
  return found;
}

const uniqueUrls = (found: PageLink[], kind: LinkKind) =>
  [...new Set(found.filter((link) => link.kind === kind).map((link) => withoutFragment(link.href, settings.baseURL)))];

test.describe('US-006: Links', { tag: '@full' }, () => {
  test.describe.configure({ timeout: 900_000 });

  test('AK1, AK2: links to our own pages work and go there directly', async ({ request }) => {
    const urls = uniqueUrls(await siteLinks(request), 'internal');
    const results = [];
    for (const url of urls) results.push(await checkInternal(request, url));
    for (const result of results) expect.soft(result.status, result.url).toBe(200);
    reportWarning('link goes through a redirect', results.filter((r) => r.redirectedTo).map((r) => `${r.url} → ${r.redirectedTo}`));
  });

  test('AK3, AK7: links to other sites are not gone', async ({ request }) => {
    const found = await siteLinks(request);
    const urls = uniqueUrls(found, 'external');
    const contacted = urls.filter((url) => !links.notContacted.test(new URL(url).host) && !knownDeadLinks.has(url));
    const results = [];
    for (const url of contacted) results.push(await checkExternal(request, url));
    const pagesLinking = (url: string) => [...new Set(found.filter((link) => withoutFragment(link.href, settings.baseURL) === url).map((link) => link.page))];

    expect(results.filter((r) => r.status !== null && (links.deadStatuses as readonly number[]).includes(r.status)).map((r) => ({ ...r, pages: pagesLinking(r.url) }))).toEqual([]);
    reportWarning('other site did not answer normally', results.filter((r) => r.error || (r.status ?? 0) >= 400).map((r) => `${r.url}: ${r.status ?? r.error}`));
    reportWarning('link without https', urls.filter((url) => url.startsWith('http:')).map((url) => `${url} (${pagesLinking(url).join(', ')})`));
  });

  for (const issue of knownIssues.deadExternalLinks) {
    test(`AK3: ${issue.url} is not gone (known issue)`, async ({ request }) => {
      test.fail(true, issue.ref);
      const result = await checkExternal(request, issue.url);
      expect(result.status).not.toBe(null);
      expect(links.deadStatuses).not.toContain(result.status);
    });
  }

  test('AK4: links to a place on the same page lead to an existing element', async ({ request }) => {
    for (const link of (await siteLinks(request)).filter((l) => l.kind === 'anchor')) {
      const html = (await fetchPage(request, link.page)).html;
      expect.soft(hasElementWithId(html, decodeURIComponent(link.href.slice(1))), `${link.page} ${link.href}`).toBe(true);
    }
  });

  test('AK5: e-mail and phone links are well formed', async ({ request }) => {
    for (const link of (await siteLinks(request)).filter((l) => l.kind === 'email' || l.kind === 'phone')) {
      expect.soft(link.href.replace(/\s/g, ''), link.page).toMatch(link.kind === 'email' ? links.email : links.phone);
    }
  });

  test('AK6: no link is empty', async ({ request }) => {
    expect((await siteLinks(request)).filter((link) => link.kind === 'empty' || link.kind === 'other')).toEqual([]);
  });
});
