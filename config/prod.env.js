'use strict'
const lastCommitHash = require('child_process').execSync('git rev-parse HEAD').toString().trim()

module.exports = {
  NODE_ENV: 'production',
  API_URL: 'https://api.tesselo.com/',
  ROUTER_BASE: '/',
  ASSETS_PUBLIC_PATH: '/',
  SENTRY_DSN: 'https://cf6346d967244faea4392b66358076dc@o640190.ingest.sentry.io/5760811',
  GIT_SHA: lastCommitHash,
}
