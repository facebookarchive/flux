module.exports = {
  modulePathIgnorePatterns: ['/lib/', '/node_modules/'],
  transformIgnorePatterns: ['/node_modules/'],
  rootDir: './',
  transform: {
    '\\.js$': './scripts/jest/preprocessor.js',
  },
  setupFiles: ['./scripts/jest/environment.js'],
  roots: ['<rootDir>/src'],
  modulePaths: [
    '<rootDir>/src',
    '<rootDir>/src/container',
    '<rootDir>/src/stores',
  ],
  testEnvironment: 'jsdom',
};
