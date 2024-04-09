/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  testPathIgnorePatterns: ['data', 'node_modules'],
  watchPathIgnorePatterns: ['data', 'node_modules'],
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
};