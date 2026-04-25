import gulp from 'gulp';
import browserSync from 'browser-sync';
import config from '../config.js';

const { task } = gulp;

export const serverTask = (done) => {
  browserSync.init({
    server: {
      baseDir: config.dest.top
    },
    host: config.server.host,
    port: parseInt(config.server.port, 10),
    open: true,
    notify: false // 右上の通知を消す場合
  });
  done();
};

task("server", serverTask);
