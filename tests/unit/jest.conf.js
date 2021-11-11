const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  testEnvironment: 'jest-environment-jsdom',
  moduleFileExtensions: [
    'js',
    'json',
    'vue'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    "\\.(css)$": "jest-css-modules"
  },
  transform: {
    '\\.vue$': 'vue-jest',
    '\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    "\\.vue$"
  ],
  snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: [
    '<rootDir>/tests/unit/setup',
    'jest-localstorage-mock'
  ]
}
