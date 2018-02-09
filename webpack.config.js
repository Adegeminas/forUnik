var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

  entry: './Code-View/Entries-React/',

  output: {
    filename: 'Entries.js',
    path: path.resolve(__dirname, 'public/js/dist')
  },

  module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 exclude: /node_modules/,
                 query: {
                     presets: ['es2015', 'stage-0', 'react'],
                 }
             }
         ]
     },
  devtool: "cheap-inline-module-sourse-map",
   // stats: {
   //     colors: false
   // },
   // watch: true,
   // plugins: [
   //   new CleanWebpackPlugin(['public/js/dist']),
   // ],
};
