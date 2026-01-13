import HtmlInlineScriptWebpackPlugin from 'html-inline-script-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import TerserPlugin from 'terser-webpack-plugin';
import { VueLoaderPlugin } from 'vue-loader';
import webpack from 'webpack';
const require = createRequire(import.meta.url);
const HTMLInlineCSSWebpackPlugin = require('html-inline-css-webpack-plugin').default;

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (_env, argv) => ({
  experiments: {
    outputModule: true,
  },
  devtool: argv.mode === 'production' ? false : 'eval-source-map',
  watchOptions: {
    ignored: ['**/dist', '**/node_modules'],
  },
  entry: path.join(__dirname, 'src/main.js'),
  target: 'browserslist',
  output: {
    filename: 'index.js',
    path: path.join(__dirname, 'dist'),
    clean: true,
    publicPath: '',
    library: {
      type: 'module',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.s(a|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'postcss-loader',
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { url: false } },
          'postcss-loader',
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.vue', '.css'],
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/index.html'),
      filename: 'index.html',
      scriptLoading: 'module',
      cache: false,
    }),
    new HtmlInlineScriptWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HTMLInlineCSSWebpackPlugin({
      styleTagFactory({ style }) {
        return `<style>${style}</style>`;
      },
    }),
    new VueLoaderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
    }),
  ],
  optimization: {
    minimize: argv.mode === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: { quote_style: 1 },
          mangle: { reserved: ['_', 'toastr', 'YAML', '$', 'z'] },
        },
      }),
    ],
  },
  externals: ({ context, request }, callback) => {
    if (!context || !request) {
      return callback();
    }

    // 本地文件/内部loader直接打包
    if (
      request.startsWith('-') ||
      request.startsWith('.') ||
      request.startsWith('/') ||
      request.startsWith('!') ||
      request.startsWith('http') ||
      request.startsWith('@/') ||
      path.isAbsolute(request) ||
      fs.existsSync(path.join(context, request)) ||
      fs.existsSync(request)
    ) {
      return callback();
    }

    // 酒馆助手提供的全局变量
    const globals = {
      jquery: '$',
      lodash: '_',
      toastr: 'toastr',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      yaml: 'YAML',
      zod: 'z',
      pinia: 'Pinia',
    };

    if (request in globals) {
      return callback(null, 'var ' + globals[request]);
    }

    // 其他依赖从CDN加载
    return callback(
      null,
      'module-import ' + `https://testingcf.jsdelivr.net/npm/${request}/+esm`
    );
  },
});
