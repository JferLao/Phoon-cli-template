const webpack = require('webpack');
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const SpritesmithPlugin = require('webpack-spritesmith')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin')

// 路径转换
function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

// 雪碧图模板转换方法
function templateFunction(data) {
    let shared = '.icon { background-image: url(I);background-size: Wpx Hpx;}'.replace('I', data.sprites[0].image).replace('W', data.spritesheet.width)
        .replace('H', data.spritesheet.height)

    let perSprite = data.sprites.map(function (sprite) {
        return '.icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }'
            .replace('N', sprite.name)
            .replace('W', sprite.width)
            .replace('H', sprite.height)
            .replace('X', sprite.offset_x)
            .replace('Y', sprite.offset_y);
    }).join('\n');

    return shared + '\n' + perSprite;
}

module.exports = {
    entry: {
        main: './src/main.js', //入口文件
    },
    performance: {
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    module: {
        // 打包规则
        rules: [
            {
                test: /\.(sa|sc|c)ss$/, // 可以打包后缀为sass/scss/css的文件
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // 这里可以指定一个 publicPath
                            // 默认使用 webpackOptions.output中的publicPath
                            // publicPath的配置，和plugins中设置的filename和chunkFilename的名字有关
                            // 如果打包后，background属性中的图片显示不出来，请检查publicPath的配置是否有误
                            publicPath: '../',
                            // publicPath: devMode ? './' : '../',   // 根据不同环境指定不同的publicPath
                            hmr: process.env.NODE_ENV !== 'production', // 仅dev环境启用HMR功能
                        },
                    },
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.vue$/,
                use: {
                    loader: 'vue-loader',
                    options: {
                        cssSourceMap: true
                    }
                },
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            esModule: false,
                            name: 'img/[name].[hash:7].[ext]'
                        }
                    },
                    {
                        // 图片压缩
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: { //压缩ipeg
                                progressive: true,
                                quality: 65
                            },
                            optipng: { //压缩png
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: { //压缩gif
                                interlaced: false,
                            }
                        },
                    }
                ]

            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'media/[name].[hash:7].[ext]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[hash:7].[ext]'
                }
            },

        ]
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'], //自动编译扩展名文件
        alias: { //路径替换
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
            'img':'@/assets/images/'
            // 'img': resolve('src/assets/images')
        },
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({ //自动生成一个index.html文件,并把打包生成的js文件自动引入到这个html文件中
            template: path.resolve(__dirname, '../index.html'),
            inject: true,
            minify: {
                removeComments: true, //去注释
                collapseWhitespace: true, //压缩空格
                removeAttributeQuotes: true //去除属性引用
            },
        }),
        new MiniCssExtractPlugin({
            filename: process.env.NODE_ENV !== 'production' ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: process.env.NODE_ENV !== 'production' ? 'css/[id].css' : 'css/[id].[hash].css'

        }), //webpack 4之后取代ExtractTextPlugin
        new CleanWebpackPlugin(), //自动清除dist内
        new SpritesmithPlugin({ //雪碧图
            src: {
                cwd: path.resolve(__dirname, '../src/assets/icon'), //准备合并成sprit的图片存放文件夹
                glob: '*.png' //哪类图片
            },
            target: {
                image: path.resolve(__dirname, '../src/assets/images/sprites.png'), // sprite图片保存路径
                css: [ //css保存地址
                    [path.resolve(__dirname, '../src/assets/css/sprite.scss'), {

                        format: 'function_based_template'
                    }],
                ]
            },
            customTemplates: {
                'function_based_template': templateFunction,
            },
            apiOptions: {
                cssImageRef: '~img/sprites.png' //css根据该指引找到sprite图
            }
        }),
        new CopyWebpackPlugin({
            patterns: [{
                from: path.resolve(__dirname, '../src/static'), // 不打包直接输出的文件
                to: 'static', // 打包后静态文件放置位置
            }],
        }),
    ],
    optimization: {
        usedExports: true, //使用Tree Shaking
        splitChunks: {
            chunks: 'async', //代码只对异步代码生效,可以配置all然后根据cacheGroups配置判断是否对同步代码和异步代码分割,initial为同步代码
            minSize: 30000, //引入的模块/包大于3000个字节(30kb)才做代码分割
            // maxSize: 50000, //引入的模块/包大于个50000字节会将代码再分割成另外一个新的模块
            minChunks: 1, //引入的模块使用次数小于1则不作代码分割
            maxAsyncRequests: 5, //超过异步的模块/库超过5个则不会执行代码分割
            maxInitialRequests: 3, //超过同步的模块/库超过3个则不会执行代码分割
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: { //缓存组,符合上面代码分割的规则就会缓存到这里,把符合下面规则的代码打包在一起
                vendors: {
                    test: /[\\/]node_modules[\\/]/, //检测是否在node_modules文件夹内,符合的话会将代码分割到vendor~入口文件名字组
                    priority: -10, //打包优先级,越高优先打包在这
                    filename: 'vendors.js' //把文件名改成vendors.js
                },
                default: { //默认放置的组名
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true, //复用已经打包过的模块
                    filename: 'common.js'
                }
            },
        }
    },



}