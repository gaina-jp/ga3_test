import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  // Gulp がビルドした htdocs をそのままサーブ
  root: path.resolve(__dirname, '../htdocs'),
  server: {
    open: true,
    // Cloudflare Tunnel 等で外部公開する場合は host: true を追加
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/assets/js/script.ts'),
      formats: ['iife'],
      name: 'Script',
    },
    outDir: path.resolve(__dirname, '../htdocs/assets/js'),
    emptyOutDir: false,
    minify: mode === 'production',
    sourcemap: true,
    rollupOptions: {
      output: {
        entryFileNames: 'script.js',
      },
    },
  },
}));
