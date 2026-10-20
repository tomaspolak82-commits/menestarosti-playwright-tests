import { test, expect } from '../../fixtures';
import { downloads } from '../../config/data/downloads';
import knownIssues from '../../config/data/known-issues.json';
import { settings } from '../../config/settings';
import { politeGet } from '../../helpers/polite-request';
import { reportWarning } from '../../helpers/report';
import { articles, fetchPage } from '../../helpers/site-pages';
import { extractLinks, type HtmlLink } from '../../utils/html';

type FileLink = HtmlLink & { page: string; url: string };

const knownTextIssues = new Set(knownIssues.downloadLinkText.map((issue) => issue.path));

// PDF links on the downloads page and in every article.
async function fileLinks(request: Parameters<typeof fetchPage>[0]): Promise<FileLink[]> {
  const sources = [downloads.page, ...(await articles(request, settings.baseURL)).map((article) => article.path)];
  const links: FileLink[] = [];
  for (const page of sources) {
    for (const link of extractLinks((await fetchPage(request, page)).html)) {
      const url = new URL(link.href, settings.baseURL);
      if (downloads.fileExtension.test(url.pathname)) links.push({ ...link, page, url: url.href });
    }
  }
  return links;
}

test.describe('US-007: Downloads', { tag: '@full' }, () => {
  test.describe.configure({ timeout: 600_000 });

  test('AK2–AK4: every linked PDF is a real PDF within the size limit', async ({ request }) => {
    const urls = [...new Set((await fileLinks(request)).map((link) => link.url))];
    expect(urls.length, 'PDF links found').toBeGreaterThan(0);
    for (const url of urls) {
      const response = await politeGet(request, url);
      const body = await response.body();
      expect.soft(response.status(), `${url} status`).toBe(200);
      expect.soft(response.headers()['content-type'], `${url} type`).toContain(downloads.pdfContentType);
      expect.soft(body.subarray(0, downloads.pdfSignature.length).toString('latin1'), `${url} is a PDF`).toBe(downloads.pdfSignature);
      expect.soft(body.length, `${url} size`).toBeLessThanOrEqual(downloads.maxFileBytes);
    }
  });

  test('AK5: download links say they are downloads', async ({ request }) => {
    const links = (await fileLinks(request)).filter((link) => !knownTextIssues.has(link.page));
    expect(links.length, 'PDF links found').toBeGreaterThan(0);
    for (const link of links) expect.soft(link.text, `${link.page} → ${link.url}`).toMatch(downloads.downloadWords);
    reportWarning(
      'download link without file type and size',
      links.filter((link) => !downloads.typeAndSize.test(link.text)).map((link) => `${link.page}: "${link.text}"`),
    );
  });

  for (const issue of knownIssues.downloadLinkText) {
    test(`AK5: download links on ${issue.path} say they are downloads (known issue)`, async ({ request }) => {
      test.fail(true, issue.ref);
      const links = (await fileLinks(request)).filter((link) => link.page === issue.path);
      expect(links.length, 'PDF links found').toBeGreaterThan(0);
      for (const link of links) expect.soft(link.text, link.url).toMatch(downloads.downloadWords);
    });
  }
});
