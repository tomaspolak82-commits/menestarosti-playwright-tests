import { test, expect } from '../../fixtures';
import { games } from '../../config/data/games';

const puzzle = games.puzzle;

test.describe('US-010: Games', () => {
  test('AK1: games page offers both games', { tag: ['@smoke', '@full'] }, async ({ gamesPage }) => {
    await gamesPage.open();
    await expect(gamesPage.puzzleLink).toBeVisible();
    await expect(gamesPage.scamGameLink).toBeVisible();
  });

  test('AK2: puzzle loads with difficulties 3 to 6 and the image categories', { tag: ['@smoke', '@full'] }, async ({ puzzlePage }) => {
    await puzzlePage.open();
    for (const n of puzzle.difficulties) await expect(puzzlePage.difficulty(n)).toBeVisible();
    for (const name of puzzle.categories) await expect(puzzlePage.category(name)).toBeVisible();
    await expect(puzzlePage.startButton).toBeVisible();
  });

  test('AK3: starting 3 × 3 shows 9 shuffled pieces', { tag: '@full' }, async ({ puzzlePage }) => {
    await puzzlePage.open();
    await puzzlePage.start(3);
    await expect(puzzlePage.pieces).toHaveCount(9);
  });

  test('AK4: placing every piece on its place finishes the puzzle (tap on phones)', { tag: '@full' }, async ({ puzzlePage, isMobile }) => {
    await puzzlePage.open();
    await puzzlePage.start(3);
    await expect(puzzlePage.winHeading).toBeHidden();
    await puzzlePage.placeAllPieces(3, isMobile);
    await expect(puzzlePage.winHeading).toBeVisible();
  });

  test('AK5: exactly the difficulties 3 to 6 are offered and the hardest one starts', { tag: '@full' }, async ({ puzzlePage }) => {
    await puzzlePage.open();
    await expect(puzzlePage.difficultyButtons).toHaveCount(puzzle.difficulties.length);
    await puzzlePage.start(6);
    await expect(puzzlePage.pieces).toHaveCount(36);
  });

  test('AK6: "Poznej podvod" loads and a training starts', { tag: ['@smoke', '@full'] }, async ({ scamGamePage }) => {
    await scamGamePage.open();
    await expect(scamGamePage.emailTile).toBeVisible();
    await scamGamePage.startEmailTraining();
    await expect(scamGamePage.progress).toHaveText(games.scamGame.firstMessageProgress);
  });

  // AK7 and AK8 need the steps for answering a message, planned for phase 6 (game test mode), see US-010.
  test('AK7: answering all questions of a round shows the result', { tag: '@full' }, async ({ scamGamePage }) => {
    test.fixme(true, 'Answering steps are written in phase 6 (game test mode), see US-010');
    await scamGamePage.open();
    await scamGamePage.startEmailTraining();
    await expect(scamGamePage.roundEnd).toBeVisible();
  });

  test('AK8: after each answer the game says whether it was correct', { tag: '@full' }, async ({ scamGamePage }) => {
    test.fixme(true, 'Answering steps are written in phase 6 (game test mode), see US-010');
    await scamGamePage.open();
    await scamGamePage.startEmailTraining();
    await expect(scamGamePage.evaluation).toBeVisible();
  });
});
