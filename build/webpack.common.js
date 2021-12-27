const { VueLoaderPlugin } = require('vue-loader')
const path = require('path-browserify')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const webpack = require('webpack')

const mode = process.env.NODE_ENV
let env

switch (mode) {
    case 'production':
        env = require('../config/prod.env');
        break;
    case 'development':
        env = require('../config/dev.localhost.env');
        break;
    default:
        env = require('../config/dev.env');
}

module.exports = {
    entry: './src/main.js',
    // Control how source maps are generated
    devtool: (mode === 'development') ? 'inline-source-map' : false,
    plugins: [
        // Define environmental variables
        new webpack.EnvironmentPlugin({
            NODE_ENV: env.NODE_ENV,
            API_URL: env.API_URL,
            ROUTER_BASE: env.ROUTER_BASE,
            ASSETS_PUBLIC_PATH: env.ASSETS_PUBLIC_PATH,
            SENTRY_DSN: env.SENTRY_DSN,
            GIT_SHA: env.GIT_SHA,
        }),
        new VueLoaderPlugin(),
        new webpack.ProgressPlugin(),
        // Clean dist folder
        new CleanWebpackPlugin(
            {
                path: path.resolve(__dirname, '../dist/**/*'),
            }
        ),
        new webpack.ProvidePlugin(
            {
                canvg: 'canvg',
            }
        ),
    ],
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false,
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': path.resolve('src'),
        },
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: ["vue-loader"]
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    },
                }
            },
            {
                test: /\.(png|jpeg|jpg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: "static/images/[name][hash][ext]"
                },
            },
            {
                test: /\.(svg)$/,
                type: 'asset/resource',
                use: 'svgo-loader',
                generator: {
                    filename: "static/icons/[name][hash][ext]"
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                type: 'asset',
                generator: {
                    filename: "static/fonts/[name][hash][ext]"
                    },
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
        ]
    },
}