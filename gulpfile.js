'use strict';

const gulp = require('gulp')
    , connect = require('gulp-connect');

gulp.task('server', () => {
  connect.server({
    port: 3000,
    root: './',
    fallback: 'index.html'
  });
});

gulp.task('default', ['server']);
