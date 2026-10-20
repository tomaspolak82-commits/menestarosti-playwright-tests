import type { Locator, Page } from '@playwright/test';

// Wide windows show the navigation in the page header; mobile and narrow (zoomed) windows hide it behind
// the "Otevřít nabídku" drawer. Neither is found by its accessible name: the names are about to be renamed (known issue).
export class MainMenu {
  readonly openButton: Locator;
  readonly closeButton: Locator;
  readonly navigation: Locator;

  constructor(
    private readonly page: Page,
    private readonly isMobile: boolean,
  ) {
    this.openButton = page.getByRole('button', { name: 'Otevřít nabídku' });
    this.closeButton = page.getByRole('button', { name: 'Zavřít nabídku' });
    // The Kadence drawer has no ARIA role, so its id is the only stable hook; the navigation inside is found by role.
    this.navigation = isMobile
      ? page.locator('#mobile-drawer').getByRole('navigation')
      : page.getByRole('banner').getByRole('navigation');
  }

  // What the visitor sees first: the menu itself on desktop, the open button on mobile.
  get entryPoint(): Locator {
    return this.isMobile ? this.openButton : this.navigation;
  }

  get links(): Locator {
    return this.navigation.getByRole('link');
  }

  link(name: string): Locator {
    return this.navigation.getByRole('link', { name, exact: true });
  }

  async openIfMobile(): Promise<void> {
    if (this.isMobile) await this.openButton.click();
  }

  async close(): Promise<void> {
    await this.closeButton.click();
  }
}
