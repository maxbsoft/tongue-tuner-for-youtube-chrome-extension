module.exports = {
  preset: 'ts-jest',
  clearMocks: true,
  collectCoverage: true,
  verbose: true,
  testEnvironment: 'jsdom', // или 'node', если вы не работаете с DOM
  // setupFilesAfterEnv: ['./jest-setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    // Другие псевдонимы
  },
  // Остальная конфигурация Jest
};
export {};
