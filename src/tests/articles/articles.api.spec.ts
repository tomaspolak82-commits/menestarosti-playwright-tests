import { test, expect } from '../../fixtures';
import { articleChecks } from '../../config/data/articles';
import knownIssues from '../../config/data/known-issues.json';
import { pages } from '../../config/data/pages';
import { settings } from '../../config/settings';
import { articles, fetchPage } from '../../helpers/site-pages';
import { extractDetails, extractEntryTitleLinks, extractLinks, extractSingleArticle, extractTimeText, toPath } from '../../utils/html';

const sourcesRequiredFrom = new Date(`${articleChecks.sourcesRequiredFrom}T00:00:00`);

// Article addresses linked from the titles on the first page of the overview.
async function overviewPaths(request: Parameters<typeof fetchPage>[0]): Promise<string[]> {
  const overview = await fetchPage(request, pages.articles);
  expect(overview.status, `${pages.articles} status`).toBe(200);
  return [...new Set(extractEntryTitleLinks(overview.html).map((link) => toPath(link.href, settings.baseURL) ?? link.href))];
}

test.describe('US-005: Articles', { tag: '@full' }, () => {
  // AK5 and AK6 read every article; fetchPage caches them for the other specs of the run.
  test.describe.configure({ timeout: 600_000 });

  test('AK3: the newest article is on the first page of the overview', async ({ request }) => {
    const [newest] = await articles(request, settings.baseURL);
    expect(newest, 'articles in the REST API').toBeDefined();
    expect(await overviewPaths(request)).toContain(newest.path);
  });

  test('AK4: every article in the overview opens with status 200', async ({ request }) => {
    const known = (await articles(request, settings.baseURL)).map((article) => article.path);
    const paths = await overviewPaths(request);
    expect(paths.length, 'article links in the overview').toBeGreaterThan(0);
    for (const path of paths) {
      expect.soft(known, `${path} is an article`).toContain(path);
      expect.soft((await fetchPage(request, path)).status, `${path} status`).toBe(200);
    }
  });

  test(`AK5: articles published since ${articleChecks.sourcesRequiredFrom} have a sources section with a link`, async ({ request }) => {
    const recent = (await articles(request, settings.baseURL)).filter((article) => article.published >= sourcesRequiredFrom);
    expect(recent.length, `articles published since ${articleChecks.sourcesRequiredFrom}`).toBeGreaterThan(0);
    for (const { path } of recent) {
      const sources = extractDetails(extractSingleArticle((await fetchPage(request, path)).html)).filter((block) => articleChecks.sourcesHeading.test(block.summary));
      expect.soft(sources.length, `${path} sources section`).toBeGreaterThan(0);
      expect.soft(sources.flatMap((block) => extractLinks(block.html)).length, `${path} links in the sources`).toBeGreaterThan(0);
    }
  });

  test('AK6: every article shows its publish and modification date (known issue)', async ({ request }) => {
    test.fail(true, knownIssues.articleDates.ref);
    const list = await articles(request, settings.baseURL);
    expect(list.length, 'articles in the REST API').toBeGreaterThan(0);
    for (const { path } of list) {
      // Only the article itself: the related-post cards below it show their own dates.
      const article = extractSingleArticle((await fetchPage(request, path)).html);
      expect.soft(extractTimeText(article, articleChecks.publishedDateProp), `${path} publish date`).toBeTruthy();
      expect.soft(extractTimeText(article, articleChecks.modifiedDateProp), `${path} modification date`).toBeTruthy();
    }
  });
});
