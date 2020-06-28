const merge = require('webpack-merge')
const common = require('./webpack.common')
const path = require('path')
const NyanProgressPlugin = require('nyan-progress-webpack-plugin')
const {
    BundleAnalyzerPlugin
} = require('webpack-bundle-analyzer');
const {
    Compiler
} = require('webpack');

module.exports = merge(common, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[hash].js',
        publicPath: '/'
    },
    plugins: [
        // 加载动画插件
        new NyanProgressPlugin({
            // 获取进度的时间间隔，默认 180 ms
            debounceInterval: 60,
            nyanCatSays(progress, messages) {
                if (progress === 1) {
                    // 当构建完成时，输出
                    return '项目已运行'
                }
            }
        }),
        // 分析项目大小详情
        // new BundleAnalyzerPlugin({
        //     analyzerPort: 8919
        // })
    ],
    devServer: {
        publicPath: '/',
        contentBase: './dist', //告诉服务器从哪个目录中提供内容
        open: true, //自动打开浏览器并打开localhost:8080 
        quiet:true,
        // proxy: { //使用跨域代理
        //     '/api': 'http://localhost:3000'
        // },
        port: 8080, //端口
        hot: true, //开启热模块更新
        hotOnly: true, //不让浏览器自动刷新
        // before: function(app, server) {
        //     //在服务内部的所有其他中间件之前， 提供执行自定义中间件的功能
        //     app.get('/some/path', function(req, res) {
        //       res.json({});
        //     });
        //   }
        // after: function(app, server) {
        //     // 在服务内部的所有其他中间件之后， 提供执行自定义中间件的功能
        // },
        //allowedHosts:['host.com'] //选项允许你添加白名单服务，允许一些开发服务器访问
        headers: {}, //在所有响应中添加首部内容：
        host: '127.0.0.1', //指定使用一个 host。默认是 localhost
        https: false, //默认情况下，dev-server 通过 HTTP 提供服务,也可以选择带有 HTTPS 的 HTTP/2 提供服务
        //index: 'index.html',   //被作为索引文件的文件名
        lazy: false, //当启用 devServer.lazy 时，dev-server 只有在请求时才编译包(bundle)。这意味着 webpack 不会监视任何文件改动
        // openPage: '/different/page'  //指定打开浏览器时的导航页面
        // publicPath: '/assets/'       //此路径下的打包文件可在浏览器中访问,默认 devServer.publicPath 是 '/
        // useLocalIp: false    //允许浏览器使用本地 IP 打开
    },
    // devtool: 'cheap-module-eval-source-map', //处理代码的映射关系,关闭可以减小包的大小
})