// ---------------------------------
// :: Load Gulp & plugins we'll use
// ---------------------------------

var
  gulp          = require('gulp'),
  autoprefixer  = require('gulp-autoprefixer'),
  browserSync   = require('browser-sync'),
  cache         = require('gulp-cache'),
  concat        = require('gulp-concat'),
  del           = require('del'),
  imagemin      = require('gulp-imagemin'),
  jade          = require('gulp-jade'),
  jshint        = require('gulp-jshint'),
  minifycss     = require('gulp-minify-css'),
  notify        = require('gulp-notify'),
  reload        = browserSync.reload,
  rename        = require('gulp-rename'),
  runSequence   = require('run-sequence'),
  sass          = require('gulp-ruby-sass'),
  stylus        = require('gulp-stylus'),
  // sass          = require('gulp-sass'),
  // slim          = require('gulp-slim'),
  uglify        = require('gulp-uglify');

// ---------------------------------
// :: Variables
// ---------------------------------

var basePaths = {
  src:          'app/',
  dest:         '_dist/',
  bower:        'bower_components/',
};

var paths = {
  pages: {
    src:        basePaths.src + 'views/pages/**/*',
    dest:       basePaths.dest,
  },
  styles: {
    src:        basePaths.src + 'assets/styles/**/*',
    dest:       basePaths.dest,
  },
  scripts: {
    src:        basePaths.src + 'assets/scripts/**/*',
    dest:       basePaths.dest,
  },
  images: {
    src:        basePaths.src + 'assets/images/**/*',
    dest:       basePaths.dest,
  },
  fonts: {
    src:        basePaths.src + 'assets/fonts/**/*',
    dest:       basePaths.dest,
  },
  // extras:       ['assets/favicons/**/*', 'assets/checkout/**/*'],
};

var tasks = {
  pages:        'pages',
  styles:       'styles',
  scripts:      'scripts',
  images:       'images',
  fonts:        'fonts',
};

var AUTOPREFIXER_BROWSERS = [
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

// REMOVE LATER:
// IDEAS FOR IMPROVING GULPFILE:
// https://github.com/google/web-starter-kit
// http://www.justinmccandless.com/blog/A+Tutorial+for+Getting+Started+with+Gulp
// http://markgoodyear.com/2014/01/getting-started-with-gulp

// ---------------------------------
// :: Tasks
// ---------------------------------

// Clean dist directory
gulp.task('clean', del.bind(null, [basePaths.dest], {dot: true}));

// Pages
gulp.task(tasks.pages, function() {
  return gulp.src(paths.pages.src)
    .pipe(jade({pretty: true}))
    .pipe(gulp.dest(basePaths.dest)); // exports .html
});

// Styles
gulp.task(tasks.styles, function() {
  return gulp.src(paths.styles.src)
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest(paths.styles.dest)) // exports *.css
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(paths.styles.dest)) // exports *.min.css
    .pipe(reload({stream: true}))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task(tasks.scripts, function() {
  return gulp.src(paths.scripts.src)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('functions.js'))
    .pipe(gulp.dest(paths.scripts.dest)) // exports functions.js
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.dest)) // exports functions.min.js
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task(tasks.images, function() {
  return gulp.src(paths.images.src)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(notify({ message: 'Images task complete' }));
});

// Fonts
gulp.task(tasks.fonts, function () {
  return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
  // return gulp.src([basePaths.src + '*'], {dot: true})
  //   .pipe(gulp.dest(basePaths.dest));
});

// Watch files for changes & reload
gulp.task('serve', [tasks.styles], function () {
  browserSync({
    notify: false,
    // Customize the BrowserSync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', basePaths.dest]
  });

  gulp.watch([paths.pages.src], [tasks.pages, reload]);
  gulp.watch([paths.styles.src], [tasks.styles, reload]);
  gulp.watch([paths.scripts.src], [tasks.scripts, reload]);
  gulp.watch([paths.images.src], reload);
});

// Default task
gulp.task('default', ['clean'], function (cb) {
  runSequence(tasks.styles, [tasks.scripts, tasks.pages, tasks.images, tasks.fonts, 'copy'], cb);
});