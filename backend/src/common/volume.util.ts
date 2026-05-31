export function normalizeVolume(value: number): number {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? rounded : rounded;
}
