const common = require('./webpack.common');
const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// require('dotenv').config({ path: path.join(__dirname, '.env') });
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    app: ['@babel/polyfill', './src/index.js'],
  },
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'build'),
    // publicPath: '/test/',
  },
  // optimization: {
  //   runtimeChunk: false,
  //   splitChunks: {
  //     cacheGroups: {
  //       default: false,
  //       vendor: {
  //         test: /[\\/]node_modules[\\/]/,
  //         name: 'vendor',
  //         chunks: 'all',
  //       },

  //     },
  //   },
  // },
  optimization: {
    minimize: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      test: /\.js(\?.*)?$/i,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[fullhash].css',
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      favicon: path.join(__dirname, 'public', 'favicon.ico'),
      filename: 'index.html',
    }),
    new Dotenv({
      path:
        './.env'
      // process.env.sovico === 'prod'
      //   ? './.env.aws.prod'
      //   : process.env.sovico === 'uat'
      //     ? './.env.aws.uat'
      //     : './.env.fis',
    }),
  ],
  performance: {
    hints: 'warning',
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js.gz');
    },
  },
})
