import gulp from 'gulp';
import pug from 'gulp-pug';
import gulpData from 'gulp-data';
import plumber from 'gulp-plumber';
import imageSize from 'image-size';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { task, src, dest } = gulp;

const sourcePath = path.resolve(__dirname, '../../src');

const imageData = function(){
  return gulpData((file) => {
    return {
      imageSize: (imgSrc) => {
        try {
          const filePath = imgSrc.startsWith('/')
            ? path.resolve(sourcePath, imgSrc.slice(1))
            : path.resolve(file.dirname, imgSrc);
          return imageSize(filePath);
        } catch (e) {
          console.error(`❌ ImageSize ERROR: Could not find ${imgSrc}`);
          return {};
        }
      },
    };
  })
};

export const pugTask = () => {
  return src([
    config.src.top + "/**/*.pug",
    "!" + config.src.top + "/**/_*.pug"
  ])
    .pipe(plumber({
      errorHandler: function (err) {
        console.error('❌ PUG ERROR:', err.message);
        this.emit('end');
      }
    }))
    .pipe(imageData())
    .pipe(pug({
      pretty: true,
      doctype: 'html'
    }))
    .pipe(dest(config.dest.top));
};

task("pug", pugTask);
