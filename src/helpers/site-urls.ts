import type { APIRequestContext } from '@playwright/test';
import { pages } from '../config/data/pages';
import { site } from '../config/data/site';
import { extractFooterLinks, extractSitemapLocations, toPath } from '../utils/html';
import { politeGet } from './polite-request';

// All site paths to check: every sitemap entry plus internal footer links (some pages are kept out of the sitemap on purpose).
export async function collectSitePaths(request: APIRequestContext, origin: string): Promise<string[]> {
  const index = await (await politeGet(request, site.sitemapIndexPath)).text();
  const paths = new Set<string>();
  for (const sitemapUrl of extractSitemapLocations(index)) {
    const sitemap = await (await politeGet(request, sitemapUrl)).text();
    for (const url of extractSitemapLocations(sitemap)) {
      const path = toPath(url, origin);
      if (path) paths.add(path);
    }
  }
  const home = await (await politeGet(request, pages.home)).text();
  for (const href of extractFooterLinks(home)) {
    const path = toPath(href, origin);
    if (path) paths.add(path);
  }
  return [...paths].sort();
}
