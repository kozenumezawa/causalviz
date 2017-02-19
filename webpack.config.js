const path = require('path');

module.exports = {
  entry: {
    bundle: './front/src/index.jsx'
  },
  output: {
    path: path.join(__dirname, 'front/dist'),
    filename: '[name].js'
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader"
      }
    ],
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
  },
  eslint: {
    configFile: './.eslintrc'
  }
};
