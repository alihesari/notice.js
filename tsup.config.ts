import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: { index: 'src/index.ts' },
    format: ['esm', 'cjs'],
    target: 'es2020',
    dts: true,
    sourcemap: true,
    outExtension: ({ format }) => ({ js: format === 'esm' ? '.mjs' : '.cjs' }),
  },
  {
    entry: { notice: 'src/browser.ts' },
    format: ['iife'],
    target: 'es2020',
    minify: true,
    sourcemap: true,
    outExtension: () => ({ js: '.js' }),
  },
]);
