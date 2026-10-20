// Limits for US-009. Values are in the requirement too (for people); keep both in sync.
export const seo = {
  // Recommended lengths from common practice, not Google rules: outside them is only a warning.
  titleLength: { min: 15, max: 60 },
  descriptionLength: { min: 50, max: 160 },
  titleSuffix: '| Méně starostí',
  shareTags: ['og:title', 'og:description', 'og:image'],
} as const;
