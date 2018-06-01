import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import mocha from 'gulp-mocha';
import babel from 'gulp-babel';
import eslint from 'gulp-eslint';
import sass from 'gulp-sass';
import bower from 'gulp-bower';
import browserSync from 'browser-sync';
import exit from 'gulp-exit';
import dotenv from 'dotenv';
import gulpSequence from 'gulp-sequence';
import del from 'del';

dotenv.config();

const { reload } = browserSync;

// Function to move files from source to destination
const moveFiles = (src, dest) => gulp.src(src).pipe(gulp.dest(dest));

gulp.task('install', () => {
  if (process.env.NODE_ENV !== 'production') {
    return bower({
      directory: 'public/lib'
    });
  }
  return bower({
    directory: 'dist/public/lib'
  });
});

gulp.task('watch', () => {
  gulp.watch('app/views/**', reload);
  gulp.watch('public/js/**', reload);
  gulp.watch('app/**/*.js', reload);
  gulp.watch('public/views/**', reload);
  gulp.watch('public/css/common.scss', ['sass']);
  gulp.watch('public/css/**', reload);
});

gulp.task('default', ['nodemon', 'watch']);
gulp.task('nodemon', () => nodemon({
  verbose: true,
  script: 'server.js',
  ext: 'js html jade scss css',
  ignore: ['README.md', 'node_modules/**', 'public/lib/**', '.DS_Store'],
  watch: ['app', 'config', 'public', 'server.js', 'hi.js'],
  env: {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV
  }
}));

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**', '!public/lib'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('clean', () => del(['.tmp', 'dist/*', '!dist/.git'], { dot: true }));

gulp.task('babel', () => {
  gulp.src([
    './**/*.js',
    '!node_modules/**',
    '!public/lib/**',
    '!gulpfile.babel.js',
    '!bower_components/**/*'
  ])
    .pipe(babel())
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', () => {
  gulp.src('public/css/common.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});

gulp.task('build', gulpSequence('clean', 'babel', 'moveFiles'));

gulp.task('moveFiles', ['move-appViews', 'move-config', 'move-public']);

gulp.task('move-appViews', () => moveFiles('app/views/**/*', './dist/app/views'));

gulp.task('move-config', () => moveFiles('config/env/**/*', './dist/config/env'));

gulp.task('move-public', () =>
  moveFiles(['public/**/*', '!public/js/**'], './dist/public'));

gulp.task('test', () => {
  gulp.src(['test/**/*.js'])
    .pipe(mocha({
      reporter: 'spec',
      exit: true,
      compilers: 'babel-core/register',
      timeout: 5000
    }))
    .on('error', () => exit())
    .on('end', () => exit())
    .pipe(exit());
});
