import { resolve } from 'node:path'
import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => {
  const isDev = command === 'serve'

  const config: UserConfig = {
    plugins: [
      vue(),
      ...(!isDev
        ? [
            dts({
              insertTypesEntry: true,
              outDir: 'dist/types',
              tsconfigPath: './tsconfig.json',
            }),
          ]
        : []),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3333,
    },
  }

  if (isDev) {
    config.root = 'dev'
  } else {
    config.build = {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'VueditImageEditor',
        formats: ['es', 'umd'],
        fileName: (format) => `vuedit-image-editor.${format}.js`,
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === 'style.css') return 'style.css'
            return assetInfo.name!
          },
        },
      },
      cssCodeSplit: false,
      sourcemap: true,
    }
  }

  return config
})
