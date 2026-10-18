import { defineConfig, devices } from '@playwright/test';
import { settings } from './src/config/settings';

export default defineConfig({
  testDir: './src/tests',
  // Deliberately slow: the live site stopped responding under full-speed runs (2026-10-17).
  // One test at a time plus pauses (src/config/data/site.json, throttle). There is no hurry.
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list'], ['html']],
  use: {
    baseURL: settings.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Checks without a browser (*.api.spec.ts) run once, not in every browser.
    { name: 'api', testMatch: /.*\.api\.spec\.ts/ },
    ...[
      { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
      { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
      { name: 'desktop-safari', use: { ...devices['Desktop Safari'] } },
      { name: 'mobile-android', use: { ...devices['Galaxy S24'] } },
      { name: 'mobile-iphone', use: { ...devices['iPhone 15'] } },
    ].map((project) => ({ ...project, testIgnore: /.*\.api\.spec\.ts/ })),
  ],
});
