const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// eslint-disable-next-line import/no-extraneous-dependencies
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/view/main.jsx',
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Pico React',
      template: 'index.template.html',
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'public/view/'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js[x]?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            ['@babel/preset-env', { modules: false }],
            '@babel/preset-react',
          ],
        },
      },
    ],
  },
  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['.js', '.jsx', '.es'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
};
