import { defineConfig, devices } from '@playwright/test';
import { settings } from './src/config/settings';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // Live production site: keep the load low.
  workers: 2,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : [['list'], ['html']],
  use: {
    baseURL: settings.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'desktop-chrome', use: { ...devices['Desktop Chrome'] } },
    { name: 'desktop-firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'desktop-safari', use: { ...devices['Desktop Safari'] } },
    { name: 'mobile-android', use: { ...devices['Galaxy S24'] } },
    { name: 'mobile-iphone', use: { ...devices['iPhone 15'] } },
  ],
});
