/**
 * create by chuchur
 * date 2016年12月5日12:57:40
 */
//文件关键目录
var utils = require('./utils.js')
var config = require('./gulp.base.conf.js')

module.exports = utils.mergeJSON(config, {
    webConfig: {
        env: 'test',
    },
})
// exports.config = config;