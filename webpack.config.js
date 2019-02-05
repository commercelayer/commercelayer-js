const path = require('path')

var devConfig = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'commercelayer.dev.js',
    path: path.resolve(__dirname, "dist")
  }
}

var prodConfig =  {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'commercelayer.min.js',
    path: path.resolve(__dirname, "dist")
  }
}

module.exports = [
  devConfig,
  prodConfig
]
