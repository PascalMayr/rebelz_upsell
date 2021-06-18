const { parsed: localEnv } = require('dotenv').config();
const webpack = require('webpack');

const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const nodeEnv = JSON.stringify(process.env.NODE_ENV);
const sentryEnv = JSON.stringify(process.env.SENTRY_DSN_DASHBOARD);

module.exports = {
  webpack: (config) => {
    const env = { API_KEY: apiKey, NODE_ENV: nodeEnv, SENTRY_DSN_DASHBOARD: sentryEnv};
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
};
