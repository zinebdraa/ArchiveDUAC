// import js from "@eslint/js";
// import globals from "globals";
// import reactHooks from "eslint-plugin-react-hooks";
// import reactRefresh from "eslint-plugin-react-refresh";
// import { defineConfig, globalIgnores } from "eslint/config";

// export default defineConfig([
//   globalIgnores(["dist"]),
//   {
//     files: ["**/*.{js,jsx}"],
//     extends: [
//       js.configs.recommended,
//       reactHooks.configs["recommended-latest"],
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//       parserOptions: {
//         ecmaVersion: "latest",
//         ecmaFeatures: { jsx: true },
//         sourceType: "module",
//       },
//     },
//     rules: {
//       "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
//     },
//   },
// ]);
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: [
      'dist',
      'dist-electron',
      'node_modules',
      'build',
      '*.min.js'
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  // Separate config for Electron/Node.js files
  {
    files: ['electron/**/*.{js,cjs}', '**/backend-modules/**/*.{js,cjs}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        process: 'readonly',
        global: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'script', // Important: Use 'script' for CommonJS
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      // Allow console in Node.js files
      'no-console': 'off',
    },
  },
]
