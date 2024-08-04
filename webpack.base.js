const Dotenv = require('dotenv-webpack');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
  entry: { app: path.join(__dirname, 'src/index.js') },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader' } },
      { test: /\.html$/, loader: 'html-loader' },
      { test: /\.css$/, use: [MiniCssExtractPlugin.loader, 'css-loader'] },
      { test: /\.(png|svg|jpg|jpeg|gif)$/i, type: 'asset/resource' },
    ],
  },
  output: {
    path: path.join(__dirname, 'dist'),
    assetModuleFilename: path.join('images', '[name].[contenthash][ext]'),
  },
  plugins: [
    new Dotenv(),
    new FileManagerPlugin({ events: { onStart: { delete: ['dist'] } } }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.join(__dirname, 'src/index.html'),
    }),
    new MiniCssExtractPlugin({ filename: '[name].css', chunkFilename: '[id].css' }),
    new WorkboxPlugin.InjectManifest({
      swDest: 'service.worker.js',
      swSrc: path.join(__dirname, 'src/service.worker.js'),
    }),
  ],
  target: 'web',
};
