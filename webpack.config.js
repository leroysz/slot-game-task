const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

prodCfg = {
    mode: 'production',
    target: ['web', 'es5'],
    entry: {
        main: './src/main.ts',
    },
    devtool: 'none',
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
        new HtmlWebpackPlugin({
            title: 'slot-game-task',
            template: path.resolve(__dirname, './assets/template.html'),
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'assets', to: '', globOptions: {ignore: ['**/index.html']}}
            ]
        }),

        new webpack.ProvidePlugin({
            PIXI: 'pixi.js',
        })
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
};

devCfg = {
    mode: 'development',
    entry: {
        main: './src/main.ts',
    },
    devtool: 'inline-source-map',
    devServer: {
        hot: true,
        inline: true,
        contentBase: './dist',
    },
    plugins: [
        new CleanWebpackPlugin({cleanStaleWebpackAssets: false}),
        new HtmlWebpackPlugin({
            title: 'slot-game-task',
            template: path.resolve(__dirname, './assets/template.html'),
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'assets', to: '', globOptions: {ignore: ['**/index.html']}}
            ]
        }),

        new webpack.ProvidePlugin({
            PIXI: 'pixi.js',
        })
    ],
    target: ['web', 'es5'],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
};

module.exports = (env) => {
    switch (env) {
        case 'production':
            return prodCfg;
        default:
            return devCfg;
    }
};
