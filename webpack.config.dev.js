const common = require('./webpack.config');

module.exports = Object.assign(common, {
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
});
