import { describe, it, expect } from 'vitest';
import { findDashes, formatMonth, formatRange, formatIsoDate } from '@/lib/text';

describe('text helpers', () => {
  it('finds em and en dashes by index', () => {
    expect(findDashes('a — b – c')).toEqual([2, 6]);
    expect(findDashes('plain - hyphen')).toEqual([]);
  });
  it('formats year-month and ranges', () => {
    expect(formatMonth('2023-06')).toBe('Jun 2023');
    expect(formatRange('2023-06', '2024-05')).toBe('Jun 2023 to May 2024');
    expect(formatRange('2026-05', 'present')).toBe('May 2026 to present');
  });
  it('formats ISO dates without timezone drift', () => {
    expect(formatIsoDate('2026-07-10')).toBe('Jul 10, 2026');
  });
});
