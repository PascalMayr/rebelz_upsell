module.exports = {
  extends: [
    'plugin:shopify/react',
    'plugin:shopify/polaris',
    'plugin:shopify/jest',
    'plugin:shopify/webpack',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0
  },
  overrides: [
    {
      files: ['*.test.*'],
      rules: {
        'shopify/jsx-no-hardcoded-content': 'off',
      },
    },
  ],
};
