const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./src/index.tsx",

    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public/")
    },

    devServer: {
        hot: true,
        compress: true,
        inline: true
    },

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "awesome-typescript-loader"
            },
            {
                test: /\.js$/,
                use: "source-map-loader",
                enforce: "pre"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(otf|eot|svg|ttf|woff|woff2|jpg|png)(\?.+)?$/,
                use: 'url-loader'
            }
        ]
    }
};

