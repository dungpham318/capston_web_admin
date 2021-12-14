const { merge } = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const common = require('./webpack.common');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.bundle.js',
    publicPath: '/',
  },
  devtool: 'inline-source-map',
  devServer: {
    host: '0.0.0.0',
    port: 9090,
    contentBase: path.join(__dirname, 'src'),
    historyApiFallback: true,
    writeToDisk: true,
    watchContentBase: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      favicon: path.join(__dirname, 'public', 'favicon.ico'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    }),
    new Dotenv({
      path: './.env.dev',
    }),
  ],
});
