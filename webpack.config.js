const path = require('path');
const glob = require('glob');
const argv = require('yargs').argv;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin= require('copy-webpack-plugin');

const isDevelopment = argv.mode === 'development';
const isProduction = !isDevelopment;
const distPath = path.join(__dirname, '/public');

const config = {
  entry: [
    './src/js/index.js',
    './src/scss/style.scss'
  ],
  output: {
    filename: 'bundle.js',
    path: distPath
  },
  watch: isDevelopment,
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader'
      }]
    }, {
      test: /\.scss$/,
      exclude: /node_modules/,
      use: ExtractTextPlugin.extract({
        use: [
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: [
              isProduction ? require('cssnano') : () => {},
              require('autoprefixer')({
                browsers: ['last 2 versions']
              })
            ]
          }
        },
        'sass-loader'
        ]})
    }, {
      test: /\.(eot|otf|woff|woff2|ttf)$/,
      use: {
          loader: 'file-loader',
          options: {
              name: '[name].[hash].[ext]',
          },
      },
    }]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'css/style.bundle.css',
      allChunks: true,
    }),
    new CopyWebpackPlugin([{
      from: './src/fonts',
      to: distPath + '/fonts'
    }]),
    ...glob.sync('./src/*.html')
      .map(htmlFile => {
        return new HtmlWebpackPlugin({
          filename: path.basename(htmlFile),
          template: htmlFile
        });
      })
  ],
  optimization: isProduction ? {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          compress: {
            inline: false,
            drop_console: true
          },
        },
      }),
    ],
  } : {},
  devServer: {
    contentBase: distPath,
    port: 9000,
    compress: true,
    open: true
  }
};

module.exports = config;
