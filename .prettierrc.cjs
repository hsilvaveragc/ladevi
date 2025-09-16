module.exports = {
  // Configuración moderna para React
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  
  // JSX específico
  jsxSingleQuote: true,
  jsxBracketSameLine: false,
  
  // Archivos específicos
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 200,
      },
    },
    {
      files: '*.md',
      options: {
        proseWrap: 'always',
      },
    },
  ],
  
  // Evitar formatear estos archivos
  ignore: [
    'dist/**',
    'build/**',
    'node_modules/**',
    '*.min.js',
  ],
};