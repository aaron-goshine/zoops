'use strict';
var path = require('path');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var gulpAutoPrefixer = require('gulp-autoprefixer');
var browserifyShim = require('browserify-shim');
var del = require('del');
var gulp = require('gulp');
var gulpAutoprefixer = require('gulp-autoprefixer');
var gulpBower = require('gulp-bower');
var gulpCache = require('gulp-cache');
var flux = require('flux');
var gulpImagemin = require('gulp-imagemin');
var gulpJest = require('gulp-jest');
var gulpLoadPlugins = require('gulp-load-plugins');
var gulpSize = require('gulp-size');
var gulpUtil = require('gulp-util');
var jest = require('jest');
var reactify = require('reactify');
var vinylSourceStream = require('vinyl-source-stream');
var watchify = require('watchify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('babelify');
var buffer = require('vinyl-buffer');

var sourceFile = './source/app.jsx';
var publicFolder = './public/';
var scriptDestFolder = './public/scripts';
var stylesDestFolder = './public/styles';
var destFileName = 'app.js';

// sass
gulp.task('sass', function () {
  gulp.src('./source/styles/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(stylesDestFolder));
});

// sass:watch
gulp.task('sass:watch', function () {
  gulp.watch('./source/styles/*.scss', ['sass']);
});

// Script
gulp.task('scripts2', function () {
  var bundler = watchify(browserify({
    entries: [sourceFile],
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true,
    extensions: ['.js', '.jsx', '.json']
  }));

  bundler.on('update', bundle);
  function bundle () {
    console.log('[bundle >]' + Date());
    return bundler.bundle()
    .on('error', function (erro) {
      console.error('Browserify Error------------');
      console.info(erro);
      console.error('Browserify Error------------');
    })
    .pipe(source(destFileName))
    .pipe(gulp.dest(scriptDestFolder));
  }
  bundle();
});

gulp.task('scripts', function () {
  var bundler = watchify(browserify(sourceFile, {
    entries: [sourceFile],
    insertGlobals: true,
    cache: {},
    packageCache: {},
    fullPaths: true,
    debug: true,
    extensions: ['.js', '.jsx', '.json']
  }).transform(babel));

  function rebundle () {
    bundler.bundle()
    .on('error', function (err) {
      console.error(err);
      this.emit('end');
    })
    .pipe(source(destFileName))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sourcemaps.write(gulp.dest(scriptDestFolder)))
    .pipe(gulp.dest(scriptDestFolder));
  }

  bundler.on('update', function () {
    console.log('-> bundling... ' + new Date());
    rebundle();
  });

  rebundle();
});

// HTML
gulp.task('html', function () {
  return gulp.src('source/*.html')
  .pipe(gulp.dest(publicFolder))
  .pipe(gulpSize());
});

// Images
gulp.task('images', function () {
  return gulp.src('./source/images/**/*')
  .pipe(gulpCache(gulpImagemin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true
  })))
  .pipe(gulp.dest('public/images'))
  .pipe(gulpSize());
});

// Test Jess
gulp.task('jest', function () {
  var nodeModules = path.resolve('./node_modules');
  return gulp.src('./source/scripts/**/__tests__')
  .pipe(gulpJest({
    scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
    unmockedModulePathPatterns: [nodeModules + '/react']
  }));
});

// Clean
gulp.task('clean', function () {
  del.sync(['./public/*']);
});

// Bundle
gulp.task('bundle', ['scripts', 'bower'], function () {
  return gulp.src('./source/*.html')
  // .pipe(gulpUseref.assets())
  // .pipe(gulpUseref.restore())
  // .pipe(gulpUseref())
  .pipe(gulp.dest(publicFolder));
});

// Bower helper
gulp.task('bower', function () {
  gulp.src('./source/bower_components/**/*.js', {base: './source/bower_components'})
  .pipe(gulp.dest('./public/bower_components/'));
});

gulp.task('json', function () {
  gulp.src('./source/scripts/json/**/*.json', {base: './source/scripts'})
  .pipe(gulp.dest(scriptDestFolder));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
  gulp.src(['./source/*.txt', './source/*.ico', './source/mock/data.json'])
  .pipe(gulp.dest(publicFolder))
  .pipe(gulpSize());
});

// Watch
gulp.task('watch', ['html', 'bundle'], function () {
  // Watch .json files
  gulp.watch('./source/scripts/**/*.json', ['json']);

  // Watch .html files
  gulp.watch('./source/*.html', ['html']);

  // Watch .scss files
  gulp.watch('./source/styles/**/*.scss', ['sass']);

  // Watch image files
  gulp.watch('./source/images/**/*', ['images']);
});
// Build
gulp.task('build', ['html', 'bundle', 'images', 'extras']);

// Default task
gulp.task('default', ['clean', 'build', 'sass', 'jest']);

gulp.task('dev', ['default', 'watch']);
