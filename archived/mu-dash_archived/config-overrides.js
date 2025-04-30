// config-overrides.js
const webpack = require('webpack');

module.exports = function override(config) {
  config.resolve.fallback = {
    util: require.resolve('util/'),
    process: require.resolve('process/browser'),
    stream: require.resolve('stream-browserify'),
    buffer: require.resolve('buffer/'),
    crypto: require.resolve('crypto-browserify'),
    path: require.resolve('path-browserify'),
    assert: require.resolve('assert/'),
    os: require.resolve('os-browserify/browser'),
    url: require.resolve('url/'),
  };

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
      Buffer: ['buffer', 'Buffer'],
    }),
  ]);

  return config;
};