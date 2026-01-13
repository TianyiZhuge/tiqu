import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.js'),
      name: 'TelainRPG',
      fileName: 'telain-rpg',
      formats: ['umd']
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
