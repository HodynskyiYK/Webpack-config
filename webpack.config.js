const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = (_env, argv) => {
    const isDev = argv.mode === 'development'
    const isProd = !isDev

    return {
        mode: isDev ? 'development' : 'production',
        devtool: isDev && 'source-map',
        entry: './src/index.js',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'assets/js/[name].[hash].js',
            chunkFilename: 'assets/js/[name].[hash].js',
            publicPath: '/'
        },
        resolve: {
            extensions: ['.js', '.jsx']
        },
        devServer: {
            compress: true,
            historyApiFallback: true,
            open: true,
            overlay: true,
            port: 8080
        },
        optimization: {
            minimize: isProd,
            minimizer: [
                new TerserWebpackPlugin(),
                new OptimizeCssAssetsPlugin()
            ],
            splitChunks: {
                chunks: 'all',
            }
        },
        plugins: [
            isProd &&
            new CleanWebpackPlugin(['dist']),
            new MiniCssExtractPlugin({
                filename: 'assets/css/[name].[hash].css',
                chunkFilename: 'assets/css/[name].[hash].css'
            }),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public/index.html'),
                filename: 'index.html',
                minify: {
                    collapseWhitespace: true
                },
                inject: true
            }),
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': JSON.stringify(
                    isProd ? 'production' : 'development'
                )
            })
        ].filter(Boolean),
        module: {
            rules: [
                {
                    test: /\.(js|jsx)?$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                            envName: isProd ? 'production' : 'development'
                        }
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader'
                    ]
                },
                {
                    test: /\.svg$/,
                    use: ['@svgr/webpack']
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name: 'static/media/[name].[hash:8].[ext]'
                        }
                    }
                },
                {
                    test: /\.(eot|otf|ttf|woff|woff2)$/,
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'static/media/[name].[hash:8].[ext]'
                    }
                }
            ]
        }
    }
}