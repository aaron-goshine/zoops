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
var gulpJshint = require('gulp-jshint');
var gulpLoadPlugins = require('gulp-load-plugins');
var gulpRubySass = require('gulp-ruby-sass');
var gulpSize = require('gulp-size');
var gulpUseref = require('gulp-useref');
var gulpUtil = require('gulp-util');
var gulpWebServer = require('gulp-webserver');
var jest = require('jest');
var reactify = require('reactify');
var vinylSourceStream = require('vinyl-source-stream');
var watchify = require('watchify');
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var babel = require('babelify');
var buffer = require('vinyl-buffer');

var sourceFile = './app/src/app.jsx';
var publicFolder = './public/';
var scriptDestFolder = './public/scripts';
var stylesDestFolder = './public/styles';
var destFileName = 'app.js';

// sass
gulp.task('sass', function () {
  gulp.src('./app/styles/main.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(gulp.dest(stylesDestFolder));
});

// sass:watch
gulp.task('sass:watch', function () {
  gulp.watch('./app/styles/*.scss', ['sass']);
});

// Styles
gulp.task('styles', function () {
  gulp.src('./app/src/styles/main.scss')
  .pipe(gulpRubySass({
    style: 'expanded',
    precision: 10
  }))
  .pipe(gulpAutoprefixer('last 1 version'))
  .pipe(gulp.dest(stylesDestFolder))
  .pipe(gulpSize());
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
  return gulp.src('app/*.html')
  .pipe(gulpUseref())
  .pipe(gulp.dest(publicFolder))
  .pipe(gulpSize());
});

// Images
gulp.task('images', function () {
  return gulp.src('app/images/**/*')
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
  return gulp.src('app/scripts/**/__tests__')
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
  return gulp.src('./app/*.html')
  // .pipe(gulpUseref.assets())
  // .pipe(gulpUseref.restore())
  // .pipe(gulpUseref())
  .pipe(gulp.dest(publicFolder));
});

// Webserver
gulp.task('serve', function () {
  gulp.src(publicFolder)
  .pipe(gulpWebServer({
    livereload: true,
    port: 9000
  }));
});

// Bower helper
gulp.task('bower', function () {
  gulp.src('app/bower_components/**/*.js', {base: 'app/bower_components'})
  .pipe(gulp.dest('./public/bower_components/'));
});

gulp.task('json', function () {
  gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
  .pipe(gulp.dest(scriptDestFolder));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
  gulp.src(['app/*.txt', 'app/*.ico', 'app/mock/data.json'])
  .pipe(gulp.dest(publicFolder))
  .pipe(gulpSize());
});

// Watch
gulp.task('watch', ['html', 'bundle', 'serve'], function () {
  // Watch .json files
  gulp.watch('app/scripts/**/*.json', ['json']);

  // Watch .html files
  gulp.watch('app/*.html', ['html']);

  // Watch .scss files
  gulp.watch('app/styles/**/*.scss', ['styles']);

  // Watch image files
  gulp.watch('app/images/**/*', ['images']);
});
// Build
gulp.task('build', ['html', 'bundle', 'images', 'extras']);

// Default task
gulp.task('default', ['clean', 'build', 'sass', 'jest']);

gulp.task('dev', ['default', 'watch']);
