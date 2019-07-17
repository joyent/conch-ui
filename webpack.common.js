// webpack v4

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionWebpackPlugin = require('git-revision-webpack-plugin');
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const gitRevisionPlugin = new GitRevisionWebpackPlugin({
	versionCommand: 'describe --tags --long'
});

module.exports = {
	entry: {
		// Main Javascript file
		app: "./src/index.js",
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		modules: [path.join(__dirname, "src"), "node_modules"],
		alias: {
			'@api': path.join(__dirname, 'src/api'),
			'@src': path.join(__dirname, 'src'),
			'@views': path.join(__dirname, 'src/views'),
			'vue$': 'vue/dist/vue.esm.js',
		},
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
						presets: ['@babel/preset-env'],
						plugins: [
							'@babel/plugin-syntax-dynamic-import',
							'@babel/plugin-proposal-object-rest-spread',
							'@babel/plugin-transform-react-jsx',
						]
					}
				},
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader',
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'file-loader',
				options: {
					name: '[name].[ext]',
					outputPath: 'images/',
					publicPath: '../images/',
				},
			},
		],
	},
	optimization: {
		// create a chunk containing only the runtime
		runtimeChunk: true,
		// enable chunking
		splitChunks: {
			chunks: 'all',
		},
	},
	plugins: [
		// render a HTML file that imports all the compiled source files
		new HtmlWebpackPlugin({
			template: 'src/index.html',
			favicon: './src/styles/images/favicon.ico'
		}),
		// Global constants, which should mirror the global constants in jest.config.js
		gitRevisionPlugin,
		new webpack.DefinePlugin({
			CONCH: {
				GLOBALS: {
					apiUrl: JSON.stringify("http://localhost:5001"),
					conchUIVersion: JSON.stringify(gitRevisionPlugin.version()),
				},
			},
		}),
		new VueLoaderPlugin(),
	],
};

