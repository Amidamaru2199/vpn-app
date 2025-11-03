import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/vpn-app/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  plugins: [
    vue(),
    // PWA отключен из-за конфликта с Vite 4 + vite-plugin-pwa
    // Можно включить после обновления Node.js до 18+ и Vite до 5+
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/assets/constants.scss";`
      }
    }
  },
})