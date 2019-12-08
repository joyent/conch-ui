const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const GitRevisionWebpackPlugin = require('git-revision-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

module.exports = {
    configureWebpack: config => {
        if (process.env.NODE_ENV === 'production') {
            if (!config.plugins) {
                config.plugins = [];
            }

            // clean out the dist/ directory for each build
            config.plugins.push(new CleanWebpackPlugin(['dist']));

            // remove all but english (US) and korean locales from moment.js
            config.plugins.push(
                new webpack.ContextReplacementPlugin(
                    /moment[/\\]locale$/,
                    /en-us|ko/
                )
            );

            // Compress all files with gzip. This allows nginx to serve compressed
            // responses without dynamically compressing files, saving time and CPU
            // Keeps original un-compressed files in output
            config.plugins.push(new CompressionPlugin());
        } else {
            config.optimization = {
                // use actual path names in debugging in browser
                namedModules: true,
            };
        }

        config.resolve.alias = {
            '@api': path.join(__dirname, 'src/api'),
            '@fixtures': path.join(__dirname, 'src/__fixtures__'),
            '@src': path.join(__dirname, 'src'),
            '@views': path.join(__dirname, 'src/views'),
        };

        const gitRevisionPlugin = new GitRevisionWebpackPlugin({
            versionCommand: 'describe --tags --long',
        });

        config.plugins.push(gitRevisionPlugin);

        config.plugins.push(
            new HtmlWebpackPlugin({
                template: './src/index.html',
                favicon: './src/assets/favicon.ico',
            })
        );

        config.plugins.push(
            new webpack.DefinePlugin({
                CONCH: {
                    GLOBALS: {
                        apiUrl: JSON.stringify('http://localhost:5001'),
                        conchUIVersion: JSON.stringify(
                            gitRevisionPlugin.version()
                        ),
                    },
                },
            })
        );
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        open: true,
        overlay: {
            errors: false,
            warnings: false,
        },
        proxy: {
            '/': {
                target: 'http://localhost:5001',
                ws: false,
            },
        },
    },
    filenameHashing: false,
    pages: {
        index: {
            entry: 'src/main.js',
            template: 'src/index.html',
            filename: 'index.html',
            title: 'Conch',
            chunks: ['chunk-vendors', 'chunk-common', 'index'],
        },
    },
};
