const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development';

const ASSET_PATH = process.env.ASSET_PATH || '/';

const loaders = {
    tsc: {
        test: /\.(t|j)sx?$/,
        exclude: /node_modules/,
        use: [
            { loader: 'babel-loader' },
            {
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    experimentalWatchApi: true
                }
            }
        ]
    },
    lint: {
        enforce: 'pre',
        test: /\.(t|j)sx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
    },
    babel: {
        test: /\.(t|j)sx?$/,
        loader: 'babel-loader',
        include: [
            path.resolve('src')
        ]
    },
    scss: {
        test: /\.s?css$/,
        use: [
            NODE_ENV === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            'resolve-url-loader',
            {
                loader: 'postcss-loader',
                options: {
                    plugins: []
                }
            },
            'sass-loader'
        ]
    },
    images: {
        test: /\.(gif|png|jpe?g|svg)$/i,
        exclude: /fonts/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[hash].[ext]',
                    publicPath: `${ASSET_PATH}images/`,
                    outputPath: 'images/'
                }
            }
        ]
    }
};

module.exports = loaders;
