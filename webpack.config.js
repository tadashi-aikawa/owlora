const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./src/index.tsx",

    plugins: [
        new webpack.HotModuleReplacementPlugin() // Enable HMR
    ],

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "docs/")
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
    },

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};

