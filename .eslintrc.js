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
      'plugin:react/recommended',
      'plugin:react-hooks/recommended',
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
      'react/jsx-uses-vars': 'error', // Ensure variables used in JSX are marked as used
  
      // TypeScript
      '@typescript-eslint/no-unused-vars': 'warn', // Warn about unused variables
      '@typescript-eslint/explicit-module-boundary-types': 'off', // You can omit return types in functions if you wish
      '@typescript-eslint/no-explicit-any': 'warn', // Avoid using `any`, but allow warnings
  
      // General JS/React rules
      'no-console': 'warn', // Warn about console logs in production code
      'no-unused-vars': 'warn', // Warn about unused variables
      'react/jsx-no-target-blank': 'warn', // Prevent potential security vulnerabilities
      'jsx-a11y/anchor-is-valid': 'warn', // Ensure links are valid and accessible
      'import/no-unresolved': 'error', // Prevent unresolved imports
      'import/no-named-as-default': 'warn', // Prevent accidental default imports
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
  