import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx(), vueDevTools()],
  server: 
  {
    proxy: {
      // any request starting with /api will be forwarded to Java backend
      '/api': {
        target: 'http://ielts-practice-java:8080', // Java service container hostname and port
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // optional: remove /api prefix
      },
    },
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
