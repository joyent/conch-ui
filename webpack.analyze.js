// webpack v4
// Configuration file for BundleAnalyzerPlugin to analyze bundle sizes
// Merges with production configuration

const merge = require('webpack-merge');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');

const prod = require('./webpack.prod.js');

// merge this configuration with webpack.prod.js
module.exports = merge(prod, {
	plugins: [
		new BundleAnalyzerPlugin.BundleAnalyzerPlugin(),
	],
});

