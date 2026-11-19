// Integration tests: run a real soul-cli server with RCO's extensions.
// Run with `yarn test:integration`. Kept separate from `yarn test` (jsdom).
module.exports = {
  rootDir: __dirname,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/integration/**/*.int.test.js'],
  // plain JS tests; .ts app modules they import go through babel
  transform: { '\\.ts$': 'babel-jest' },
  testTimeout: 30000
}
