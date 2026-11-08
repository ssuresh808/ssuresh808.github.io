const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Indices of every em dash (U+2014) or en dash (U+2013) in `text`. */
export function findDashes(text: string): number[] {
  const out: number[] = [];
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (c === 0x2014 || c === 0x2013) out.push(i);
  }
  return out;
}

/** '2023-06' -> 'Jun 2023' */
export function formatMonth(yearMonth: string): string {
  const [y, m] = yearMonth.split('-').map(Number);
  return `${MONTHS[m - 1]} ${y}`;
}

/** ('2023-06', '2024-05') -> 'Jun 2023 to May 2024'; end may be 'present'. */
export function formatRange(start: string, end: string): string {
  const endLabel = end === 'present' ? 'present' : formatMonth(end);
  return `${formatMonth(start)} to ${endLabel}`;
}

/** '2026-07-10' -> 'Jul 10, 2026' (no Date object, so no timezone shift). */
export function formatIsoDate(isoDate: string): string {
  const [y, m, d] = isoDate.slice(0, 10).split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
