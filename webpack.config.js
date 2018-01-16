var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: './src/js/notice.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist/',
    filename: 'notice.js',
    library: 'NoticeJs',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        })
      }
    ]
  },
  stats: {
    colors: true
  },
  plugins: [
    new ExtractTextPlugin("noticejs.css"),
  ]
};

module.exports = config;