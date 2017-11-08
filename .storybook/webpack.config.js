const merge = require('webpack-merge')
const baseConfig = require('../webpack.config');

module.exports = (storybookBaseConfig, configType) => {
  if (configType === 'PRODUCTION') {
    // see https://github.com/storybooks/storybook/issues/1570
    storybookBaseConfig.plugins = storybookBaseConfig.plugins.filter(plugin => plugin.constructor.name !== 'UglifyJsPlugin')
  }

  const extension = {
    resolve: {
      extensions: baseConfig.resolve.extensions
    },
    module: {
      rules: baseConfig.module.rules
    },
    plugins: baseConfig.plugins
  };

  return merge(storybookBaseConfig, extension);
};

