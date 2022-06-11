const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
    }),
    new webpack.DefinePlugin({
      'process.env.ENVIRONMENT': JSON.stringify(
        process.env.ENVIRONMENT || 'development'
      ),
      'process.env.PORT': JSON.stringify(process.env.PORT || 8080),
      'process.env.BASE_API_URL': JSON.stringify(
        process.env.BASE_API_URL || 'http://localhost:3001'
      ),
      'process.env.WEB_SOCKET_URL': JSON.stringify(
        process.env.WEB_SOCKET_URL || 'ws://localhost:3001'
      ),
    }),
  ],
};
