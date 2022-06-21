const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  './src/**/*.{js,jsx,ts,tsx}': [buildEslintCommand],
  './src/**/*.{ts,tsx}': ['tsc -p tsconfig.json --noEmit'],
  './src/**/*.{css,scss,less,sass}': ['prettier --write']
}