import AxeBuilder from '@axe-core/playwright';
import type { Page } from '@playwright/test';

export type AxeFinding = { rule: string; impact: string; target: string; summary: string };

async function findings(builder: AxeBuilder): Promise<AxeFinding[]> {
  const results = await builder.analyze();
  return results.violations.flatMap((violation) =>
    violation.nodes.map((node) => ({
      rule: violation.id,
      impact: node.impact ?? violation.impact ?? 'unknown',
      target: node.target.join(' '),
      summary: node.failureSummary ?? '',
    })),
  );
}

// Runs the given axe-core rules on the current page and returns one finding per failing element.
export async function axeFindings(page: Page, rules: string[]): Promise<AxeFinding[]> {
  return findings(new AxeBuilder({ page }).withRules(rules));
}

// Runs all axe-core rules for the given standard tags (e.g. WCAG 2.2 AA), except rules checked elsewhere.
export async function axeFindingsByTags(page: Page, tags: readonly string[], skipRules: readonly string[]): Promise<AxeFinding[]> {
  return findings(new AxeBuilder({ page }).withTags([...tags]).disableRules([...skipRules]));
}
