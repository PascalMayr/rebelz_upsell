module.exports = {
  extends: [
    'plugin:@shopify/esnext',
    'plugin:@shopify/prettier',
  ],
  rules: {
    'no-process-env': 'off',
    'no-undef': 'off',
    'babel/object-curly-spacing': 'off',
    'require-atomic-updates': 'off',
    'no-console': 'off'
  },
};
