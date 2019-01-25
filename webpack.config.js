const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'commercelayer.min.js',
    path: path.resolve(__dirname, "dist")
  }
}
