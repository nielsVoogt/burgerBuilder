
'use strict';

var gulp         = require('gulp'),
    notify       = require('gulp-notify'),
    watch        = require('gulp-watch'),
    browserSync  = require('browser-sync').create(),
    sass         = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    merge        = require('merge-stream');

function onError(err) {
    console.log(err);
    this.emit('end');
}

var folders   = ['./sass'],
    sassInput = './**/*.scss',
    devInput  = ['./**/*.html', './**/*.js'];

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded'
};

var autoprefixerOptions = {
    browsers: ['last 2 versions', '> 1%', 'Safari 8', 'Firefox ESR']
};

gulp.task('serve', ['sass'], function() {
    browserSync.init({
        proxy: "burgerbuilder.local.dev",
        browser: ["google chrome"]
    });
    gulp.watch(sassInput, ['sass']);
    gulp.watch(sassInput).on('change', browserSync.reload);
    gulp.watch(devInput).on('change', browserSync.reload);
});

gulp.task('watch', ['sass'], function() {
    gulp.watch(sassInput, ['sass']);
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass(sassOptions).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(gulp.dest('./burgerbuilder/css/'));
});
