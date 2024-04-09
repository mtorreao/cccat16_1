/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  watchPathIgnorePatterns: ['data', 'node_modules'],
  collectCoverageFrom: [
    'src/**/*.ts'
  ]
};