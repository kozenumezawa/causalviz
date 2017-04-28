const path = require('path');
const webpack = require('webpack');

const options = {
  entry: {
    bundle: './front/src/index.jsx'
  },
  output: {
    path: path.join(__dirname, 'front/dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: [
          {
            loader: "eslint-loader"
          }
        ]
      },
      {
        test: /\.js[x]?$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              presets: ['react', 'es2015']
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  options.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false
    }
  }));
} else {
  Object.assign(options, {
    devtool: 'inline-source-map'
  });
}

module.exports = options;