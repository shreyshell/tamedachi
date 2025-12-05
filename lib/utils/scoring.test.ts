/**
 * Tests for scoring utilities
 */

import { describe, it, expect } from 'vitest';
import { categorizeScore, getQualityCategory, calculateHealthState, calculateAge, validateURL } from './scoring';

describe('categorizeScore', () => {
  it('should return excellent message for scores 80-100', () => {
    expect(categorizeScore(80)).toBe("Excellent source! High credibility.");
    expect(categorizeScore(90)).toBe("Excellent source! High credibility.");
    expect(categorizeScore(100)).toBe("Excellent source! High credibility.");
  });

  it('should return good message for scores 60-79', () => {
    expect(categorizeScore(60)).toBe("Good source. Generally reliable.");
    expect(categorizeScore(70)).toBe("Good source. Generally reliable.");
    expect(categorizeScore(79)).toBe("Good source. Generally reliable.");
  });

  it('should return questionable message for scores 40-59', () => {
    expect(categorizeScore(40)).toBe("Questionable source. Be cautious.");
    expect(categorizeScore(50)).toBe("Questionable source. Be cautious.");
    expect(categorizeScore(59)).toBe("Questionable source. Be cautious.");
  });

  it('should return poor message for scores 0-39', () => {
    expect(categorizeScore(0)).toBe("Poor source. Low credibility.");
    expect(categorizeScore(20)).toBe("Poor source. Low credibility.");
    expect(categorizeScore(39)).toBe("Poor source. Low credibility.");
  });
});

describe('getQualityCategory', () => {
  it('should return correct category for each score range', () => {
    expect(getQualityCategory(85)).toBe('excellent');
    expect(getQualityCategory(65)).toBe('good');
    expect(getQualityCategory(45)).toBe('questionable');
    expect(getQualityCategory(25)).toBe('poor');
  });
});

describe('calculateHealthState', () => {
  it('should return very-happy for scores 80-100', () => {
    const result = calculateHealthState(85);
    expect(result.state).toBe('very-happy');
    expect(result.message).toContain('thriving');
  });

  it('should return healthy for scores 60-79', () => {
    const result = calculateHealthState(65);
    expect(result.state).toBe('healthy');
    expect(result.message).toContain('doing well');
  });

  it('should return neutral for scores 40-59', () => {
    const result = calculateHealthState(45);
    expect(result.state).toBe('neutral');
    expect(result.message).toContain('okay');
  });

  it('should return unhappy for scores 20-39', () => {
    const result = calculateHealthState(25);
    expect(result.state).toBe('unhappy');
    expect(result.message).toContain('needs better');
  });

  it('should return sick for scores 0-19', () => {
    const result = calculateHealthState(10);
    expect(result.state).toBe('sick');
    expect(result.message).toContain('struggling');
  });
});

describe('calculateAge', () => {
  it('should calculate age correctly', () => {
    expect(calculateAge(0)).toBe(0);
    expect(calculateAge(50)).toBe(0);
    expect(calculateAge(99)).toBe(0);
    expect(calculateAge(100)).toBe(1);
    expect(calculateAge(150)).toBe(1);
    expect(calculateAge(199)).toBe(1);
    expect(calculateAge(200)).toBe(2);
    expect(calculateAge(500)).toBe(5);
  });
});

describe('validateURL', () => {
  it('should accept valid HTTP URLs', () => {
    const result = validateURL('http://example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid HTTPS URLs', () => {
    const result = validateURL('https://example.com');
    expect(result.isValid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should reject empty strings', () => {
    const result = validateURL('');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a URL');
  });

  it('should reject whitespace-only strings', () => {
    const result = validateURL('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a URL');
  });

  it('should reject malformed URLs', () => {
    const result = validateURL('not a url');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please enter a valid URL (e.g., https://example.com)');
  });

  it('should reject non-HTTP protocols', () => {
    const result = validateURL('ftp://example.com');
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Only HTTP and HTTPS URLs are supported');
  });
});
