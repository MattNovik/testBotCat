const path = require('path');
const webpack = require('webpack');
const loaders = require('./loaders');
const plugins = require('./plugins');

const ASSET_PATH = process.env.ASSET_PATH || '/';

const config = {
    mode: 'production',
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss'],
        modules: [path.resolve('src'), path.resolve('node_modules')],
    },
    entry: [
        'webpack/hot/only-dev-server',
        'react-hot-loader/patch',
        path.resolve('./src/index')
    ],
    output: {
        publicPath: ASSET_PATH,
        filename: 'js/[name].js',
        pathinfo: true,
        globalObject: 'this'
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false
    },
    module: {
        rules: [
            loaders.tsc,
            loaders.scss,
            loaders.images,
            {
                test: /fonts.*\.woff$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    mimetype: 'application/font-woff',
                    hash: 'sha512',
                    digest: 'hex',
                    name: 'fonts/[hash].[ext]'
                }
            },
            {
                test: /fonts.*\.woff2$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    mimetype: 'application/font-woff2',
                    hash: 'sha512',
                    digest: 'hex',
                    name: 'fonts/[hash].[ext]'
                }
            },
            {
                test: /fonts.*\.ttf$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    mimetype: 'application/octet-stream',
                    hash: 'sha512',
                    digest: 'hex',
                    name: 'fonts/[hash].[ext]'
                }
            },
            {
                test: /fonts.*\.otf$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    mimetype: 'application/font-otf',
                    hash: 'sha512',
                    digest: 'hex',
                    name: 'fonts/[hash].[ext]'
                }
            },
            {
                test: /fonts.*\.eot$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    mimetype: 'application/vnd.ms-fontobject',
                    hash: 'sha512',
                    digest: 'hex',
                    name: 'fonts/[hash].[ext]'
                }
            },
            {
                test: /fonts.*\.svg$/,
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    mimetype: 'image/svg+xml',
                    hash: 'sha512',
                    digest: 'hex',
                    name: 'fonts/[hash].[ext]'
                }
            }
        ]
    },
    plugins: [
        plugins.Html,
        plugins.Define,
        plugins.Jquery,
        plugins.ForkTsCheckerWebpackPlugin,
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        })
    ]
};

module.exports = config;
