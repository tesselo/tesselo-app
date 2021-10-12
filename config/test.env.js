'use strict'
const { merge } = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  ROUTER_BASE: '"/"',
  ASSETS_PUBLIC_PATH: '"/"'
})
