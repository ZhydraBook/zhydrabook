/**
 * Build config for electron 'Main Process' file
 */

import webpack from 'webpack';
import merge from 'webpack-merge';
import BabiliPlugin from 'babili-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import baseConfig from './webpack.config.base';
import DecompressWebpackPlugin from './decompress-webpack-plugin';

export default merge(baseConfig, {
  devtool: 'source-map',

  entry: ['babel-polyfill', './app/main.development'],

  // 'main.js' in root
  output: {
    path: __dirname,
    filename: './build/main.js'
  },

  plugins: [
    /**
     * Babli is an ES6+ aware minifier based on the Babel toolchain (beta)
     */
    new BabiliPlugin(),

    /**
     * Create global constants which can be configured at compile time.
     *
     * Useful for allowing different behaviour between development builds and
     * release builds
     *
     * NODE_ENV should be production so that modules do not perform certain
     * development checks
     */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new CleanWebpackPlugin(['build']),
    new DecompressWebpackPlugin([{
      from: 'ZeroBundle/dist/ZeroBundle-win.zip',
      to: 'build/win'
    }, {
      from: 'ZeroBundle/dist/ZeroBundle-mac-osx.zip',
      to: 'build/mac'
    }, {
      from: 'ZeroBundle/dist/ZeroBundle-linux64.tar.gz',
      to: 'build/linux'
    }], {debug: 'debug'})
  ],

  /**
   * Set target to Electron specific node.js env.
   * https://github.com/chentsulin/webpack-target-electron-renderer#how-this-module-works
   */
  target: 'electron-main',

  /**
   * Disables webpack processing of __dirname and __filename.
   * If you run the bundle in node.js it falls back to these values of node.js.
   * https://github.com/webpack/webpack/issues/2010
   */
  node: {
    __dirname: false,
    __filename: false
  },
});
