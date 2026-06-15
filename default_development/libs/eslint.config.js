import js from '@eslint/js';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules/**', '../htdocs/**'],
  },
  js.configs.recommended,
  {
    // ブラウザで動く src 配下のバンドル対象 JS（ESModules）
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
  {
    // Node 環境で動くビルドスクリプト
    files: ['gulpfile.js', 'gulp/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
  },
];
