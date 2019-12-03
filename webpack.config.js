const path = require('path')

var devConfig = {
  mode: 'development',
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/main.js'],
  output: {
    filename: 'commercelayer.dev.js',
    path: path.resolve(__dirname, 'dist')
  }
}

var prodConfig = {
  mode: 'production',
  entry: ['core-js/stable', 'regenerator-runtime/runtime', './src/main.js'],
  output: {
    filename: 'commercelayer.min.js',
    path: path.resolve(__dirname, 'dist')
  }
}

module.exports = {
  ...devConfig,
  ...prodConfig,
  module: {
    rules: [
      {
        test: /\.js$/,
        //exclude: /(node_modules|bower_components)/,
        // exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      }
    ]
  }
}
