const PreloadWebpackPlugin = require("preload-webpack-plugin");

module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          target: "portable",
          icon: "public/Shadow_Mewtwo.png"
        }
      }
    }
  },
  configureWebpack: {
    plugins: [
      new PreloadWebpackPlugin({
        rel: "preload",
        include: "allAssets",
        fileWhitelist: [
          /fira-sans-latin-400\.[0-9a-f]+\.woff2/,
          /fira-sans-latin-500\.[0-9a-f]+\.woff2/
        ]
      })
    ]
  },
  chainWebpack: config => {
    config.plugins.delete("vue-loader")
  }
};
