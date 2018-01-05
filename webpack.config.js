const path = require('path');
const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


const config = {
    plugins: [
        new webpack.optimize.UglifyJsPlugin()        
    ],
    entry: './src/index.js',
    output: {
        filename: 'js/bundle.js',
        path: path.join(__dirname, 'public')
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.js$/,
            },
            {
                use: ['style-loader', 'css-loader'],
                test: /\.css$/
            },
            {
                loader: 'file-loader',
                options: {
                    name: 'js/[hash].[ext]'
                }, 
                test: /\.svg$|\.woff$|\.woff2$|\.eot$|\.ttf$|\.ico$/
            }
        ]
    }
}

module.exports = config;