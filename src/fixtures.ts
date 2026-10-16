import { test as base } from '@playwright/test';

// Page Objects are added here as fixtures, tests never create them with `new`.
type PageFixtures = Record<string, never>;

export const test = base.extend<PageFixtures>({});
export { expect } from '@playwright/test';
