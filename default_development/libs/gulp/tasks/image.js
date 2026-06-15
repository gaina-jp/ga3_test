import gulp from 'gulp';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import gulpif from 'gulp-if';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import imageminWebp from 'imagemin-webp';
import config from '../config.js';

const { task, src, dest } = gulp;

// jpg / png / gif / svg 用（各プラグインは対応拡張子のみ処理する）
const _imagemin = [
  imageminMozjpeg({
    quality: 75
  }),
  imageminPngquant(),
  imageminGifsicle({
    interlaced: false,
    optimizationLevel: 3,
    colors: 200
  }),
  imageminSvgo({
    plugins: [
      {
        name: 'preset-default',
        params: {
          overrides: {
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertShapeToPath: false,
            collapseGroups: false,
            cleanupIds: false,
          }
        }
      }
    ]
  })
];

// webp 用。imagemin-webp は jpg/png も webp に変換してしまうため、
// 拡張子で振り分けて .webp にだけ適用する（jpg/png をそのまま圧縮するのとは別系統）。
const _imageminWebp = [
  imageminWebp({
    quality: 80
  })
];

const isWebp = (file) => file.extname.toLowerCase() === '.webp';

export const imageTask = () => {
  return src(config.src.top + "/**/*.+(jpg|png|gif|svg|webp)", { encoding: false })
    .pipe(plumber({
      errorHandler: function(e){
        console.error('❌ IMAGE ERROR:', e.message);
        this.emit('end');
      }
    }))
    .pipe(changed(config.dest.top))
    .pipe(gulpif(isWebp, imagemin(_imageminWebp), imagemin(_imagemin)))
    .pipe(dest(config.dest.top));
};

task("image", imageTask);
