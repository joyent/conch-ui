// webpack v4

const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const GitRevisionWebpackPlugin = require('git-revision-webpack-plugin');
const webpack = require('webpack');

const package = require('./package.json');

const gitRevisionPlugin = new GitRevisionWebpackPlugin();

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
						presets: ['env'],
						plugins: ['syntax-dynamic-import']
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
		// enable chunking
		splitChunks: {
			chunks: 'all'
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
				}
			},
		}),
	],
};

