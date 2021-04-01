'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./dev.env')

module.exports = merge(prodEnv, {
  API_URL: process.env.API_ENV == 'staging' ? '"https://stagingapi.tesselo.com/"' : '"http://localhost/"',
})
