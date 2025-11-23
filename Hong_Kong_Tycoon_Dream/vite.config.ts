import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 使用相對路徑 './'，這是 GitHub Pages 的萬能設定
  // 無論 Repository 叫什麼名字，或者放在子目錄，它都能自動抓到正確的資源
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
  }
})