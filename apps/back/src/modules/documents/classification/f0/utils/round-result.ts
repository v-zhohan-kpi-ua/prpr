export function roundResult(num: number) {
  if (num === 0) return 0;
  if (num >= 0.01 && num < 1) return 1;

  return Math.round(num);
}
