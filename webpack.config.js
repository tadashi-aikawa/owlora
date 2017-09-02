const path = require('path');

module.exports = {
    entry: "./src/index.tsx",

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "public/")
    },

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
                exclude: /node_modules/,
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
