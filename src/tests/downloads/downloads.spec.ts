import { test, expect } from '../../fixtures';

test.describe('US-007: Downloads', () => {
  test('AK1: downloads page offers at least one file', { tag: ['@smoke', '@full'] }, async ({ downloadsPage }) => {
    await downloadsPage.open();
    await expect(downloadsPage.fileLinks).not.toHaveCount(0);
    await expect(downloadsPage.fileLinks.filter({ visible: true })).not.toHaveCount(0);
  });
});
