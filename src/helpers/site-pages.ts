import type { APIRequestContext } from '@playwright/test';
import { site } from '../config/data/site';
import { extractSitemapLocations, toPath } from '../utils/html';
import { politeGet } from './polite-request';

export type FetchedPage = { status: number; html: string };
export type Article = { path: string; published: Date; modified: Date };

// Several request-based specs need the same pages. Within one worker every page is fetched only once
// per run, which keeps the load on the live site low. Tests still each get the data they need.
const pageCache = new Map<string, FetchedPage>();
let sitemapCache: string[] | undefined;
let articleCache: Article[] | undefined;

export async function fetchPage(request: APIRequestContext, path: string): Promise<FetchedPage> {
  const cached = pageCache.get(path);
  if (cached) return cached;
  const response = await politeGet(request, path);
  const page = { status: response.status(), html: await response.text() };
  pageCache.set(path, page);
  return page;
}

// Paths of all pages listed in the sitemaps (pages, articles, categories).
export async function sitemapPaths(request: APIRequestContext, origin: string): Promise<string[]> {
  if (sitemapCache) return sitemapCache;
  const index = await (await politeGet(request, site.sitemapIndexPath)).text();
  const paths = new Set<string>();
  for (const sitemapUrl of extractSitemapLocations(index)) {
    const sitemap = await (await politeGet(request, sitemapUrl)).text();
    for (const url of extractSitemapLocations(sitemap)) {
      const path = toPath(url, origin);
      if (path) paths.add(path);
    }
  }
  sitemapCache = [...paths].sort();
  return sitemapCache;
}

// Published articles from the WordPress REST API, newest first.
export async function articles(request: APIRequestContext, origin: string): Promise<Article[]> {
  if (articleCache) return articleCache;
  const posts: { link: string; date: string; modified: string }[] = await (await politeGet(request, site.postsApiPath)).json();
  articleCache = posts
    .map((post) => ({ path: toPath(post.link, origin) ?? post.link, published: new Date(post.date), modified: new Date(post.modified) }))
    .sort((a, b) => b.published.getTime() - a.published.getTime());
  return articleCache;
}
