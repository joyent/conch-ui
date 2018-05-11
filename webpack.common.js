// webpack v4

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const package = require('./package.json');

module.exports = {
    entry: {
        // Main Javascript file
        app: "./src/index.js",
    },
    resolve: {
        alias: {
            // allow `import from 'config'` to be mapped to the config.js file
            // in the directory root
            config: path.join(__dirname, 'config.js')
        }
    },
    // disable warnings about bundle sizes
    performance: { hints: false },
    module: {
        rules: [
            {
                // transpile all source javascript with babel
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    // configuration for babel. Add configuration here instead
                    // of a .babelrc file
                    options: {
                        presets: ['env']
                    }
                },
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]',
                    outputPath: 'images/',
                    publicPath: '../images/',
                },
            }
        ],
    },
    optimization: {
        // create a chunk containing only the runtime
        runtimeChunk: true,
        // enable chunking, splitting dependencies into vendor bundle
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all',
                },
            },
        },
    },
    plugins: [
        // render a HTML file that imports all the compiled source files
        new HtmlWebpackPlugin({
            template: 'src/index.html'
        }),
    ],
};

