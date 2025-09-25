import { jest, beforeEach } from '@jest/globals';

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.DATABASE_PATH = ':memory:';

// Mock crypto.randomUUID for consistent test results
const mockUUID = jest.fn(() => 'test-uuid-123');
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: mockUUID,
  },
  writable: true,
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
  mockUUID.mockReturnValue('test-uuid-123');
});