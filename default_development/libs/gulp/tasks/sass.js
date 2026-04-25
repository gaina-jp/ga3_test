import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';
import config from '../config.js';

const sassCompiler = gulpSass(dartSass);
const { task, src, dest } = gulp;

export const sassTask = () => {
  return src([config.src.top + "/assets/css/**/style.scss", "!" + config.src.top + "/assets/css/**/_**.scss"])
    .pipe(plumber({
      errorHandler: function (err) {
        console.error('❌ SASS ERROR:', err.message);
        this.emit('end');
      }
    }))
    .pipe(gulpif(config.sass.sourcemap, sourcemaps.init()))
    .pipe(sassCompiler(config.sass.opt))
    .pipe(autoprefixer(config.sass.autoprefixer))
    .pipe(gulpif(config.sass.minify, cleanCSS({level: 0})))
    .pipe(gulpif(config.sass.sourcemap, sourcemaps.write("/")))
    .pipe(dest(config.dest.top + "/assets/css/"))
    .pipe(browserSync.stream()); // Browsersyncの更新通知
};

task("sass", sassTask);
