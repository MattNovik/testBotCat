const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';
const API_VER = process.env.API_VER ? process.env.API_VER.toLowerCase() : 'development';

const plugins = {
    Define: new webpack.DefinePlugin({
        'process.env': {
            'API_VER': JSON.stringify(API_VER),
            'NODE_ENV': JSON.stringify(NODE_ENV)
        }
    }),
    Html: new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/static/index.html'
    }),
    MiniCssExtractPlugin: new MiniCssExtractPlugin({
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[hash].css'
    }),
    ForkTsCheckerWebpackPlugin: new ForkTsCheckerWebpackPlugin({
        eslint: {
            files: './src/**/*.{ts,tsx,js,jsx}'
        }
    }),
    /* TODO: удалить если не заюзаем owl-carusel */
    Jquery: new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery'
    })
};

module.exports = plugins;
