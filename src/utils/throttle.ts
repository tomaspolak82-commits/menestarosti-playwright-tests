// Deliberate pauses that keep the load on the live site low (the hosting stopped responding under full speed).
// Only for pacing requests, never for waiting on the page: synchronisation is done by web-first assertions.
export function pause(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
