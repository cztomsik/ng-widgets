'use strict';

var
  pkg = require('./package.json'),
  indexFile = require.resolve('./'),
  allSources = ['./*.js', './src/**/*.js', '!./ngWidgets.js'],
  testFiles = ['./test/*.js'],

  gulp = require('gulp'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  spawn = require('child_process').spawn,
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify')
;

gulp.task('default', ['build']);

gulp.task('build', ['verify', 'minify']);

gulp.task('watch', ['compile', 'verify'], function(){
  gulp.watch(allSources.concat(testFiles), ['compile', 'verify']);
});

gulp.task('minify', function(){
  //TODO: DRY
  gulp
    .src(indexFile)
    .pipe(browserify())
    .pipe(concat(pkg.name + '.js'))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('compile', function(){
  gulp
    .src(indexFile)
    .pipe(browserify())
    .pipe(concat(pkg.name + '.js'))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('verify', ['test', 'lint']);

gulp.task('test', function(){
  spawn('npm', ['test'], {stdio: 'inherit'});
});

gulp.task('lint', function(){
  gulp
    .src(allSources)
    .pipe(jshint('./.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
  ;
});