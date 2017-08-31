const common = require('./webpack.config');
const webpack = require('webpack');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = Object.assign(common, {
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: { ecma: 8 },
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
    ],
});
