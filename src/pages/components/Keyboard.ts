import type { Locator, Page } from '@playwright/test';
import messages from '../../config/data/messages.json';

export type FocusStop = { name: string; inMain: boolean; hasIndicator: boolean };

// Keyboard use of any page (US-008). Returns what the keyboard reached, the tests judge it.
export class Keyboard {
  readonly skipLink: Locator;
  readonly main: Locator;

  constructor(private readonly page: Page) {
    this.skipLink = page.getByRole('link', { name: messages.skipLinkName });
    this.main = page.getByRole('main');
  }

  async pressTab(): Promise<void> {
    await this.page.keyboard.press('Tab');
  }

  async pressEnter(): Promise<void> {
    await this.page.keyboard.press('Enter');
  }

  // Presses Tab up to `count` times and records every element that got the focus.
  async tabThrough(count: number): Promise<FocusStop[]> {
    const stops: FocusStop[] = [];
    for (let i = 0; i < count; i++) {
      await this.pressTab();
      stops.push(await this.page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return { name: '', inMain: false, hasIndicator: false };
        const style = getComputedStyle(el);
        // A visible focus indicator: an outline or a box shadow drawn by the :focus-visible style.
        const hasIndicator = (style.outlineStyle !== 'none' && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== 'none';
        const name = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().slice(0, 40);
        return { name, inMain: !!el.closest('main'), hasIndicator };
      }));
    }
    return stops;
  }

  // True when the element with the keyboard focus is inside the main content.
  async focusIsInMain(): Promise<boolean> {
    return this.main.evaluate((main) => main.contains(document.activeElement));
  }
}
