'use strict';

var
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  browserify = require('gulp-browserify'),
  concat = require('gulp-concat'),
  spawn = require('child_process').spawn,
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),

  production = gutil.env.production,
  pkg = require('./package.json'),
  bundleFile = './' + pkg.name + '.js',
  bundleMinFile = './' + pkg.name + '.min.js',
  allSources = ['./*.js', './src/*/*.js', '!' + pkg.main, '!' + bundleFile, '!' + bundleMinFile],
  testFiles = ['./src/*/test/*.js']
;

gulp.task('default', ['build']);

gulp.task('build', ['verify', 'compile', 'doc'].concat(production ?'minify' :[]));

gulp.task('watch', ['build'], function(){
  gulp.watch(allSources.concat(testFiles), ['build']);
});

gulp.task('compile', function(){
  gulp
    .src(pkg.main)
    .pipe(browserify({debug: ! production}))
    .pipe(concat(bundleFile))
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

gulp.task('minify', function(){
  gulp
    .src(bundleFile)
    .pipe(concat(bundleMinFile))
    .pipe(uglify({mangle: false}))
    .pipe(gulp.dest('./'))
  ;
});

gulp.task('doc', function(){
  spawn('npm', ['run', 'doc'], {stdio: 'inherit'});
});
