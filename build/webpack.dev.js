const path = require('path-browserify')
const common = require('./webpack.common')
const { merge } = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')


const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: 'main.bundle.js',
        path: path.resolve(__dirname, '../dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './index.html',
        }),
    ],
    devServer: {
        historyApiFallback: true,
        hot: true,
        compress: true,
        host: HOST || 'localhost',
        port: PORT || 8080,
        open: true,
        client: {
            overlay: {
                errors: true,
                warnings: false,
            },
            progress: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.s?[ac]ss$/,
                use: [
                    "style-loader",     // 3. Inject styles into DOM
                    "css-loader",       // 2. Turns css into commonjs
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
                    "sass-loader",      // 1. Turns sass into css
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