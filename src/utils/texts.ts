export type PageText = { path: string; text: string };

// Pages whose text length is outside the range, as "path (length): text" for the report.
export function lengthOutside(texts: PageText[], range: { min: number; max: number }): string[] {
  return texts
    .filter(({ text }) => text.length < range.min || text.length > range.max)
    .map(({ path, text }) => `${path} (${text.length}): ${text}`);
}

// Groups of pages that share the same non-empty text.
export function duplicateGroups(texts: PageText[]): string[][] {
  const groups = new Map<string, string[]>();
  for (const { path, text } of texts.filter((item) => item.text !== '')) {
    groups.set(text, [...(groups.get(text) ?? []), path]);
  }
  return [...groups.values()].filter((paths) => paths.length > 1);
}
