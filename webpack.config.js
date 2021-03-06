/**
 * @format
 */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: path.join(__dirname, "/src"),
  entry: "./index.jsx",
  output: {
    path: path.resolve("./dist"),
    filename: "[name]-[hash].js"
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new ExtractTextPlugin("[name]-[hash].css"),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "index.html"
    })
  ],
  module: {
    loaders: [
      {
        test: require.resolve("ua-parser-js"),
        use: "script-loader"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ["env", "react"],
          plugins: [
            require("babel-plugin-transform-class-properties"),
            require("babel-plugin-transform-object-rest-spread")
          ]
        }
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test: /\.(jpg|png)$/,
        loader: "file-loader"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  }
};
