import gulp from 'gulp';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import config from '../config.js';

const { task, src, dest } = gulp;

export const copyTask = () => {
  // 変更検知を全体に対して行うように修正
  return src(config.src.top + "/**/*.+(mp4|pdf)", { encoding: false })
    .pipe(plumber({
      errorHandler: function(e){
        console.error('❌ COPY ERROR:', e.message);
        this.emit('end');
      }
    }))
    .pipe(changed(config.dest.top))
    .pipe(dest(config.dest.top));
};

task("copy", copyTask);
