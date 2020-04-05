# Tesselo Vue App

This app is built on top of Pixelmatters Vue Boilerplate, which is an extension of vue-cli webpack template. Beyond the vue-cli features, it specifies:
  * Component/view file tree structure
  * State management (with vuex) structure
  * API management/structure
  * CSS/SCSS Structure
  * Stylelint configuration
  * Eslint configuration
  * Jest configuration/structure
  * Webpack configuration
  * CSS Reset
  * Bootstrap 4

## Available baselayer keys
On the api user profile, it is possible to configure the baselayers shown to the
user. The currently available baselayers can be found in
`src/components/tsl-map/tile-providers.js`. Use the "slug" key in the api list,
and separate values with commas.
Example api config:
```json
{"baselayers": "OpenStreetMap,BW_OpenStreetMap"}
```


## Environment variables
Environment variables are set in `./config/[dev, mock, staging, prod, test].env.js`

## Build Setup

``` bash
# install dependencies
npm install

# build for production with minification
npm run build

# build for production with minification with staging api
npm run build:staging

# build for production with minification with staging api, assets being loaded from app.tesselo.com subdomain.
npm run build:production

# build for production and view the bundle analyzer report
npm run build --report
```

## Development tasks

``` bash
# serve with hot reload at localhost:8080
npm run dev

# run mock server
npm run server:mock

# run app with mock api setting (server:mock should be running)
npm run dev:mock

# run app with localhost api setting (django dev server should be running)
npm run dev:localhost

# run javascript linters
npm run lint

# run css/scss/vue-css linters
npm run lint:css

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```
