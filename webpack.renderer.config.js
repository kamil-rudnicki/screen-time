const path = require('path');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');
const CopyWebpackPlugin = require('copy-webpack-plugin');

rules.push(
  {
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
  },
  {
    test: /\.(png|jpe?g|gif|ico|svg)$/,
    use: [
      {
        loader: "file-loader",
      }
    ]
  },
);

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    alias: {
      ['@']: path.resolve(__dirname, 'src')
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
  },
};
