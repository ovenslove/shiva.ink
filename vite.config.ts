/*
 * @Author: ovenslove 1905997838@qq.com
 * @Date: 2026-02-25 14:37:12
 * @LastEditors: ovenslove 1905997838@qq.com
 * @LastEditTime: 2026-03-05 17:34:33
 * @FilePath: /shiva.ink/vite.config.ts
 * @Description: 
 * 
 * Copyright (c) 2026 by Yatsen, All Rights Reserved. 
 */
/**
 * @Author: ovenslove (1905997838@qq.com)
 * @Project: shiva.ink
 * @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
 * @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
 */

/// <reference types="vitest" />
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import viteCompression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    // 强制解析 element-plus 的 es 模块，避免 Rollup 找不到内部 mjs 文件
    mainFields: ['module', 'main'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
  },
  base: '/', // 自定义域名使用根路径
  plugins: [
    vue(),
    viteCompression({
      verbose: true,
      disable: false,
      threshold: 10240,
      algorithm: 'gzip',
      ext: '.gz',
    })
  ],
  define: {
    // 注入 global 以支持某些依赖 Node.js globals 的库 (如 gray-matter)
    global: 'globalThis',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus'],
          'vendor': ['vue', 'vue-router', 'pinia', 'dayjs']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
