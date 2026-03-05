---
title: Vue 3 与 Vite 的极致体验
author: Shiva
date: 2024-03-05
categories: [技术, 前端]
tags: [Vue3, Vite, 性能优化]
summary: 探讨如何利用 Vite 的特性优化 Vue 3 项目的开发流程和构建性能。
---

# Vue 3 与 Vite 的极致体验

Vue 3 配合 Vite 真的太快了！

## 核心特性
- **Composition API**: 更好的逻辑复用。
- **Fast HMR**: 毫秒级响应。

### 示例代码
```typescript
import { ref } from 'vue'

const count = ref(0)
const increment = () => count.value++
```

| 特性 | 说明 |
| --- | --- |
| 启动速度 | 冷启动非常快 |
| 热更新 | 响应式极速 |
