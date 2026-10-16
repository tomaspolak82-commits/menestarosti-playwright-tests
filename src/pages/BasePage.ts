import type { Page } from '@playwright/test';

export abstract class BasePage {
  // Relative path of the page, e.g. '/kontakty/'. baseURL comes from settings.
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }
}
