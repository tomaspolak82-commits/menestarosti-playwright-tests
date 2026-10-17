import type { Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// Any page of the site (article, static page, 404). Open it with open(path).
export class ContentPage extends BasePage {
  readonly mainHeading: Locator = this.page.getByRole('heading', { level: 1 });
  readonly main: Locator = this.page.getByRole('main');
  // Pages may (wrongly) have more h1 elements; AK1 checks the count, other checks need just a non-empty one.
  readonly nonEmptyMainHeading: Locator = this.mainHeading.filter({ hasText: /\S/ });

  // Link back to the home page inside the main content, not in the header logo or menu.
  // CSS attribute selector: links have no common accessible name, only the target URL is fixed.
  homeLinkInContent(homeUrl: string): Locator {
    return this.main.locator(`a[href="${homeUrl}"], a[href="/"]`);
  }
}
