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
  plugins: [vue()],
  define: {
    // 注入 global 以支持某些依赖 Node.js globals 的库 (如 gray-matter)
    global: 'globalThis',
  },
  build: {
    // 启用压缩，默认使用 esbuild，比 terser 更快且通常更稳定
    minify: 'esbuild',
    // 资源分块策略，优化缓存命中率
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // 将所有 node_modules 合并为一个 vendor 块，确保模块初始化顺序正确，避免运行时错误
            return 'vendor';
          }
        },
        // 资源文件名添加 hash，方便 CDN 长期缓存
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    },
    // 小于 4kb 的资源内联
    assetsInlineLimit: 4096,
    // 启用 sourcemap（可选，生产环境建议关闭以减小包体积）
    sourcemap: false
  }
})
