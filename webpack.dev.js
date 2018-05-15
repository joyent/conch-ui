const merge = require('webpack-merge');
const path = require("path");
const webpack = require('webpack');


const common = require('./webpack.common.js');

// merge this configuration with webpack.common.js
module.exports = merge(common, {
    mode: 'development',
    // build files without hashes
    output: {
        filename: '[name].js',
        chunkFilename: '[name]-chunk.js',
    },
    // source map contained in source file. Fast for rebuilds but large
    // file-size.
    devtool: "eval-source-map",

    // enable webpack-dev-server with Hot Module Reloading (HMR)
    devServer: {
        contentBase: './dist',
        hot: true,
        // show warnings and errors in the browser (will also show in command
        // line)
        overlay: {
            warnings: true,
            errors: true
        }
    },
    module: {
        rules: [
            {
                test: /(\.s?css)$/,
                use: [
                    // this may be unnecessary. Evaluating
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ]
            }
        ],
    },
    optimization: {
        // use actual path names in debugging in browser
        namedModules: true,
    },
    plugins: [
        // enables HMR
        new webpack.HotModuleReplacementPlugin(),
    ],
});
