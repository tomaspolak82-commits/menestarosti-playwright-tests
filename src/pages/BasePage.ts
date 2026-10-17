import type { Page, Response } from '@playwright/test';

export abstract class BasePage {
  // Relative path of the page, e.g. '/kontakty/'. baseURL comes from settings.
  protected readonly path: string = '/';

  constructor(protected readonly page: Page) {}

  async open(path: string = this.path): Promise<Response | null> {
    return this.page.goto(path);
  }
}
