import gulp from 'gulp';
import browserSync from 'browser-sync';
import config from '../config.js';
import { imageTask } from './image.js';
import { copyTask } from './copy.js';
import { webpackTask } from './webpack.js';
import { sassTask } from './sass.js';
import { pugTask } from './pug.js';

const { watch, task, series } = gulp;

// ファイルがコピーされたり更新された時にリロードする用のタスク
const reload = (done) => {
  browserSync.reload();
  done();
};

export const watchTask = function(cb){
  watch(config.src.top + config.src.js, webpackTask);
  watch(config.src.top + config.src.css, sassTask);
  
  // コピーや画像最適化は時間がかかったり、stream対応が複雑なため
  // 処理が終わった後に reload タスクを呼ぶと確実です。
  watch(config.src.top + "/**/*.+(jpg|png|gif|svg)", series(imageTask, reload));
  watch(config.src.top + "/**/*.+(webp|mp4|pdf)", series(copyTask, reload));
  
  watch(config.src.top + config.src.pug, pugTask);
  cb();
};

task("watch", watchTask);
