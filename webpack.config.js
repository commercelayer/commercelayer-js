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

module.exports = {
  ...devConfig,
  ...prodConfig,
  module: {
    rules: [
      {
        test: /\.m?js$/,
        //exclude: /(node_modules|bower_components)/,
         exclude:[],
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
