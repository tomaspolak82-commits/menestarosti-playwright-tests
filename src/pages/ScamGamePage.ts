import type { Locator, Response } from '@playwright/test';
import { games } from '../config/data/games';
import { BasePage } from './BasePage';

const texts = games.scamGame;

// "Poznej podvod" runs on its own subdomain, so it is opened by its full address, not by a path of the site.
// The game has its own data-testid attributes.
export class ScamGamePage extends BasePage {
  readonly emailTile: Locator = this.page.getByTestId(texts.emailTileTestId);
  readonly basicLevelButton: Locator = this.page.getByRole('button', { name: texts.basicLevelButton });
  readonly progress: Locator = this.page.getByTestId(texts.progressTestId);
  readonly evaluation: Locator = this.page.getByTestId(texts.evaluationTestId);
  readonly roundEnd: Locator = this.page.getByTestId(texts.roundEndTestId);

  async open(): Promise<Response | null> {
    return this.page.goto(texts.url);
  }

  async startEmailTraining(): Promise<void> {
    await this.emailTile.click();
    await this.basicLevelButton.click();
  }
}
