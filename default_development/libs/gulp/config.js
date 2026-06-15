import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dest = "../htdocs";
const src = "./src";

// 開発環境か本番環境かの判定 (例: NODE_ENV=development npx gulp)
export const isDev = process.env.NODE_ENV === 'development';

export default {
  dest: {
    js: "/js",
    css: "/css",
    top: dest,
  },
  
  src: {
    js: "/**/*.js",
    css: "/**/*.scss",
    pug: "/**/*.+(html|pug)",
    images: "/*.+(jpg|gif|png)",
    module: src + "/__utility",
    top: src,
  },
  
  wp: function (entry) {
    return {
      mode: isDev ? "development" : "production",
      // production or development
      context: path.resolve(__dirname, '../'),
      entry: entry,
      output: {
        filename: (pathData) => {
          let _name = pathData.chunk.name;
          if (_name.indexOf("_") < 0) {
            return _name + '.js';
          } else {
            _name = _name.replace("_", "/");
            return _name + '/script.js';
          }
        }
      },
      devtool: isDev ? 'eval-source-map' : 'source-map',
      externals: {},
      optimization: {
        minimize: !isDev
      },
      resolve: {
        modules: [path.resolve(__dirname, '../'), 'node_modules'],
        extensions: [".js"]
      },
      plugins: []
    }
  },
  
  sass: {
    output: "style.css",
    autoprefixer: {
      overrideBrowserslist: ["last 1 versions"]
    },
    minify: !isDev,
    sourcemap: isDev,
    opt: {}
  },
  
  server: {
    host: "localhost",
    root: dest,
    livereload: true
  }
};
