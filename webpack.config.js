
var webpack = require('webpack'); 
var path = require('path');
module.exports = {
  entry: './public/scripts/entry.js',
  output: {
    path: __dirname + '/public/out',
    filename: 'index.js'
  },
	module: {
    loaders: [
      {
        include: [
          path.resolve(__dirname, 'public/scripts')
        ],
        test: /\.js$/,
        loader: 'babel-loader'
      }
    ]
	},
  resolve: {
    // Can require('file') instead of require('file.js') etc.
    extensions: ['', '.js', '.json']
  },
  plugins: []
};