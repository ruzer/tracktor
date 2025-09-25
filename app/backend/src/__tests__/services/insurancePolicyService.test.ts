import { describe, it, expect } from '@jest/globals';

// Custom error class for testing
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Helper functions that replicate the business validation logic
function validateDateRange(startDate: string, endDate: string): void {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  
  // Check if start date is after end date
  if (start >= end) {
    throw new ValidationError('Start date must be before end date');
  }
  
  // Check if policy duration exceeds 10 years
  const diffYears = end.getFullYear() - start.getFullYear();
  if (diffYears > 10) {
    throw new ValidationError('Policy duration cannot exceed 10 years');
  }
  
  // Check if start date is more than 5 years in the past
  const fiveYearsAgo = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
  if (start < fiveYearsAgo) {
    throw new ValidationError('Start date cannot be more than 5 years in the past');
  }
}

function validatePremiumAmount(amount: number): void {
  if (amount < 0) {
    throw new ValidationError('Premium amount cannot be negative');
  }
  if (amount > 1000000) {
    throw new ValidationError('Premium amount cannot exceed 1,000,000');
  }
}

function validatePolicyNumber(policyNumber: string): void {
  if (!policyNumber || policyNumber.trim().length === 0) {
    throw new ValidationError('Policy number is required');
  }
  if (policyNumber.length < 3) {
    throw new ValidationError('Policy number must be at least 3 characters long');
  }
  if (policyNumber.length > 50) {
    throw new ValidationError('Policy number cannot exceed 50 characters');
  }
}

describe('Insurance Policy Business Validations', () => {
  describe('validateDateRange', () => {
    it('should pass for valid date range', () => {
      const today = new Date();
      const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
      
      expect(() => {
        validateDateRange(today.toISOString(), nextYear.toISOString());
      }).not.toThrow();
    });

    it('should throw error when start date is after end date', () => {
      const today = new Date();
      const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
      
      expect(() => {
        validateDateRange(today.toISOString(), yesterday.toISOString());
      }).toThrow('Start date must be before end date');
    });

    it('should throw error when policy duration exceeds 10 years', () => {
      const today = new Date();
      const elevenYearsLater = new Date(today.getFullYear() + 11, today.getMonth(), today.getDate());
      
      expect(() => {
        validateDateRange(today.toISOString(), elevenYearsLater.toISOString());
      }).toThrow('Policy duration cannot exceed 10 years');
    });

    it('should throw error when start date is more than 5 years in the past', () => {
      const today = new Date();
      const sixYearsAgo = new Date(today.getFullYear() - 6, today.getMonth(), today.getDate());
      const fiveYearsAgo = new Date(today.getFullYear() - 4, today.getMonth(), today.getDate());
      
      expect(() => {
        validateDateRange(sixYearsAgo.toISOString(), fiveYearsAgo.toISOString());
      }).toThrow('Start date cannot be more than 5 years in the past');
    });
  });

  describe('validatePremiumAmount', () => {
    it('should pass for valid premium amounts', () => {
      expect(() => validatePremiumAmount(100)).not.toThrow();
      expect(() => validatePremiumAmount(50000)).not.toThrow();
      expect(() => validatePremiumAmount(999999)).not.toThrow();
    });

    it('should throw error for negative premium amount', () => {
      expect(() => validatePremiumAmount(-1)).toThrow('Premium amount cannot be negative');
      expect(() => validatePremiumAmount(-100)).toThrow('Premium amount cannot be negative');
    });

    it('should throw error for premium amount exceeding maximum', () => {
      expect(() => validatePremiumAmount(1000001)).toThrow('Premium amount cannot exceed 1,000,000');
      expect(() => validatePremiumAmount(2000000)).toThrow('Premium amount cannot exceed 1,000,000');
    });

    it('should pass for premium amount at maximum boundary', () => {
      expect(() => validatePremiumAmount(1000000)).not.toThrow();
    });

    it('should pass for premium amount at minimum boundary', () => {
      expect(() => validatePremiumAmount(0)).not.toThrow();
    });
  });

  describe('validatePolicyNumber', () => {
    it('should pass for valid policy numbers', () => {
      expect(() => validatePolicyNumber('POL123')).not.toThrow();
      expect(() => validatePolicyNumber('INSURANCE-2024-001')).not.toThrow();
      expect(() => validatePolicyNumber('ABC123XYZ')).not.toThrow();
    });

    it('should throw error for empty policy number', () => {
      expect(() => validatePolicyNumber('')).toThrow('Policy number is required');
      expect(() => validatePolicyNumber('   ')).toThrow('Policy number is required');
    });

    it('should throw error for policy number too short', () => {
      expect(() => validatePolicyNumber('AB')).toThrow('Policy number must be at least 3 characters long');
      expect(() => validatePolicyNumber('X')).toThrow('Policy number must be at least 3 characters long');
    });

    it('should throw error for policy number too long', () => {
      const longPolicyNumber = 'A'.repeat(51);
      expect(() => validatePolicyNumber(longPolicyNumber)).toThrow('Policy number cannot exceed 50 characters');
    });

    it('should pass for policy number at boundary lengths', () => {
      expect(() => validatePolicyNumber('ABC')).not.toThrow(); // 3 characters
      expect(() => validatePolicyNumber('A'.repeat(50))).not.toThrow(); // 50 characters
    });
  });
});