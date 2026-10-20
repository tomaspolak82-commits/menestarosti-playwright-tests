import { pages } from './pages';
import { site } from './site';

// Expected texts of the games (US-010). The requirement names the behaviour, these are the exact texts.
export const games = {
  puzzle: {
    path: pages.puzzle,
    frameTitle: 'Skládačka',
    difficulties: [3, 4, 5, 6],
    difficultyName: (n: number) => `${n} × ${n}`,
    // Any button whose name contains "N × N" is a difficulty option.
    difficultyPattern: /\d × \d/,
    categories: ['Vše', 'Příroda', 'Zvířata', 'Historická místa'],
    startButton: 'Spustit hru',
    // Piece N belongs to target place N; only the order on the screen is random.
    pieceName: (n: number) => `Díl skládačky ${n}`,
    piecePattern: /^Díl skládačky \d+$/,
    cellName: (n: number) => `Cílové místo ${n}`,
    winHeading: 'Skvěle! Puzzle je hotové!',
  },
  scamGame: {
    url: site.scamGameUrl,
    emailTileTestId: 'tile-email',
    basicLevelButton: 'Začít: základní úroveň',
    progressTestId: 'progress',
    evaluationTestId: 'evaluation',
    roundEndTestId: 'round-end',
    firstMessageProgress: /^Zpráva 1 z \d+$/,
  },
} as const;
