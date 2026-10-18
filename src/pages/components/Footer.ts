import type { Locator, Page } from '@playwright/test';
import { footer } from '../../config/data/footer';

export class Footer {
  readonly root: Locator;
  readonly privacyLink: Locator;
  readonly facebookLink: Locator;

  constructor(page: Page) {
    // Site footer has role contentinfo; article footers use <footer> without that role.
    this.root = page.getByRole('contentinfo');
    this.privacyLink = this.root.getByRole('link', { name: footer.privacyLinkName });
    this.facebookLink = this.root.getByRole('link', { name: footer.facebookLinkName });
  }
}
