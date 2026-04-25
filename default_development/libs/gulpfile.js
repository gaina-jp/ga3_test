import gulp from 'gulp';
import { pugTask } from './gulp/tasks/pug.js';
import { sassTask } from './gulp/tasks/sass.js';
import { webpackTask } from './gulp/tasks/webpack.js';
import { copyTask } from './gulp/tasks/copy.js';
import { imageTask } from './gulp/tasks/image.js';
import { serverTask } from './gulp/tasks/server.js';
import { watchTask } from './gulp/tasks/watch.js';

const { series, parallel, task } = gulp;

// 開発タスク
// 初回にすべてビルド → サーバー起動 → 監視開始
export const dev = series(
  parallel(pugTask, sassTask, webpackTask, copyTask, imageTask),
  parallel(serverTask, watchTask)
);
task('dev', dev);

// ビルドタスク (本番用)
export const build = series(
  parallel(pugTask, sassTask, webpackTask, copyTask, imageTask)
);
task('build', build);

export default dev;
