const { parsed: localEnv } = require('dotenv').config();
const withCSS = require('@zeit/next-css');
const webpack = require('webpack');

const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const nodeEnv = JSON.stringify(process.env.NODE_ENV);
const tinyMceApiKey = JSON.stringify(process.env.TINY_MCE_API_KEY);

module.exports = withCSS({
  webpack: (config) => {
    const env = {
      API_KEY: apiKey,
      NODE_ENV: nodeEnv,
      TINY_MCE_API_KEY: tinyMceApiKey,
    };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
});
