import gulp from 'gulp';
import config from '../config.js';
import { imageTask } from './image.js';
import { copyTask } from './copy.js';
import { sassTask } from './sass.js';
import { pugTask } from './pug.js';

const { watch, task } = gulp;

// JS/TS の監視は Vite (vite build --watch) が担当するため、ここでは除外
export const watchTask = function(cb) {
  watch(config.src.top + config.src.css, sassTask);
  watch(config.src.top + '/**/*.+(jpg|png|gif|svg|webp)', imageTask);
  watch(config.src.top + '/**/*.+(mp4|pdf)', copyTask);
  watch(config.src.top + config.src.pug, pugTask);
  cb();
};

task('watch', watchTask);
