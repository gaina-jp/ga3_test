import gulp from 'gulp';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import config from '../config.js';

const { task, src, dest } = gulp;

export const webpackTask = function(){
  let obj = config.wp({
    script: config.src.top + "/assets/js/script.js",
  });
  // GulpのsrcからwebpackStreamに渡す（エラーハンドリングも適切に動作するように）
  return src(config.src.top + "/assets/js/script.js")
    .pipe(plumber({
      errorHandler: function (err) {
        console.error('❌ WEBPACK ERROR:', err.message);
        this.emit('end');
      }
    }))
    .pipe(webpackStream(obj, webpack))
    .pipe(dest(config.dest.top + "/assets/js/"))
    .pipe(browserSync.stream()); // Browsersyncの更新通知
};

task("webpack", webpackTask);
