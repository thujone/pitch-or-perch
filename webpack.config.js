var path = require('path');
var webpack = require('webpack');

var SRC_DIR = path.resolve(__dirname, 'src/jsx');
var BUILD_DIR = path.resolve(__dirname, 'build/js');

var config = {
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015']
                }
            },

            {
                test: /\.jsx$/,
                include: SRC_DIR,
                loader: 'babel-loader',
                exclude: /node_modules/
            },



            {
                test: /\.html$/,
                loader: "file?name=[name].[ext]"
            }
        ],
        preLoaders: [
            { test: /\.json$/, loader: 'json'}
        ]
    },
    entry: {
        index: SRC_DIR + '/PitchOrPerch.jsx'
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            _: "lodash"
        })
    ],
    output: {
        filename: "[name].bundle.js",
        path: BUILD_DIR
    }
};

module.exports = config;
