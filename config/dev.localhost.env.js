'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./dev.env')

module.exports = merge(prodEnv, {
  API_URL: '"http://localhost/api/"',
  NODE_ENV: '"development"',
  ROUTER_BASE: '"/app"',
  ASSETS_PUBLIC_PATH: '"http://localhost/static/"'
})
