const path = require('path-browserify')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const SentryPlugin = require("@sentry/webpack-plugin") 

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'static/js/[name].[contenthash].js',
        publicPath: '/',
    },
    optimization: {
        runtimeChunk: {
            name: 'manifest',
        },
        minimizer: [
            new CssMinimizerPlugin(),
            // Js minimizer
            new TerserPlugin(
                {
                    terserOptions: {
                        format: {
                            comments: false,
                        },
                    },
                    extractComments: false,
                     // enable parallel running
                    parallel: true,
                }
            ),
            new HtmlWebpackPlugin({
                filename: './index.html',
                template: './index.html',
                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true,
                }
            }),
        ],
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: 'vendor',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                }
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin(
            {
                filename: 'static/css/[name].[contenthash].css'
            }
        ),
        new ImageMinimizerPlugin(
            {
                minimizerOptions: {
                // Lossless optimization with custom option
                    plugins: [
                        ['jpegtran', { progressive: true }],
                        ['optipng', { optimizationLevel: 5 }],
                    ],
                },
            }
        ),
        new SentryPlugin({
            release: '1.0.0',
            include: './dist',
            ignore: ['node_modules', 'build'],
          }),
    ],
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use: [
                    MiniCssExtractPlugin.loader , // 3. Extract css into files
                    'css-loader',       // 2. Turns css into commonjs
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [ "postcss-preset-env"],
                                ],
                            },
                        },
                    },
                    'sass-loader',      // 1. Turns sass into css
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: ['./src/theme/_colors.scss', './src/theme/_mixins.scss']
                        },
                    },
                ],
            },
        ]
    }
})