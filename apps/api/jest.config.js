export default {
  displayName: 'api',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|mjs)$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: '<rootDir>/tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs'],
  coverageDirectory: '<rootDir>/coverage',
  setupFiles: [],
  testMatch: ['**/tests/**/*.tests.ts', '**/?(*.)+(spec|test).?([mc])[jt]s?(x)'],
  moduleNameMapper: {
    '^./knexfile$': '<rootDir>/src/tests/__mocks__/knexfile.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(smart-enums|case-anything)/)'],
};
