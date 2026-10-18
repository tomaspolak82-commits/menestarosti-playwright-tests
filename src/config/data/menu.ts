import { pages } from './pages';

export const menu = [
  { name: 'Domů', path: pages.home },
  { name: 'Články', path: pages.articles },
  { name: 'Hry', path: pages.games },
  { name: 'Materiál ke stažení', path: pages.downloads },
  { name: 'O nás', path: pages.about },
  { name: 'Kontakt', path: pages.contact },
] as const;
