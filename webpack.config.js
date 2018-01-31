var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './public/js/test',
  output: {
    filename: 'Test.js',
    path: path.resolve(__dirname, 'public/js')
  },
  module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 exclude: /node_modules/,
                 query: {
                     presets: ['react'],
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
};
