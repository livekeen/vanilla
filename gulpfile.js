// ---------------------------------
// :: Load plugins
// ---------------------------------

var
  gulp          = require('gulp'),
  autoprefixer  = require('gulp-autoprefixer'),
  browserSync   = require('browser-sync'),
  cache         = require('gulp-cache'),
  concat        = require('gulp-concat'),
  del           = require('del'),
  imagemin      = require('gulp-imagemin'),
  jshint        = require('gulp-jshint'),
  minifycss     = require('gulp-minify-css'),
  notify        = require('gulp-notify'),
  reload        = browserSync.reload,
  rename        = require('gulp-rename'),
  sass          = require('gulp-ruby-sass'),
  stylus        = require('gulp-stylus'),
  // sass          = require('gulp-sass'),
  // slim          = require('gulp-slim'),
  uglify        = require('gulp-uglify');

// ---------------------------------
// :: Variables
// ---------------------------------

var basepaths = {
  app:          'app/',
  dist:         'dist/',
};

var paths = {
  pages:        'views/pages/**/*',
  styles:       'assets/stylesheets/**/*',
  scripts:      'assets/scripts/**/*',
  images:       'assets/images/**/*',
  extras:       ['assets/fonts/**/*', 'assets/favicons/**/*', 'assets/checkout/**/*'],
};

var tasks = {
  base:         ['pages', 'styles', 'scripts', 'images'],
  all:          ['pages', 'styles', 'scripts', 'images', 'watch'],
};

// var paths = {
//  scripts: ['scripts/**/*.js', '!scripts/libs/'],
//  libs: ['scripts/libs/jquery/dist/jquery.js', 'scripts/libs/underscore/underscore.js', 'scripts/backbone/backbone.js'],
//  styles: ['styles/**/*.css'],
//  html: ['index.html', '404.html'],
//  images: ['images/**/*.png'],
//  extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
// };

// http://www.justinmccandless.com/blog/A+Tutorial+for+Getting+Started+with+Gulp
// http://markgoodyear.com/2014/01/getting-started-with-gulp

// ---------------------------------
// :: Tasks
// ---------------------------------

// Clean dist directory
gulp.task('clean', function(cb) {
  del(basepaths.dist, cb);
});

// Pages
gulp.task('pages', ['clean'],  function() {
  return gulp.src(basepaths.app + paths.pages)
  .pipe(gulp.dest(basepaths.dist)) // exports .html
});

// Styles
gulp.task('styles', ['clean'],  function() {
  return gulp.src(basepaths.app + paths.styles)
  .pipe(sass({ style: 'expanded' }))
  .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
  .pipe(gulp.dest(basepaths.dist)) // exports *.css
  .pipe(rename({suffix: '.min'}))
  .pipe(minifycss())
  .pipe(gulp.dest(basepaths.dist)) // exports *.min.css
  .pipe(reload({stream: true}))
  .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task('scripts', ['clean'], function() {
  return gulp.src(basepaths.app + paths.scripts)
  .pipe(jshint())
  .pipe(jshint.reporter('default'))
  .pipe(concat('functions.js'))
  .pipe(gulp.dest(basepaths.dist)) // exports functions.js
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  .pipe(gulp.dest(basepaths.dist)) // exports functions.min.js
  .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', ['clean'], function() {
  return gulp.src(basepaths.app + paths.images)
  .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
  .pipe(gulp.dest(basepaths.dist + 'img/'))
  .pipe(notify({ message: 'Images task complete' }));
});

// Watch for file changes
gulp.task('watch', function() {
  gulp.watch(basepaths.app + '/**/*', tasks.base);
});

// Default task
gulp.task('default', tasks.all);