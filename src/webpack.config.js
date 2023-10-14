const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        main: path.resolve(__dirname, '../src/client/js/main.js'),
        users: path.resolve(__dirname, '../src/client/js/users.js'),
        friends: path.resolve(__dirname, '../src/client/js/friends.js'),
        news: path.resolve(__dirname, '../src/client/js/news.js'),
        styles: path.resolve(__dirname, '../src/client/styles/main.less'),
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist/client'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.pug$/,
                use: [
                    'html-loader',
                    'pug-html-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/images/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/client/templates/index.pug'),
            filename: 'templates/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../dist/client'),
        compress: true,
        port: 3000,
    },
};
