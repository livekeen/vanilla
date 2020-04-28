// ---------------------------------
// :: Load Gulp & plugins we'll use
// ---------------------------------

const
  gulp          = require('gulp'),
  browserSync   = require('browser-sync').create(),
  concat        = require('gulp-concat'),
  del           = require('del'),
  imagemin      = require('gulp-imagemin'),
  jshint        = require('gulp-jshint'),
  cleancss      = require('gulp-clean-css'),
  notify        = require('gulp-notify'),
  postcss       = require('gulp-postcss'),
  pug           = require('gulp-pug'),
  rename        = require('gulp-rename'),
  sass          = require('gulp-sass'),
  sourcemaps    = require('gulp-sourcemaps'),
  // sugarss       = require('sugarss'),
  // stylus        = require('gulp-stylus'),
  // slim          = require('gulp-slim'),
  uglify        = require('gulp-uglify');

const
  autoprefixer  = require('autoprefixer'),
  cssnano       = require('cssnano'),
  cssimport     = require('postcss-import'),
  tailwind      = require('tailwindcss');

postCSSPlugins = [
  autoprefixer(),
  cssnano(),
  cssimport(),
  tailwind(),
];

const { src, dest, watch, series, parallel } = require('gulp');

// ---------------------------------
// :: Variables
// ---------------------------------

var basePaths = {
  src:          'app/',
  dest:         '_dist/',
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

// REMOVE LATER:
// IDEAS FOR IMPROVING GULPFILE:
// https://github.com/google/web-starter-kit
// https://gist.github.com/jeromecoupe/0b807b0c1050647eb340360902c3203a

// ---------------------------------
// :: Tasks
// ---------------------------------

// Clean dist directory
function clean() {
  return del([basePaths.dest]);
}

function cleanEmptyFolders() {
  return del([basePaths.dest + 'components.min', basePaths.dest + 'components']);
}

// Watch files for changes & reload
function watchFiles(done) {
  watch(paths.pages.src, series(pages, reload));
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.images.src, reload);
  done();
}

function connect(done) {
  browserSync.init({
    notify: false,
    server: {
      baseDir: basePaths.dest
    },
    port: 3000
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

// Pages
function pages() {
  return src(paths.pages.src)
    .pipe(pug())
    .pipe(dest(basePaths.dest)) // exports .html
    .pipe(notify({ message: 'Pages task complete' }));
}

// Styles
function styles() {
  return src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(postCSSPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.styles.dest)) // exports *.css
    .pipe(rename({ suffix: '.min' }))
    .pipe(cleancss())
    .pipe(dest(paths.styles.dest)) // exports *.min.css
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Styles task complete' }));
}

// Scripts
function scripts() {
  return src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('functions.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.scripts.dest)) // exports functions.js
    .pipe(rename({ suffix: '.min' }))
    // .pipe(uglify())
    .pipe(dest(paths.scripts.dest)) // exports functions.min.js
    .pipe(browserSync.stream())
    .pipe(notify({ message: 'Scripts task complete' }));
}

// Images
function images() {
  return src(paths.images.src)
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(dest(paths.images.dest))
    .pipe(notify({ message: 'Images task complete' }));
}

// Fonts
function fonts() {
  return src(paths.fonts.src)
    .pipe(dest(paths.fonts.dest));
}

// Defining complex tasks
const build = gulp.series(clean, parallel(styles, images, pages, scripts, fonts), cleanEmptyFolders);
const serve = gulp.series(build, watchFiles, connect);

// Tasks
exports.build = build;
exports.clean = clean;
exports.pages = pages;
exports.serve = serve;

exports.default = build;