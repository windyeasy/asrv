import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'
import node from 'eslint-plugin-n'
import jsoncParser from 'jsonc-eslint-parser'
import jsonc from 'eslint-plugin-jsonc'
import unicorn from 'eslint-plugin-unicorn'
import markdown from '@eslint/markdown'
import jsdoc from 'eslint-plugin-jsdoc'

/**
 * finished: node, unicorn, markdown,  , jsdoc
 * todo: jsonc order
 */
export default defineConfig([
  globalIgnores([
    '**/dist/**',
  ]),
  {
    files: ['**/*.?([cm])([tj])s', '**/*.?([tj])sx'],
    plugins: { js }, extends: ['js/recommended'],
  },
  {
    // 查找文件匹配规则，与正则的语法是不同的
    files: ['**/*.?([cm])([tj])s', '**/*.?([tj])sx'],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.json', '**/*.json5', '**/*.jsonc'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      jsonc,
    },
    rules: {
      ...(jsonc.configs['recommended-with-jsonc']
        .rules),
      'jsonc/quote-props': 'off',
      'jsonc/quotes': 'off',
    },
  },
  {
    extends: [...tseslint.configs.recommended],
    files: ['**/*.?([cm])ts', '**/*.tsx'],
  },
  ...markdown.configs.processor,
  {
    files: ['**/*.md'],
    plugins: {
      markdown,
    },

    rules: {
      ...markdown.configs.recommended.rules,
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: {
      '@stylistic': stylistic,
      'unicorn': unicorn,
      'jsdoc': jsdoc,
      node,
    },
    rules: {
      'semi': ['error', 'never'],
      // 强制使用模板字符串
      'prefer-template': 'error',
      // 禁止模板字符串中的空格
      'template-curly-spacing': ['error', 'never'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      ...stylistic.configs.recommended.rules,
      '@stylistic/indent': ['error', 2],
      '@stylistic/jsx-indent': ['error', 2],
      '@stylistic/quotes': ['error', 'single'],
      ...unicorn.configs.recommended.rules,
      'unicorn/no-anonymous-default-export': 'off',
      // jsdoc
      'jsdoc/check-access': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/check-property-names': 'warn',
      'jsdoc/check-types': 'warn',
      'jsdoc/empty-tags': 'warn',
      'jsdoc/implements-on-classes': 'warn',
      'jsdoc/no-defaults': 'warn',
      'jsdoc/no-multi-asterisks': 'warn',
      'jsdoc/require-param-name': 'warn',
      'jsdoc/require-property': 'warn',
      'jsdoc/require-property-description': 'warn',
      'jsdoc/require-property-name': 'warn',
      'jsdoc/require-returns-check': 'warn',
      'jsdoc/require-returns-description': 'warn',
      'jsdoc/require-yields-check': 'warn',
      // node
      'node/handle-callback-err': ['error', '^(err|error)$'],
      'node/no-deprecated-api': 'error',
      'node/no-exports-assign': 'error',
      'node/no-new-require': 'error',
      'node/no-path-concat': 'error',
      'node/no-unsupported-features/es-builtins': 'error',
      'node/prefer-global/buffer': ['error', 'never'],
      'node/prefer-global/process': ['error', 'never'],
      'node/process-exit-as-throw': 'error',
    },
  },
])
