import { readability } from './readability';

// Settings for US-008. Values are in the requirement too (for people); keep both in sync.
export const accessibility = {
  // axe-core tags for WCAG 2.2 levels A and AA.
  wcagTags: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
  // Contrast is checked by US-004 AK5; checking it here too would report the same finding twice.
  rulesCheckedElsewhere: [readability.contrastRule],
  // axe impact levels that fail the test (AK1); lower ones are only reported (AK2).
  failingImpacts: ['serious', 'critical'],
  imageRules: ['image-alt', 'role-img-alt', 'input-image-alt', 'svg-img-alt'],
  // Enough Tab presses to pass the header and reach the content.
  maxTabStops: 40,
} as const;
