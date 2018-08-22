const webpack = require("webpack");
const common = require("./webpack.config");

module.exports = Object.assign(common, {
    mode: 'development',
    plugins: [new webpack.HotModuleReplacementPlugin()],

    devServer: {
        hot: true,
        compress: true,
        inline: true,
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    externals: {
        react: "React",
        "react-dom": "ReactDOM",
    },
});
