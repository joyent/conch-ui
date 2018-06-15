// webpack v4

const merge = require('webpack-merge');
const path = require("path");
const webpack = require('webpack');

const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin")

const common = require('./webpack.common.js');

// merge this configuration with webpack.common.js
module.exports = merge(common, {
	mode: 'production',
	// render files with 6 hex-digit hashes of their content. Adding a hash
	// allows us to use caching more effectively. We can set a long cache TTL
	// and also be guaranteed that new deploys will be loaded by the client.
	output: {
		filename: 'js/[name].[contenthash:6].js',
		chunkFilename: 'js/[name]-chunk.[contenthash:6].js',
	},
	// source maps rendered as separate files with full source code
	devtool: "source-map",
	module: {
		rules: [
			{
				// render and process all SASS and CSS
				test: /(\.s?css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader",
				],
			},
		],
	},
	optimization: {
		// minimize and optimize the rendered Javascript
		minimizer: [
			new UglifyJSPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
			}),
		],
	},
	plugins: [
		// clean out the dist/ directory for each build
		new CleanWebpackPlugin(['dist']),
		// remove all but english (US) and korean locales from moment.js
		new webpack.ContextReplacementPlugin( /moment[\/\\]locale$/, /en-us|ko/),
		new MiniCssExtractPlugin({
			filename: "css/[name].[contenthash:6].css",
		}),
		// Compress all files with gzip. This allows nginx to serve compressed
		// responses without dynamically compressing files, saving time and CPU
		// Keeps original un-compressed files in output
		new CompressionPlugin(),
	],
});
