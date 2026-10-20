import type { Locator } from '@playwright/test';
import { ContentPage } from './ContentPage';

export type ImageReport = { total: number; broken: string[] };

// A single article. Open it with open(path).
export class ArticlePage extends ContentPage {
  // Related-post cards below the article are articles too; only the article itself has the h1.
  readonly article: Locator = this.page.getByRole('article').filter({ has: this.mainHeading });
  readonly heading: Locator = this.article.getByRole('heading', { level: 1 });
  // Some articles wrongly have more h1 elements (US-001 AK1 checks the count); this check needs just a non-empty one.
  readonly nonEmptyHeadings: Locator = this.heading.filter({ hasText: /\S/ });
  // CSS on purpose: images with empty alt have no img role, but a broken one is still a broken image.
  readonly images: Locator = this.article.locator('img');

  async textLength(): Promise<number> {
    return this.article.evaluate((el) => (el as HTMLElement).innerText.trim().length);
  }

  // Loads lazy images too, waits for each to finish (bounded) and lists those the browser could not show.
  // A broken image has no natural width after loading.
  async imageReport(timeoutMs: number): Promise<ImageReport> {
    return this.images.evaluateAll(async (elements, timeout) => {
      const images = elements as HTMLImageElement[];
      for (const image of images) image.loading = 'eager';
      await Promise.all(
        images
          .filter((image) => !image.complete)
          .map(
            (image) =>
              new Promise((resolve) => {
                image.addEventListener('load', resolve, { once: true });
                image.addEventListener('error', resolve, { once: true });
                setTimeout(resolve, timeout);
              }),
          ),
      );
      const broken = images.filter((image) => !image.complete || image.naturalWidth === 0).map((image) => image.currentSrc || image.src);
      return { total: images.length, broken };
    }, timeoutMs);
  }
}
