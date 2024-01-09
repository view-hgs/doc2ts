const path = require("path");
module.exports = {
  mode: "production",
  entry: "./src/main.ts",
  output: {
    filename: "index.umd.js",
    path: path.resolve(__dirname, "dist"),
    library: "tsUtil",
    libraryTarget: "umd",
    globalObject: "this",
  },
  // 模块, 使用tsloader解析ts文件
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
};
