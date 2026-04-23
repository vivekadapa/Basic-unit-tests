import { describe, it, expect } from 'vitest';
import { multiplyByTwo } from './multiplyTwo';

describe('multiplyByTwo', () => {
  it('doubles a positive integer', () => {
    const doubled = multiplyByTwo(3);
    expect(doubled).toBe(6);
  });

  it('doubles a negative integer', () => {
    const doubled = multiplyByTwo(-7);
    expect(doubled).toBe(-14);
  });

  it('returns 0 when given 0', () => {
    const doubled = multiplyByTwo(0);
    expect(doubled).toBe(0);
  });

  it('doubles a decimal number', () => {
    const doubled = multiplyByTwo(2.5);
    expect(doubled).toBe(5);
  });

  it('doubles a large number', () => {
    const doubled = multiplyByTwo(1_000_000);
    expect(doubled).toBe(2_000_000);
  });

  it('returns Infinity when given Infinity', () => {
    const doubled = multiplyByTwo(Infinity);
    expect(doubled).toBe(Infinity);
  });

  it('returns NaN when given NaN', () => {
    const doubled = multiplyByTwo(NaN);
    expect(doubled).toBeNaN();
  });
});
