import type { Locator, Response } from '@playwright/test';
import { settings } from '../config/settings';
import messages from '../config/data/messages.json';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  protected readonly path = '/kontakty/';

  // Role locators on purpose: the form has a hidden anti-spam field also labelled "Email".
  // getByLabel('Email') can hit that hidden field, getByRole ignores it (aria-hidden).
  readonly emailField: Locator = this.page.getByRole('main').getByRole('textbox', { name: 'Email' });
  readonly messageField: Locator = this.page.getByRole('main').getByRole('textbox', { name: 'Zpráva' });
  readonly submitButton: Locator = this.page.getByRole('main').getByRole('button', { name: messages.contactSubmitButton });

  // Every non-GET request is aborted, so the form can never really be sent from a test.
  submissionAttempts = 0;

  async open(): Promise<Response | null> {
    await this.page.route('**/*', (route) => {
      if (route.request().method() === 'GET') return route.fallback();
      if (new URL(route.request().url()).hostname === new URL(settings.baseURL).hostname) {
        this.submissionAttempts++;
      }
      return route.abort();
    });
    return super.open();
  }

  // <label for="…"> has no ARIA role; CSS by the field id is the only stable link between them.
  async labelOf(field: Locator): Promise<Locator> {
    const id = await field.getAttribute('id');
    return this.page.locator(`label[for="${id}"]`);
  }

  async selectFieldByLabel(field: Locator): Promise<void> {
    await (await this.labelOf(field)).click();
  }

  errorText(text: string): Locator {
    return this.page.getByRole('main').getByText(text, { exact: true });
  }

  async fillForm(email: string, message: string): Promise<void> {
    await this.emailField.fill(email);
    await this.messageField.fill(message);
  }

  async submitForm(): Promise<void> {
    await this.submitButton.click();
  }
}
