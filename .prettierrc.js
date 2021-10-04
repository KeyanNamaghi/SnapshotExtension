const prettierconfig = {
  arrowParens: 'always',
  bracketSpacing: true,
  printWidth: 120,
  proseWrap: 'preserve',
  requirePragma: false,
  semi: false,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  endOfLine: 'auto',
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 2000
      }
    }
  ]
}

module.exports = prettierconfig
