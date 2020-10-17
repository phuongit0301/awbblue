const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const dotenv = require('dotenv');

const htmlPlugin = new HtmlWebPackPlugin({
    template: path.resolve(__dirname, "templates/index.html"),
    filename: "./index.html"
});

const env = dotenv.config().parsed;
  // reduce it to a nice object, the same as before
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

module.exports = {
    entry: path.resolve(__dirname, './resources/js/index.js'),
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, './public/js')
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: "babel-loader"
                }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin(envKeys)
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './public'),
        headers: { 'Access-Control-Allow-Origin': '*' },
        historyApiFallback: true,
        hot: true
    }
}