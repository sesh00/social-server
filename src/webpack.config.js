const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: {
        user: path.resolve(__dirname, '../src/js/user.js'),
        styles: path.resolve(__dirname, '../src/styles/styles.less'),
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, '../dist/js'),
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
            template: path.resolve(__dirname, '../src/views/friends.pug'),
            filename: 'views/friends.html',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/views/index.pug'),
            filename: 'views/index.html',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/views/layout.pug'),
            filename: 'views/layout.html',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/views/news.pug'),
            filename: 'views/news.html',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/views/user.pug'),
            filename: 'views/user.html',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/views/users.pug'),
            filename: 'views/users.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        compress: true,
        port: 3000,
    },
};
