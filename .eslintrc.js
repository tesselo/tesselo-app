// https://eslint.org/docs/user-guide/configuring

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  plugins: [
    'vue'
  ],
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  // add your custom rules here
  rules: {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-console': 'off',
  },
  globals: {
    'describe': false,
    'it': false,
    'before': false,
    'beforeEach': false,
    'after': false,
    'afterEach': false,
    'chai': false,
    'expect': false,
    'sinon': false,
    'mount': false,
    'shallow': false,
    'Vue': false,
    "createLocalVue": true,
    "jest": true
  }
}
