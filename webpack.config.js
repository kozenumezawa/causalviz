const path = require('path');

module.exports = {
  entry: {
    bundle: './front/src/index.js'
  },
  output: {
    path: path.join(__dirname, 'front/dist'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        exclude: /node_modules/,
        test: /\.js[x]?$/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      }
    ]
  }
};