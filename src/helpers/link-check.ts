import type { APIRequestContext } from '@playwright/test';
import { links } from '../config/data/links';
import { politeGet } from './polite-request';

export type InternalResult = { url: string; status: number; redirectedTo: string | null };
export type ExternalResult = { url: string; status: number | null; error: string | null };

// Our own pages: a redirect is followed once by hand so the test can report it (AK2) and still check the target (AK1).
export async function checkInternal(request: APIRequestContext, url: string): Promise<InternalResult> {
  const first = await politeGet(request, url, { maxRedirects: 0 });
  const location = first.headers()['location'];
  if (first.status() < 300 || first.status() >= 400 || !location) {
    return { url, status: first.status(), redirectedTo: null };
  }
  const target = new URL(location, url).href;
  const final = await politeGet(request, target);
  return { url, status: final.status(), redirectedTo: target };
}

// Other sites: "gone" (404, 410) is asked once more before it counts, because other sites can have a bad moment.
// Network errors are returned, not thrown: an unreachable foreign site is a warning, not our bug.
export async function checkExternal(request: APIRequestContext, url: string): Promise<ExternalResult> {
  const attempt = async (): Promise<ExternalResult> => {
    try {
      const response = await politeGet(request, url, { timeout: links.externalTimeoutMs });
      return { url, status: response.status(), error: null };
    } catch (error) {
      return { url, status: null, error: error instanceof Error ? error.message.split('\n')[0] : String(error) };
    }
  };
  const first = await attempt();
  return first.status !== null && (links.deadStatuses as readonly number[]).includes(first.status) ? attempt() : first;
}
