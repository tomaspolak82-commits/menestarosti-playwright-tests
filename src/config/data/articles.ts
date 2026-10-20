// Limits for US-005. Values are in the requirement too (for people); keep both in sync.
export const articleChecks = {
  // AK1: shortest article had about 6 200 characters on 2026-10-19.
  minTextChars: 500,
  // AK5 applies to articles published on or after this date (site local time); older ones get sources later.
  sourcesRequiredFrom: '2026-10-11',
  // AK5: heading of the collapsible sources block ("Zdroje, ze kterých jsme čerpali").
  sourcesHeading: /^zdroje\b/i,
  // AK6: schema.org properties of the <time> elements with the publish and modification date.
  publishedDateProp: 'datePublished',
  modifiedDateProp: 'dateModified',
  // AK2: how long images may take to load before they count as broken.
  imageLoadTimeoutMs: 15_000,
} as const;
