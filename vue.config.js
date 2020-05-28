module.exports = {
  // css相关配置
  // css预设器配置项 详见https://cli.vuejs.org/zh/config/#css-loaderoptions
  lintOnSave: false,
  css: {
    extract: true, // 是否使用css分离插件 ExtractTextPlugin
    sourceMap: false, // 开启 CSS source maps?
    loaderOptions: {
      sass: {
        prependData: '@import "./src/styles/main.scss";'
      } // 这里的选项会传递给 css-loader
    },
    requireModuleExtension: true // 启用 CSS modules for all css / pre-processor files.
  },
  // webpack-dev-server 相关配置
  // 测试服务启动时显示的ip,端口,代理配置
  devServer: {
    open: false,
    port: 8080,
    proxy: {
      '/apis': {
        target: 'http://localhost:8082/api/', // target host
        ws: true, // proxy websockets
        changeOrigin: true, // needed for virtual hosted sites
        pathRewrite: {
          '^/apis': '' // rewrite path
        }
      }
    }
  }
}
