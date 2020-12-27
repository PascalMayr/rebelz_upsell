module.exports = {
  extends: [
    'plugin:@shopify/esnext',
    'plugin:@shopify/react',
    'plugin:@shopify/prettier',
  ],
  rules: {
    'import/no-unresolved': 'off',
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'babel/object-curly-spacing': 'off',
    'no-process-env': 'off',
    '@shopify/jsx-no-hardcoded-content': 'off', // Not MVP, we do I18n later
    '@shopify/strict-component-boundaries': 'off',
    'id-length': 'off',
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
