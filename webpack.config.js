const path = require('path');

module.exports = [ {

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
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  devtool: 'cheap-inline-module-sourse-map'
}, {

  entry: './Code-View/Reports-React/',

  output: {
    filename: 'Reports.js',
    path: path.resolve(__dirname, 'public/js/dist')
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0', 'react']
        }
      }
    ]
  },
  devtool: 'cheap-inline-module-sourse-map'
} ];
