import type { Locator } from '@playwright/test';
import { pages } from '../config/data/pages';
import { BasePage } from './BasePage';

export class DownloadsPage extends BasePage {
  protected readonly path = pages.downloads;

  // CSS attribute selector: download links have no common name or role, only the file type in the address.
  readonly fileLinks: Locator = this.page.getByRole('main').locator('a[href$=".pdf" i]');
}
