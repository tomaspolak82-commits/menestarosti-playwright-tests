// Settings for US-006. Values are in the requirement too (for people); keep both in sync.
export const links = {
  // Statuses that mean "the page is gone" on an external site (AK3).
  deadStatuses: [404, 410],
  // Sites that block automated requests: only the address format is checked, the site is not contacted.
  notContacted: /(^|\.)facebook\.com$|(^|\.)instagram\.com$/i,
  externalTimeoutMs: 30_000,
  email: /^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i,
  phone: /^tel:\+?\d{3,}$/,
} as const;
