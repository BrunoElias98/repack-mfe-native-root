import { createRequire } from 'node:module';
import path from 'node:path';
import * as Repack from '@callstack/repack';
import TerserPlugin from 'terser-webpack-plugin';

const dirname = Repack.getDirname(import.meta.url);
const { resolve } = createRequire(import.meta.url);

import pkg from './package.json' with { type: 'json' };

/**
 * More documentation, installation, usage, motivation and differences with Metro is available at:
 * https://github.com/callstack/repack/blob/main/README.md
 *
 * The API documentation for the functions and plugins used in this file is available at:
 * https://re-pack.dev
 */

/**
 * Webpack configuration.
 * You can also export a static object or a function returning a Promise.
 *
 * @param env Environment options passed from either Webpack CLI or React Native Community CLI
 *            when running with `react-native start/bundle`.
 */
export default (env) => {
  const {
    mode = 'development',
    context = dirname,
    entry = './index.js',
    platform = process.env.PLATFORM,
    bundleFilename = undefined,
    sourceMapFilename = undefined,
    assetsPath = undefined,
    devServer = {              // Configurar devServer com valores padrão
      port: 8081,
      hot: false, // Desabilitar HMR
    },
    reactNativePath = resolve('react-native'),
  } = env;
  console.log('PACKAGES> >>>>>>> ', pkg.dependencies);
  if (!platform) {
    throw new Error('Missing platform');
  }

  /**
   * Depending on your Babel configuration you might want to keep it.
   * If you don't use `env` in your Babel config, you can remove it.
   *
   * Keep in mind that if you remove it you should set `BABEL_ENV` or `NODE_ENV`
   * to `development` or `production`. Otherwise your production code might be compiled with
   * in development mode by Babel.
   */
  process.env.BABEL_ENV = mode;

  return {
    mode,
    context,
    entry,
    devtool: false,
    resolve: {
      ...Repack.getResolveOptions(platform),
      alias: {
        'react-native': reactNativePath,
      },
    },
    optimization: {
      /** Configure minimizer to process the bundle. */
      minimizer: [
        new TerserPlugin({
          test: /\.(js)?bundle(\?.*)?$/i,
          /**
           * Prevents emitting text file with comments, licenses etc.
           * If you want to gather in-file licenses, feel free to remove this line or configure it
           * differently.
           */
          extractComments: false,
          terserOptions: {
            format: {
              comments: false,
            },
          },
        }),
      ],
    },
    output: {
      clean: true,
      hashFunction: 'xxhash64',
      path: path.join(dirname, 'build/generated', platform),
      filename: 'index.bundle',
      chunkFilename: '[name].chunk.bundle',
      publicPath: Repack.getPublicPath(), // Mover para aqui
    },
    module: {
      /**
       * This rule will process all React Native related dependencies with Babel.
       * If you have a 3rd-party dependency that you need to transpile, you can add it to the
       * `include` list.
       *
       * You can also enable persistent caching with `cacheDirectory` - please refer to:
       * https://github.com/babel/babel-loader#options
       */
      rules: [
        {
          test: /\.[cm]?[jt]sx?$/,
          use: 'babel-loader',
        },
        {
          test: Repack.getAssetExtensionsRegExp(),
          use: {
            loader: '@callstack/repack/assets-loader',
            options: {
              platform,
              devServerEnabled: Boolean(devServer),
              scalableAssetExtensions: Repack.SCALABLE_ASSETS,
            },
          },
        },
      ],
    },
    plugins: [
      /**
       * Configure other required and additional plugins to make the bundle
       * work in React Native and provide good development experience with
       * sensible defaults.
       *
       * `Repack.RepackPlugin` provides some degree of customization, but if you
       * need more control, you can replace `Repack.RepackPlugin` with plugins
       * from `Repack.plugins`.
       */
      new Repack.RepackPlugin({
        context,
        mode,
        platform,
        devServer,                // Usar o devServer configurado
        output: {
          bundleFilename,
          sourceMapFilename,
          assetsPath,
          // Remover publicPath daqui
        },
      }),

      new Repack.plugins.ModuleFederationPluginV2({
        name: 'Root',
        filename: 'Root.container.js.bundle',
        remotes: {
          Cart2: `Cart2@http://localhost:9000/${platform}/Cart2.container.js.bundle`,
        },
        shared: {
          react: {
            singleton: true,
            eager: true,
            requiredVersion: pkg.dependencies.react,
          },
          'react-native': {
            singleton: true,
            eager: true,
            requiredVersion: pkg.dependencies['react-native'],
          },
          zustand: { singleton: true, eager: true, requiredVersion: pkg.dependencies.zustand },
        },
      }),
    ],
  };
};
