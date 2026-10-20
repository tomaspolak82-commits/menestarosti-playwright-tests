import { test } from '@playwright/test';

// Findings that must not fail the test (recommendations only) go to the report as an annotation.
export function reportWarning(type: string, items: unknown[]): void {
  if (items.length === 0) return;
  test.info().annotations.push({ type: `${type} (warning)`, description: JSON.stringify(items) });
}
