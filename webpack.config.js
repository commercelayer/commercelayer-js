const path = require('path')

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'commercelayer.min.js',
    path: path.resolve(__dirname, "dist")
  },
  module: {
    rules: [
      {
        loader: 'webpack-modernizr-loader',
        options: {
          "feature-detects": [
            "cookies"
          ]
        },
        test: /empty-alias-file\.js$/
      }
    ]
  },
  resolve: {
    alias: {
      modernizr$: path.resolve(__dirname, "./empty-alias-file.js")
    }
  }
}
