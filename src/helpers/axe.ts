import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export type AxeFinding = { rule: string; target: string; summary: string };

// Runs the given axe-core rules on the current page and returns one finding per failing element.
export async function axeFindings(page: Page, rules: string[]): Promise<AxeFinding[]> {
  const results = await new AxeBuilder({ page }).withRules(rules).analyze();
  return results.violations.flatMap((violation) =>
    violation.nodes.map((node) => ({
      rule: violation.id,
      target: node.target.join(' '),
      summary: node.failureSummary ?? '',
    })),
  );
}
