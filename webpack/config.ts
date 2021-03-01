const LiveReloadPlugin = require("webpack-livereload-plugin");
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as webpack from "webpack";
import * as path from "path";
const isProd = process.env.NODE_ENV === "production";
const isDev = !isProd;
// const bgImage = require("postcss-bgimage");
// import * as autoprefixer from "autoprefixer";
import * as MiniCssExtractPlugin from "mini-css-extract-plugin";
var TerserPlugin = require("terser-webpack-plugin");
import * as OptimizeCSSAssetsPlugin from "optimize-css-assets-webpack-plugin";


import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";
export const analyzeBundle = process.env["ANALYZE_BUNDLE"] === "true";

const plugins: webpack.Plugin[] = [
  new webpack.DefinePlugin({
    __DEVELOPMENT__: isDev
  })
];

if (isDev) {
  //ignore these, to avoid infinite loops while watching
  plugins.push(new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]));
  plugins.push(new LiveReloadPlugin({ port: 35731 }));
  plugins.push(new webpack.HotModuleReplacementPlugin());

  } else {
    plugins.push(
      new MiniCssExtractPlugin({
        filename: '[name].css',
        chunkFilename: '[id].css',
      })
    );
}
plugins.push(
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, "index.html"),
    filename: 'index.html',
    favicon: "./src/assets/kadaster-logo-sm.png"
  })
);

if (analyzeBundle) plugins.push(new BundleAnalyzerPlugin());

export const genericConfig: webpack.Configuration = {
  //We cannot use all source map implementations because of the terser plugin
  //See https://webpack.js.org/plugins/terser-webpack-plugin/#sourcemap
  devtool: isDev ? "inline-source-map" : false,
  cache: isDev,
  optimization: {
    minimize: true, //If you're debugging the production build, set this to false
    //that'll speed up the build process quite a bit
    minimizer: isDev
      ? []
      : [
          new TerserPlugin({
            sourceMap: true
          }),
          new OptimizeCSSAssetsPlugin({})
        ]
  },
  performance: {
    maxEntrypointSize: 3000000,
    maxAssetSize: 3000000
  },
  mode: isDev ? "development" : "production",
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.tsx?$/,
        loader: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: ["last 3 versions", "> 1%"]
                  }
                ]
              ],
              plugins: ["@babel/plugin-transform-runtime"]
            }
          },
          {
            loader: "ts-loader",
            options: {
              configFile: `tsconfig-build.json`
            }
          }
        ]
      },
      {
        test: /\.js$/,
        include: [/query-string/, /strict-uri-encode/, /superagent/, /n3/, /split-on-first/],
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    targets: ["last 3 versions", "> 1%"]
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          { loader: "css-loader", options: { importLoaders:1 } },
          // {
          //   loader: "postcss-loader",
          //   options: { plugins: [autoprefixer()] }
          // },
          "sass-loader"
        ]
      },
      {
        test: /\.js$/,
        use: ["source-map-loader"],
        enforce: "pre"
      },
      {
        test: /\.css$/,
        use: [
          isDev ? "style-loader" : MiniCssExtractPlugin.loader,
          { loader: "css-loader" }
          // { loader: "css-loader", options: { importLoaders: 1 } }
          // {
          //   loader: "postcss-loader",
          //   options: { plugins: () => [bgImage({ mode: "cutter" })] }
          //   // options: { }
          // }
        ]
      },
      {
        test: /\.png$/,
        loader: "file-loader"
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "./../node_modules")],
    // alias: {
    //       [`${fullPackageName}$`]: path.resolve(packagePath, "index.ts")
    // },
    extensions: [".json", ".js", ".ts", ".tsx", ".scss"]
  },
  plugins: plugins
};

const config: webpack.Configuration = {
  ...genericConfig,
  output: {
    path: path.resolve("build"),
    // publicPath: "/",
    filename: function(chunkData: any) {
      const ext = `${isDev ? "" : ".min"}.js`;
      return `${chunkData.chunk.name.toLowerCase()}${ext}`;
    } as any,
    library: "[name]",
    libraryExport: "default",
    libraryTarget: "umd",
    umdNamedDefine: true
  },
  entry: {
    app: [path.resolve(__dirname, "./../src/index.tsx")]
  }
};

export default config;
