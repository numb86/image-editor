const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = env => ({
  context: path.resolve(__dirname, 'src'),
  entry: {
    bundle: './index.js',
    'css/index': './style.js',
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: 'babel-loader',
      },
      {
        test: /\.scss/,
        use: ExtractTextPlugin.extract({
          use: [
            {loader: 'css-loader', options: {minimize: true, url: false}},
            'sass-loader',
          ],
        }),
      },
    ],
  },
  plugins: [new ExtractTextPlugin({filename: '[name].css'})],
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
  },
});
