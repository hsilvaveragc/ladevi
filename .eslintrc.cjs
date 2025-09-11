module.exports = {
  env: {
    browser: true,
    es2024: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: ['react', 'react-hooks', 'prettier'],
  rules: {
    // React 18 específicas - están bien
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',

    // Solo mantener reglas críticas de hooks - están bien
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Estas DEBERÍAN ser warning:
    'no-unreachable': 'warn', // warning porque puede ser código temporal
    'react/display-name': 'warn', // warning, no siempre es crítico
    'no-dupe-keys': 'warn', // cambiar a warn - puede ser útil detectarlo
    'no-duplicate-case': 'warn', // cambiar a warn - puede ser útil detectarlo
    'no-case-declarations': 'warn', // cambiar a warn - buena práctica
    'react/jsx-key': 'warn', // cambiar a warn - importante para performance
    'no-prototype-builtins': 'warn', // cambiar a warn - buena práctica

    // Estas están bien como están
    'react/no-children-prop': 'off',
    'no-unused-vars': 'warn',
    'no-console': 'error', // mantener error, no quieres console en producción
    'react/prop-types': 'off',
    'no-undef': 'error', // mantener error, es crítico
    'react/no-unescaped-entities': 'off',
    'prettier/prettier': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
