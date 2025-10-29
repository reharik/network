export default {
  displayName: 'api',
  preset: '../../jest.preset.cjs',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx|js|mjs)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'esnext',
        },
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs'],
  coverageDirectory: '<rootDir>/coverage',
  setupFiles: ['<rootDir>/src/tests/setup.ts'],
  testMatch: ['**/tests/**/*.tests.ts', '**/?(*.)+(spec|test).?([mc])[jt]s?(x)'],
  moduleNameMapper: {
    '^./knexfile$': '<rootDir>/src/tests/__mocks__/knexfile.js',
  },
  transformIgnorePatterns: ['node_modules/(?!(smart-enums|case-anything|@network)/)'],
};
