export type ElementSize = { name: string; width: number; height: number };

// Elements whose smaller side is below the limit.
export function smallerThan(sizes: ElementSize[], minPx: number): ElementSize[] {
  return sizes.filter((size) => Math.min(size.width, size.height) < minPx);
}
