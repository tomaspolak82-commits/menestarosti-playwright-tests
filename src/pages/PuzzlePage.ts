import type { FrameLocator, Locator } from '@playwright/test';
import { games } from '../config/data/games';
import { BasePage } from './BasePage';

const texts = games.puzzle;

// The puzzle runs in an iframe titled "Skládačka"; everything inside is found by role and name.
export class PuzzlePage extends BasePage {
  protected readonly path = texts.path;

  readonly game: FrameLocator = this.page.getByTitle(texts.frameTitle).contentFrame();
  readonly difficultyButtons: Locator = this.game.getByRole('button', { name: texts.difficultyPattern });
  readonly startButton: Locator = this.game.getByRole('button', { name: texts.startButton });
  readonly pieces: Locator = this.game.getByRole('button', { name: texts.piecePattern });
  readonly winHeading: Locator = this.game.getByRole('heading', { name: texts.winHeading });

  difficulty(n: number): Locator {
    return this.game.getByRole('button', { name: texts.difficultyName(n) });
  }

  category(name: string): Locator {
    return this.game.getByRole('button', { name });
  }

  piece(n: number): Locator {
    return this.game.getByRole('button', { name: texts.pieceName(n), exact: true });
  }

  cell(n: number): Locator {
    return this.game.getByRole('button', { name: texts.cellName(n), exact: true });
  }

  async start(n: number): Promise<void> {
    await this.difficulty(n).click();
    await this.startButton.click();
  }

  // The game has no dragging requirement: select a piece, then its target place. Phones tap, computers click.
  async placeAllPieces(n: number, useTouch: boolean): Promise<void> {
    for (let i = 1; i <= n * n; i++) {
      for (const target of [this.piece(i), this.cell(i)]) {
        if (useTouch) await target.tap();
        else await target.click();
      }
    }
  }
}
