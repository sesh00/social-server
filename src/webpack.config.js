const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: {
        user: path.resolve(__dirname, '../src/js/user.js'),
        friends: path.resolve(__dirname, '../src/routes/friends.js'),
        news: path.resolve(__dirname, '../src/routes/news.js'),
        users: path.resolve(__dirname, '../src/routes/users.js'),
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
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.pug$/,
                exclude: /node_modules/,
                use: [
                    'html-loader',
                    'pug-html-loader',
                ],
            },
            {
                test: /\.(json|svg|jpg|jpeg|gif)$/i,
                exclude: /node_modules/,
                type: 'asset/resource',
                generator: {
                    filename: 'data/[name][ext]',
                },
            },
        ],
    },
    plugins: [

        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/views/static/index.pug'),
            filename: 'views/index.html',
        }),
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '../src/views/static/layout.pug'),
            filename: 'views/layout.html',
        }),
        new MiniCssExtractPlugin({
            filename: 'styles/[name].css',
        }),
    ],
    resolve: {

        alias: {
            '/styles/styles.css': path.resolve(__dirname, 'styles/styles.less'),
        }
    },
    devServer: {
        liveReload: false,
        contentBase: path.resolve(__dirname, '../dist'),
        compress: true,
        port: 3000,
    },
};
