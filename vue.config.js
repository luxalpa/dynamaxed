module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        win: {
          target: "portable",
          icon: "public/Shadow_Mewtwo.png"
        }
        // options placed here will be merged with default configuration and passed to electron-builder
      }
    }
  },
  css: {
    loaderOptions: {
      sass: {
        indentedSyntax: true
      },
      scss: {
        indentedSyntax: true
      }
    }
  },
  // transpileDependencies: [
  //   'vuex-module-decorators'
  // ]
};
