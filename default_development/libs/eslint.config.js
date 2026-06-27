import js from '@eslint/js';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules/**', '../htdocs/**'],
  },
  js.configs.recommended,
  {
    // ブラウザで動く src 配下の TypeScript
    files: ['src/**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      'no-undef': 'off', // TypeScript が担当するため無効化
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
