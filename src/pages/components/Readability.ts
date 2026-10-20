import type { Locator, Page } from '@playwright/test';
import { readability } from '../../config/data/readability';
import type { ElementSize } from '../../utils/sizes';

export type TextSize = { fontSizePx: number; text: string };

// Layout measurements on any page of the site (US-004). Returns numbers, the tests judge them.
export class Readability {
  readonly paragraphs: Locator;
  readonly actionButtons: Locator;

  constructor(private readonly page: Page) {
    this.paragraphs = page.getByRole('main').getByRole('paragraph');
    // CSS on purpose: WordPress button blocks are links (role link) recognisable only by their classes,
    // and the small icon controls (carousel dots and arrows, submenu arrow) are left out here because
    // axe target-size covers them in US-008 (finding #22).
    this.actionButtons = page.locator(
      'button:not(.splide__pagination__page):not(.splide__arrow):not(.dropdown-nav-special-toggle), .wp-block-button__link, .kb-button',
    );
  }

  async resize(viewport: { width: number; height: number }): Promise<void> {
    await this.page.setViewportSize(viewport);
  }

  // How many pixels the page is wider than the window (0 = no horizontal scrolling).
  async horizontalOverflowPx(): Promise<number> {
    return this.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  }

  async bodyTextSizes(): Promise<TextSize[]> {
    return this.paragraphs.filter({ visible: true }).evaluateAll(
      (elements, minChars) =>
        elements
          .map((el) => ({ fontSizePx: parseFloat(getComputedStyle(el).fontSize), text: (el as HTMLElement).innerText.trim() }))
          .filter((item) => item.text.length >= minChars)
          .map((item) => ({ fontSizePx: item.fontSizePx, text: item.text.slice(0, 50) })),
      readability.minParagraphChars,
    );
  }

  async sizesOf(elements: Locator): Promise<ElementSize[]> {
    return elements.filter({ visible: true }).evaluateAll((items) =>
      items.map((el) => {
        const box = el.getBoundingClientRect();
        const name = ((el as HTMLElement).innerText || el.getAttribute('aria-label') || '').trim().slice(0, 40);
        return { name, width: Math.round(box.width * 10) / 10, height: Math.round(box.height * 10) / 10 };
      }),
    );
  }

  // Simulates the browser setting "default font size". Chromium only (DevTools protocol).
  async setDefaultFontSize(px: number): Promise<void> {
    const session = await this.page.context().newCDPSession(this.page);
    await session.send('Page.setFontSizes', { fontSizes: { standard: px } });
  }
}
