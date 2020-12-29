var path    = require('path');
var webpack = require('webpack');



module.exports = function (env) {
    return [{
        target: 'node',
        entry: {
            index: [
                path.resolve(__dirname, 'src/index.ts')
            ]
        },
        output: {
            library: 'example',

            libraryTarget: 'commonjs2',
            filename: 'index.js',
            path: path.resolve(__dirname, 'bin'),
            devtoolModuleFilenameTemplate: '../[resource-path]',
        },
        module: {
            rules: [{
                test: /\.ts$/,
                use: [
                    'babel-loader',
                    'ts-loader',
                ],
            }, {
                test: /\.js$/,
                use: ['babel-loader'],
                resolve: {
                    fullySpecified: false,
                },
            }, {
                test: /\.m?js/,
                resolve: {
                    fullySpecified: false,
                },
            }, {
                enforce: 'pre',
                test: /\.[tj]s$/,
                use: {
                    loader: 'source-map-loader',
                    options: {
                    }
                },
            }]
        },
        plugins: [],
        resolve: {
            extensions: ['.ts', '.js']
        },
        devtool: 'source-map'
    },

]}
