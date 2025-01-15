import nextJest from 'next/jest.js';

// Create Jest config using Next.js settings
const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app (root directory)
});

// Jest configuration
const config = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Setup file for Jest (e.g., adding Testing Library matchers)
  testEnvironment: 'jest-environment-jsdom', // Use jsdom for testing DOM-related components
  preset: 'ts-jest', // Use ts-jest for TypeScript support
  moduleNameMapper: {
    // Handle module aliases (e.g., @/components => src/components)
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '/node_modules/', // Ignore node_modules folder
    '/.next/', // Ignore .next build folder
  ],
  transform: {
    // Transform TypeScript files
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};

// Export the Jest configuration
export default createJestConfig(config);
