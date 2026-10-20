import type { Locator } from '@playwright/test';
import { games } from '../config/data/games';
import { pages } from '../config/data/pages';
import { settings } from '../config/settings';
import { BasePage } from './BasePage';

export class GamesPage extends BasePage {
  protected readonly path = pages.games;

  // CSS attribute selectors: both game links have the same or no distinctive text ("SPUSTIT HRU"),
  // only their target address tells them apart.
  readonly puzzleLink: Locator = this.page.getByRole('main').locator(`a[href="${new URL(games.puzzle.path, settings.baseURL).href}"]`);
  readonly scamGameLink: Locator = this.page.getByRole('main').locator(`a[href="${games.scamGame.url}"]`);
}
