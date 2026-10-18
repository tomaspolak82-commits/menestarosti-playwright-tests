import type { APIRequestContext, APIResponse } from '@playwright/test';
import { site } from '../config/data/site';
import { pause } from '../utils/throttle';

type GetOptions = Parameters<APIRequestContext['get']>[1];

// Every request to the live site goes through here: a pause before each one keeps the load low.
export async function politeGet(request: APIRequestContext, url: string, options?: GetOptions): Promise<APIResponse> {
  await pause(site.throttle.requestDelayMs);
  return request.get(url, options);
}

export async function politeHead(request: APIRequestContext, url: string): Promise<APIResponse> {
  await pause(site.throttle.requestDelayMs);
  return request.head(url);
}
