var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/,
      include: __dirname
    }, {
      test: /\.css?$/,
      loaders: ['style', 'raw'],
      include: __dirname
    }]
  }
};


// When inside redux-tcomb repo, prefer src to compiled version.
// You can safely delete these lines in your project.
var reduxTcombSrc = path.join(__dirname, '..', '..', 'lib');
var reduxTcombNodeModules = path.join(__dirname, '..', '..', 'node_modules');
var fs = require('fs');
if (fs.existsSync(reduxTcombSrc) && fs.existsSync(reduxTcombNodeModules)) {
  // Resolve Redux to source
  module.exports.resolve = { alias: { 'redux-tcomb': reduxTcombSrc } };
}
