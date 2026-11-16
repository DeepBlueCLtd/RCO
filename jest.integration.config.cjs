// Integration tests: run a real soul-cli server with RCO's extensions.
// Run with `yarn test:integration`. Kept separate from `yarn test` (jsdom).
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/integration/**/*.int.test.js'],
  transform: {},
  testTimeout: 30000
}
