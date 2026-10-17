import type { APIRequestContext } from '@playwright/test';
import { settings } from '../config/settings';
import { median } from '../utils/stats';

const API_URL = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export type PageSpeedResult = { score: number; lcpMs: number; cls: number };

// Thrown when the PageSpeed service itself fails: an environment problem, not a slow site.
export class PageSpeedEnvironmentError extends Error {}

async function measureOnce(
  request: APIRequestContext,
  url: string,
  strategy: 'mobile' | 'desktop',
): Promise<PageSpeedResult> {
  const response = await request.get(API_URL, {
    params: { url, strategy, category: 'performance', key: settings.pageSpeedApiKey },
    timeout: 120_000,
  });
  if (!response.ok()) {
    // Never include the request URL in the message: it contains the API key.
    throw new PageSpeedEnvironmentError(`PageSpeed API responded ${response.status()} (environment failure, not a slow site)`);
  }
  const body = await response.json();
  const audits = body.lighthouseResult.audits;
  return {
    score: Math.round(body.lighthouseResult.categories.performance.score * 100),
    lcpMs: audits['largest-contentful-paint'].numericValue,
    cls: audits['cumulative-layout-shift'].numericValue,
  };
}

// PageSpeed returns a cached result for an identical URL, so each run gets a unique query parameter.
// Runs sequentially: parallel runs would influence each other and the quota.
export async function measureMedian(
  request: APIRequestContext,
  url: string,
  strategy: 'mobile' | 'desktop',
  runs: number,
): Promise<PageSpeedResult> {
  const results: PageSpeedResult[] = [];
  for (let i = 0; i < runs; i++) {
    const unique = new URL(url);
    unique.searchParams.set('psi-run', `${Date.now()}-${i}`);
    results.push(await measureOnce(request, unique.toString(), strategy));
  }
  return {
    score: median(results.map((r) => r.score)),
    lcpMs: median(results.map((r) => r.lcpMs)),
    cls: median(results.map((r) => r.cls)),
  };
}
