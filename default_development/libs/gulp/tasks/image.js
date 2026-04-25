import gulp from 'gulp';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminSvgo from 'imagemin-svgo';
import config from '../config.js';

const { task, src, dest } = gulp;

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

export const imageTask = () => {
  return src(config.src.top + "/**/*.+(jpg|png|gif|svg)", { encoding: false })
    .pipe(plumber({
      errorHandler: function(e){
        console.error('❌ IMAGE ERROR:', e.message);
        this.emit('end');
      }
    }))
    .pipe(changed(config.dest.top))
    .pipe(imagemin(_imagemin))
    .pipe(dest(config.dest.top));
};

task("image", imageTask);
