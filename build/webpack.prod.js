const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

module.exports = merge(common, {
    mode: 'production',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].[chunkhash].js',
        publicPath: '/'
    },
    module: {

    },
    // devtool: 'cheap-module-source-map', //处理代码的映射关系,会增大打包文件大小
    optimization: {
        minimizer: [
            // 压缩css
            new OptimizeCSSAssetsPlugin({}),
        ]
    },

})