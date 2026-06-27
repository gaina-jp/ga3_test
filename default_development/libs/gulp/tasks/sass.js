import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as sassEmbedded from 'sass-embedded';
import plumber from 'gulp-plumber';
import gulpif from 'gulp-if';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import config from '../config.js';

const sass = gulpSass(sassEmbedded);
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
    .pipe(sass.sync(config.sass.opt))
    .pipe(autoprefixer(config.sass.autoprefixer))
    .pipe(gulpif(config.sass.minify, cleanCSS({level: 0})))
    .pipe(gulpif(config.sass.sourcemap, sourcemaps.write("/")))
    .pipe(dest(config.dest.top + "/assets/css/"));
};

task("sass", sassTask);
