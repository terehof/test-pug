var gulp = require('gulp'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    jsmin = require('gulp-jsmin'),
    rename = require('gulp-rename'),
    util = require('gulp-util'),
    //less = require('gulp-less'),
    less = require('gulp-less-sourcemap'),
    sourcemaps = require('gulp-sourcemaps'),
    connect = require('gulp-connect'),
    webserver = require('gulp-webserver'),
    opn = require('opn'),
    fileInclude = require('gulp-file-include');

var historyApiFallback = require('connect-history-api-fallback');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

var path = {
    build: { //Тут мы укажем куда складывать готовые после сборки файлы
        js: 'build/js/',
        html: 'build/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        js: 'src/js/**/**/*.js',
        style: 'src/style/style.less',
        html: 'src/*.html',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },

    watch: { //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/style/**/*.less',
        img: 'src/img/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};
gulp.task('html', function () {
    return gulp.src(path.src.html)
        .pipe(fileInclude({
            prefix: '@@',
            basepath: 'src/html_includes/'
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({ stream:true }));
});
gulp.task('fonts', function () {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(reload({ stream:true }));
});
gulp.task('images', function() {
    gulp.src(path.src.img) // возьмем наши картинки
        .pipe(gulp.dest(path.build.img)) //И бросим в build
        /*.pipe(imagemin({ //Сожмем их
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))*/
        .pipe(reload({ stream:true }));
});
gulp.task('style', function () {
    return gulp.src(path.src.style)
        .pipe(less({
            sourceMap: {
                sourceMapRootpath: path.src.style
            }
        })).on('error', util.log)
        /*.pipe(autoprefixer({
            browsers: ['> 1%'],
            cascade: false
        }))*/
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream:true }));
});
gulp.task('style-min', function () {
    return gulp.src(path.src.style)
        //.pipe(less())
        .pipe(autoprefixer({
            browsers: ['> 1%'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({ stream:true }));
});
gulp.task('js', function () {
    return gulp.src([ path.src.js])
        // .pipe(uglify()).on('error', util.log)
        //.pipe(concat('main.js'))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream:true }));
});
gulp.task('js-min', function () {
    return gulp.src([path.src.js])
        .pipe(uglify()).on('error', util.log)
        .pipe(concat('main.js'))
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({ stream:true }));
});

gulp.task('dev-watch', ['dev'], function () {
    browserSync.init({
        server: {
            baseDir: "./build",
            middleware: [historyApiFallback({})]
        }
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('dev');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images');
    });
});
gulp.task('prod-watch', ['prod'], function () {
    browserSync.init({
        server: {
            baseDir: "./build",
            middleware: [historyApiFallback({})]
        }
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('prod');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style-min');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js-min');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('images');
    });
});
gulp.task('dev', ['html', 'style', 'js']);
gulp.task('prod', ['style-min', 'js-min']);

gulp.task('default', ['dev-watch']);