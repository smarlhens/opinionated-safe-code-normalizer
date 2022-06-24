module.exports = {
  root: true,
  overrides: [
    {
      files: ['*.ts'],
      env: {
        browser: true,
        es6: true,
        node: true,
      },
      plugins: ['@typescript-eslint'],
      parser: '@typescript-eslint/parser',
      rules: {
        '@typescript-eslint/explicit-member-accessibility': [
          'warn',
          {
            accessibility: 'explicit',
            overrides: {
              constructors: 'no-public',
            },
          },
        ],
      },
    },
  ],
};
