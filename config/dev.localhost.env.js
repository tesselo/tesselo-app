'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./dev.env')

let api;

switch (process.env.API_ENV) {
  case 'localhost':
    api = '"http://localhost/"'
    break;
  case 'staging':
    api = '"https://stagingapi.tesselo.com/"'
    break;
  case 'production':
    api = '"https://api.tesselo.com/"'
    break;
  default:
    api = '"http://localhost/"'
}

module.exports = merge(prodEnv, {
  API_URL: api,
  SENTRY_DSN: ''
})
