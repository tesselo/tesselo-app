'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_URL: '"https://tesselo.com/api/"',
  ROUTER_BASE: '"/"',
  ASSETS_PUBLIC_PATH: '"/"',
  SENTRY_DSN: '""'
})
