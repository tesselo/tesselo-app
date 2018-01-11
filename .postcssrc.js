// https://github.com/michael-ciniawsky/postcss-load-config
var path = require('path');

module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {
      url: 'inline'
    },
    // to edit target browsers: use "browserslist" field in package.json
    "autoprefixer": {}
  }
}
