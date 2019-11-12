const CompressionWebpackPlugin = require('compression-webpack-plugin'),
    productionGzipExtensions = ['js', 'css'];
let path = require('path')

function resolve(dir) {
    return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    productionSourceMap: false,
    devServer: {
        disableHostCheck: true,
        https: false, // https:{type:Boolean}
        port: 6969,
    },
    chainWebpack: config => {
        config.resolve.alias.set('@', resolve('src'));
        config.performance.set('hints', false);
        config.output.filename('[name].[hash].js').end();
    },
    configureWebpack: config => {
        //配置参数详解https://www.webpackjs.com/plugins/compression-webpack-plugin/
        if (process.env.NODE_ENV !== 'development') { // 非开发环境
            config.plugins.push(new CompressionWebpackPlugin({
                algorithm: 'gzip', //algorithm： 可以是 function(buf, callback) 或者字符串。对于字符串来说依照 zlib 的算法(或者 zopfli 的算法)。默认值是 "gzip"。
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), //test： 所有匹配该正则的资源都会被处理。默认值是全部资源。
                threshold: 10240, //threshold： 只有大小大于该值的资源会被处理。单位是 bytes。默认值是 0。
                minRatio: 0.8 //minRatio： 只有压缩率小于这个值的资源才会被处理。默认值是 0.8。
            }))
        }
    }
}