/**
 * create by chuchur
 * date 2016年12月5日12:57:40
 */
//文件关键目录
module.exports = {
  dev: {
    less: ['./res/less/*.less'],
    js: ['./res/js/**/*.js'],
    img: ['./res/img/**/*.*'],
    face: ['./app/**'],
    pages: ['./user/*.html'],
    fonts: ['./res/fonts/*.*']
  },
  publish: {
    css: '../.nginx/res/css',
    js: '../.nginx/res/js',
    fonts: '../.nginx/res/fonts',
    img: '../.nginx/res/img',
    face: '../.nginx/app',
    pages: '../.nginx/user',
  },
  webConfig: {
    hash: '.' + new Date() * 1,
    cdnPath: '/',
    siteName: 'TCL官方商城',
    keywords: 'TCL,TCL商城,TCL集团,TCL官方商城,TCL官网商城,TCL官网,TCL官方网站,TCL官方旗舰店,TCL旗舰店,TCL商城旗舰店,TCL网上商城,TCL电视,TCL曲面4K,TCL 4K,TCL Hero,TCL智能电视,TCL手机,TCL洗衣机,TCL空调,TCL冰箱,么么哒,TV+,娱乐TV+,芒果TV',
    description: 'TCL官方商城(www.tcl.com)是TCL集团的网上购物商城,我们提供正品TCL电视,手机,洗衣机,空调,冰箱,配件等TCL产品。全国包邮、正品低价、快速送达、提供正规发票。'
  },
}
// exports.config = config;
