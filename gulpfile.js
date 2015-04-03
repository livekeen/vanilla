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

var basepaths = {
  app:          'app/',
  dist:         '_dist/',
};

var paths = {
  pages:        'views/pages/**/*',
  styles:       'assets/styles/**/*',
  scripts:      'assets/scripts/**/*',
  images:       'assets/images/**/*',
  fonts:        'assets/fonts/**/*',
  extras:       ['assets/fonts/**/*', 'assets/favicons/**/*', 'assets/checkout/**/*'],
};

var tasks = {
  pages:        'pages',
  styles:       'styles',
  scripts:      'scripts',
  images:       'images',
  fonts:        'fonts',
  all:          ['watch', 'pages', 'styles', 'scripts', 'images'],
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
gulp.task('clean', del.bind(null, [basepaths.dist], {dot: true}));

// Pages
gulp.task(tasks.pages, function() {
  // del([basepaths.dist + paths.pages]);
  gulp.src(basepaths.app + paths.pages)
    .pipe(gulp.dest(basepaths.dist)) // exports .html
});

// Styles
gulp.task(tasks.styles, function() {
  // del([basepaths.dist + paths.styles]);
  gulp.src(basepaths.app + paths.styles)
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
    .pipe(gulp.dest(basepaths.dist)) // exports *.css
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(basepaths.dist)) // exports *.min.css
    .pipe(reload({stream: true}))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Scripts
gulp.task(tasks.scripts, function() {
  // del([basepaths.dist + paths.scripts]);
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
gulp.task(tasks.images, function() {
  // del([basepaths.dist + paths.images]);
  return gulp.src(basepaths.app + paths.images)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest(basepaths.dist))
    .pipe(notify({ message: 'Images task complete' }));
});

// Fonts
gulp.task(tasks.fonts, function () {
  return gulp.src([basepaths.app + paths.fonts])
    .pipe(gulp.dest(basepaths.dist));
});

// Copy all files at the root level (app)
gulp.task('copy', function () {
  // return gulp.src([basepaths.app + '*'], {dot: true})
  //   .pipe(gulp.dest(basepaths.dist));
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
    server: ['.tmp', basepaths.dist]
  });

  gulp.watch([basepaths.app + paths.pages], reload);
  gulp.watch([basepaths.app + paths.styles], [tasks.styles, reload]);
  gulp.watch([basepaths.app + paths.scripts], [tasks.scripts]);
  gulp.watch([basepaths.app + paths.images], reload);
});

// gulp.task('watch', function() {
//   // Watch page files
//   gulp.watch(basepaths.app + paths.pages + '/**/*', [tasks.pages]);

//   // Watch stylesheet files
//   gulp.watch(basepaths.app + paths.styles, [tasks.styles]);

//   // Watch script files
//   gulp.watch(basepaths.app + paths.scripts + '/**/*', [tasks.scripts]);

//   // Watch image files
//   gulp.watch(basepaths.app + paths.images + '/**/*', [tasks.images]);

// });

// Default task
gulp.task('default', ['clean'], function (cb) {
  runSequence(tasks.styles, [tasks.scripts, tasks.pages, tasks.images, tasks.fonts, 'copy'], cb);
});
// gulp.task('default', tasks.all);