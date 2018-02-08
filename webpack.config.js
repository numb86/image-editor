const path = require('path');

const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    'public/bundle': './index.js',
    'experiment/deterioration/deterioration': './experiment/deterioration.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'flow', 'react'],
              plugins: ['transform-class-properties'],
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'build'),
    historyApiFallback: true,
  },
};

module.exports = config;
