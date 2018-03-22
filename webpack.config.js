const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LicenseInfoWebpackPlugin = require('license-info-webpack-plugin').default;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const plugins = [new ExtractTextPlugin({filename: '[name].css'})];
  if (isProduction) {
    plugins.push(
      new LicenseInfoWebpackPlugin({
        glob: '{LICENSE,license,License}*',
      })
    );
  }
  return {
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
    plugins,
    optimization: isProduction
      ? {
          minimizer: [
            new UglifyJsPlugin({
              uglifyOptions: {
                output: {
                  comments: /^\**!|@preserve|@license|@cc_on/,
                },
              },
            }),
          ],
        }
      : {},
    devServer: {
      contentBase: path.resolve(__dirname, 'public'),
    },
  };
};
