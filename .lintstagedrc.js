const path = require('path')

const buildEslintCommand = (filenames) =>
  `next lint --fix --file ${filenames
    .map((f) => path.relative(process.cwd(), f))
    .join(' --file ')}`

module.exports = {
  '*.{js,jsx,ts,tsx}': [buildEslintCommand],
  '*.{ts,tsx}': ['tsc -p tsconfig.json --noEmit'],
  '*.{css,scss,less,sass}': ['prettier --write']
}