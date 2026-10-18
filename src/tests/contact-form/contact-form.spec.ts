import { test, expect } from '../../fixtures';
import form from '../../config/data/contact-form.json';
import knownIssues from '../../config/data/known-issues.json';
import messages from '../../config/data/messages.json';

// Every test leaves at least one field invalid, and ContactPage blocks all sending requests.
test.describe('US-002: Contact form', () => {
  test.beforeEach(async ({ contactPage }) => {
    await contactPage.open();
  });

  test.afterEach(async ({ contactPage }) => {
    expect(contactPage.submissionAttempts, 'the form must never try to send anything').toBe(0);
  });

  test('AK1: fields have visible labels that focus the field', { tag: ['@smoke', '@full'] }, async ({ contactPage }) => {
    for (const field of [contactPage.emailField, contactPage.messageField]) {
      await expect(await contactPage.labelOf(field)).toBeVisible();
      await contactPage.selectFieldByLabel(field);
      await expect(field).toBeFocused();
    }
  });

  test('AK2: empty e-mail shows a message on the page', { tag: ['@smoke', '@full'] }, async ({ contactPage }) => {
    await contactPage.fillForm('', '');
    await contactPage.submitForm();
    await expect(contactPage.errorText(messages.emailRequired)).toBeVisible();
  });

  const knownInvalidEmail = new Map(
    (knownIssues.invalidEmailMessage as { case: string; ref: string }[]).map((issue) => [issue.case, issue.ref]),
  );
  for (const email of form.invalidEmails) {
    test(`AK3: invalid e-mail (${email.case}) shows the invalid e-mail message`, { tag: '@full' }, async ({ contactPage }) => {
      test.fail(knownInvalidEmail.has(email.case), knownInvalidEmail.get(email.case));
      await contactPage.fillForm(email.value, '');
      await contactPage.submitForm();
      await expect(contactPage.errorText(messages.emailInvalid)).toBeVisible();
    });
  }

  for (const email of form.validEmails) {
    test(`AK4: valid e-mail (${email.case}) shows no e-mail error`, { tag: '@full' }, async ({ contactPage }) => {
      await contactPage.fillForm(email.value, '');
      await contactPage.submitForm();
      await expect(contactPage.messageField).toHaveAttribute('aria-invalid', 'true');
      await expect(contactPage.emailField).not.toHaveAttribute('aria-invalid', 'true');
    });
  }

  for (const message of form.blankMessages) {
    test(`AK5: blank message (${message.case}) shows the missing message text (known issue)`, { tag: '@full' }, async ({ contactPage }) => {
      test.fail(true, knownIssues.messageRequiredText.ref);
      await contactPage.fillForm('', message.value);
      await contactPage.submitForm();
      await expect(contactPage.errorText(messages.messageRequired)).toBeVisible();
    });
  }

  test('AK6: invalid field is marked and its message is read by screen readers', { tag: '@full' }, async ({ contactPage }) => {
    await contactPage.fillForm('', '');
    await contactPage.submitForm();
    await expect(contactPage.emailField).toHaveAttribute('aria-invalid', 'true');
    await expect(contactPage.emailField).toHaveAccessibleDescription(messages.emailRequired);
    await expect(contactPage.messageField).toHaveAttribute('aria-invalid', 'true');
    await expect(contactPage.messageField).not.toHaveAccessibleDescription('');
  });

  test('AK7: typed text stays after an error', { tag: '@full' }, async ({ contactPage }) => {
    const invalidEmail = form.invalidEmails[0].value;
    await contactPage.fillForm(invalidEmail, form.sampleMessage);
    await contactPage.submitForm();
    await expect(contactPage.emailField).toHaveValue(invalidEmail);
    await expect(contactPage.messageField).toHaveValue(form.sampleMessage);
  });

  test('AK8: e-mail field is of type e-mail', { tag: '@full' }, async ({ contactPage }) => {
    await expect(contactPage.emailField).toHaveAttribute('type', 'email');
  });

  test('AK9: submit button has a clear Czech text', { tag: '@full' }, async ({ contactPage }) => {
    await expect(contactPage.submitButton).toBeVisible();
  });

  test('AK10: message length is limited (known issue)', { tag: '@full' }, async ({ contactPage }) => {
    test.fail(true, knownIssues.messageMaxLength.ref);
    await expect(contactPage.messageField).toHaveAttribute('maxlength', String(form.maxMessageLength));
    await contactPage.fillForm('', 'a'.repeat(form.maxMessageLength + 1));
    await expect(contactPage.messageField).toHaveValue('a'.repeat(form.maxMessageLength));
  });
});
