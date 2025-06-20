module.exports = {
    root: true,
    env: {
      browser: true,
      es2021: true,
      node: true,
    },
    parser: '@typescript-eslint/parser', // Use TypeScript parser
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    extends: [
      'eslint:recommended',
      // 'plugin:react/recommended',
      // 'plugin:react-hooks/recommended',
      'plugin:jsx-a11y/recommended',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript', // For TypeScript support in imports
      'plugin:@typescript-eslint/recommended', // TypeScript recommended rules
    ],
    plugins: [
      'react',
      'react-hooks',
      'jsx-a11y',
      'import',
      '@typescript-eslint', // TypeScript plugin
    ],
    rules: {
      // React
      'react/prop-types': 'off', // Disable PropTypes (use TypeScript for type checking)
      'react/react-in-jsx-scope': 'off', // React 17+ doesn't require this rule
      'react/jsx-uses-react': 'off', // React 17+ doesn't require this rule
      'react/jsx-uses-vars': 'off', // Ensure variables used in JSX are marked as used
      
      // TypeScript
      '@typescript-eslint/ban-ts-comment': 'off', // Allow @ts-ignore comments
      '@typescript-eslint/no-unused-vars': 'off', // Warn about unused variables
      '@typescript-eslint/explicit-module-boundary-types': 'off', // You can omit return types in functions if you wish
      '@typescript-eslint/no-explicit-any': 'off', // Avoid using `any`, but allow warnings
  
      // General JS/React rules
      'no-console': 'off', // Warn about console logs in production code
      'no-unused-vars': 'off', // Warn about unused variables
      'react/jsx-no-target-blank': 'off', // Prevent potential security vulnerabilities
      'jsx-a11y/anchor-is-valid': 'warn', // Ensure links are valid and accessible
      'jsx-a11y/no-autofocus': 'off', // Prevent auto-focusing elements on page load
      'import/no-unresolved': 'error', // Prevent unresolved imports
      'import/no-named-as-default': 'off', // Prevent accidental default imports
      'import/prefer-default-export': 'off', // Use named exports when necessary
  
      // Prettier integration
      //   'prettier/prettier': 'error', // Ensure Prettier formatting is enforced
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect the version of React
      },
    },
  };
  