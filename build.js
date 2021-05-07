const { build } = require('esbuild')

build({
  entryPoints: [
    './src/extension.ts',
    './src/webview/form.ts',
  ],
  platform: 'node',
  external: ['vscode'],
  outdir: 'build',
  tsconfig: './tsconfig.json',
  bundle: true,
  watch: true,
  ...(process.env.NODE_ENV === 'production' ? {
    watch: false
  } : {})
})