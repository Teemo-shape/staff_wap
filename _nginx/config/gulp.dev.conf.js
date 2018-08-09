/**
 * create by chuchur
 * date 2016年12月5日12:57:40
 */
//文件关键目录
var utils = require('./utils.js')
var config = require('./gulp.base.conf.js')

module.exports = utils.mergeJSON(config, {
    webConfig: {
        env: 'dev'
    },
    server: {
        root: './publish',
        url: 'http://localhost',
        port: 3001,
        // proxy: 'http://10.120.40.2:8082',
        // proxy: 'http://prewap.tclo2o.cn',
        proxy: 'http://10.120.54.47', //集成线上
        pathRewrite: {
            // '^/rest' : '/',     // rewrite path 47不要
            // '^/api/remove/path' : '/path'           // remove base path
        },
    }
})