/**
 * create by chuchur
 * date 2016年12月5日12:57:40
 */
const gulp = require('gulp'),
  concat = require('gulp-concat'),
  less = require('gulp-less'),
  cleancss = require('gulp-clean-css');
// clean = require('gulp-clean'),
// plumber = require('gulp-plumber');
// gutil = require('gulp-util')


//lcss压缩和发布
gulp.task('less', () => {
  return gulp.src('./assets/css/index.less') //['res/css/style.less','res/css/common.less'])
    .pipe(less())
    .pipe(cleancss({
      advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
      // "compatibility": 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
      keepSpecialComments: '*', //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
      keepBreaks: false, //类型：Boolean 默认：false [是否保留换行]
    }))
    .pipe(concat('styles.min.css'))
    .pipe(gulp.dest('./static/css/'))
});

gulp.task('reload', () => {
  return gulp.src('./static/css/*.*')
});

var watchEvent = (event) => {
  console.log('文件 ' + event.path + ' 发生 ' + event.type + ', 重启任务...');
};
//监听文件改变
gulp.task('watch', () => {
  gulp.watch('./assets/css/*.less', ['less', 'reload']).on("change", watchEvent);
});

gulp.task('default', ['less', 'watch', 'reload']);
// gulp.task('default', ['less', 'watch']);
// gulp.task('default', function(){
//   console.log("default")
// });
