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

dotenv.config();

const { reload } = browserSync;

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
gulp.task('nodemon', () =>
  nodemon({
    verbose: true,
    script: 'server.js',
    ext: 'js html jade scss css',
    ignore: ['README.md', 'node_modules/**', 'bower_components/', 'public/lib/**', '.DS_Store'],
    watch: ['app', 'config', 'public', 'server.js'],
    env: {
      PORT: 3000,
      NODE_ENV: process.env.NODE_ENV
    }
  }));

gulp.task('lint', () =>
  gulp.src(['**/*.js', '!node_modules/**', '!public/lib'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError()));

gulp.task('babel', () => {
  gulp.src([
    './**/*.js',
    '!node_modules/**',
    '!public/lib/**',
    '!gulpfile.babel.js',
    '!bower_components/**/*'
  ])
    .pipe(babel({ presets: ['env'] }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('sass', () => {
  gulp.src('public/css/common.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css/'));
});

gulp.task('test', () => {
  gulp.src(['test/**/*.js'])
    .pipe(mocha({
      reporter: 'spec',
      exit: true,
      compilers: 'babel-core/register'
    }))
    .pipe(exit());
});
