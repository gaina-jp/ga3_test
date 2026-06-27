import gulp from 'gulp';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { pugTask } from './gulp/tasks/pug.js';
import { sassTask } from './gulp/tasks/sass.js';
import { copyTask } from './gulp/tasks/copy.js';
import { imageTask } from './gulp/tasks/image.js';
import { watchTask } from './gulp/tasks/watch.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { series, parallel, task } = gulp;

// dev: TS を監視してビルド（バックグラウンド起動）
const viteBuildWatchTask = (done) => {
  spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--watch', '--mode', 'development'], {
    stdio: 'inherit',
    cwd: __dirname,
  }).on('error', err => console.error('❌ VITE BUILD WATCH ERROR:', err.message));
  done();
};

// dev: htdocs をサーブ（バックグラウンド起動）
const viteServeTask = (done) => {
  spawn(process.execPath, ['node_modules/vite/bin/vite.js'], {
    stdio: 'inherit',
    cwd: __dirname,
  }).on('error', err => console.error('❌ VITE SERVE ERROR:', err.message));
  done();
};

// build: TS を本番ビルド（完了まで待機）
const viteBuildTask = (done) => {
  const vite = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'build', '--mode', 'production'], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  vite.on('close', () => done());
  vite.on('error', err => {
    console.error('❌ VITE BUILD ERROR:', err.message);
    done(err);
  });
};

// 開発タスク
// 初回ビルド → Vite watch(TS) + Vite serve + Gulp watch 開始
export const dev = series(
  parallel(pugTask, sassTask, copyTask, imageTask),
  parallel(viteBuildWatchTask, viteServeTask, watchTask)
);
task('dev', dev);

// ビルドタスク（本番）
export const build = series(
  parallel(pugTask, sassTask, copyTask, imageTask),
  viteBuildTask
);
task('build', build);

export default dev;
