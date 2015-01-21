var gulp = require('gulp');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var uglify = require('gulp-uglify');
var buffer = require('gulp-buffer');
var minifyCSS = require('gulp-minify-css');
var livereload = require('gulp-livereload');
var notify = require('gulp-notify');
var fs = require('fs');

// 环境变量
var env = 'prod'; // dev||prod

var live = livereload();
livereload.listen();

// 路径
var paths = {
    main: './js/app.js',
    css: './css/*.css',
    destDir: 'build',
    destCSS: 'build/css'
};

/**
 * 
 */
gulp.task('bundle-js', function() {

    return browserify({
        entries:[paths.main]
    })

    // 所有檔案合併為一，並指定要生成 source map
    .bundle()

    .on('error', function(err){
        console.log('[錯誤]', err);
        this.end();
        gulp.src('').pipe(notify('✖ Bunlde Failed ✖'))
    })
    
    // 利用 vinyl-source-stream 幫檔案取名字
    .pipe(source('bundle.js'))
    
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('./build'))
});

/**
 * 压缩css
 */
gulp.task('minify-css', function() {
  gulp.src(paths.css)
    .pipe(minifyCSS(
      {
          noAdvanced: false,
          keepBreaks:true,
          cache: true // 這是 gulp 插件獨有的
      }))
    .pipe(gulp.dest(paths.destCSS))
});


/**
 * 將 index.html 與 css/ 複製到 build/ 下面
 * 才方便測試
 */
gulp.task('copy', function(){
    return gulp.src(['./index.html'], {base: './'})
    .pipe(gulp.dest(paths.destDir));
})


/**
 * 监控 app/ 下所有 js, jsx, html, css 变化，重新编译
 */
//gulp.task('watch', function() {
//    gulp.watch('./**/*', ['bundle-js', 'minify-css', 'copy']);
//});

/**
 * livereload refresh

gulp.task( 'refresh', function(){
    // console.log( '\nlivereload > refresh\n' );
    setTimeout(function(){
      live.changed('');
    }, 500)
})
 */

//========================================================================
//
// 总的指令集


/**
 * 初期让 default 跑 dev task，还有 build, deploy
 */
gulp.task('default', ['dev']);


gulp.task('dev', ['bundle-js', 'minify-css', 'copy']);
