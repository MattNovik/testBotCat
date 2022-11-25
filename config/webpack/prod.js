const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const ASSET_PATH = process.env.ASSET_PATH || '/';

const loaders = require('./loaders');
const plugins = require('./plugins');

const config = {
    mode: 'production',
    devtool: false,
    stats: {
        children: false
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss'],
        modules: [path.resolve('src'), path.resolve('node_modules')]
    },
    entry: {
        main: './src/index'
    },
    optimization: {
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            name: true,
            automaticNameDelimiter: '~',
            chunks: 'all',
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors'
                }
            }
        }
    },
    output: {
        publicPath: ASSET_PATH,
        filename: 'js/[name].js',
        pathinfo: true,
        globalObject: 'this'
    },
    module: {
        rules: [
            loaders.lint,
            loaders.babel,
            loaders.scss,
            loaders.images
        ]
    },
    plugins: [
        plugins.Html,
        plugins.Define,
        plugins.Jquery,
        plugins.MiniCssExtractPlugin,
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        })
    ]
};

module.exports = config;
