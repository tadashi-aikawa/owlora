const common = require('./webpack.config');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = Object.assign(common, {
    plugins: [
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: { ecma: 8 },
        }),
    ],
});
