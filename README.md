<!--
 * @Author: ovenslove 1905997838@qq.com
 * @Date: 2026-02-25 14:37:12
 * @LastEditors: ovenslove 1905997838@qq.com
 * @LastEditTime: 2026-02-26 16:48:26
 * @FilePath: /shiva.ink/README.md
 * @Description: 
 * 
 * Copyright (c) 2026 by Yatsen, All Rights Reserved. 
-->
# Shiva.ink ✨

Shiva.ink 是一个基于 Vue 3 + TypeScript + Vite 构建的个人博客/作品展示网站。它拥有现代化的 UI 设计、丝滑的交互体验以及针对移动端和桌面端深度优化的响应式布局。

## 🌟 核心特性

- **🎬 全屏视频 Hero 区域**：
  - 支持横竖屏双视频源自动切换，完美适配各种设备。
  - 具备加载状态缓冲、优雅淡入淡出过渡，彻底消除黑屏闪烁。
  - 智能降级策略：在网络不佳时自动显示对应比例的静态封面图。

- **🧚 交互式爱心粒子特效**：
  - 深度优化的鼠标/触摸移动爱心生成算法。
  - 采用单渲染循环 (Single Animation Loop) 与对象池 (Object Pooling) 技术，确保 60FPS 的极致流畅度。
  - 智能频率控制与概率生成，保持视觉清爽且不失灵动。

- **📱 响应式布局与导航**：
  - **智能吸顶 Header**：支持滚动感应（高度收缩、背景模糊、动态阴影）。
  - **移动端适配**：优雅的侧边抽屉菜单，专为 iOS 优化的原生滚动体验 (`-webkit-overflow-scrolling`)。
  - **布局稳定性**：利用 `scrollbar-gutter` 解决因滚动条切换导致的页面宽度抖动。

- **🖼️ 内容展示系统**：
  - **相册 (Gallery)**：支持搜索过滤、标签分类及图片点击放大查看（v-viewer）。
  - **视频 (Video)**：流畅展示个人视频作品。
  - **归档 (Archive)**：基于时间轴记录每一个美好的瞬间。

## 🛠️ 技术栈

- **核心框架**：Vue 3 (Composition API) + TypeScript
- **构建工具**：Vite
- **状态管理**：Pinia
- **路由管理**：Vue Router (Hash 模式，完美适配 GitHub Pages)
- **UI 组件库**：Element Plus
- **动画/样式**：Sass, Animate.css
- **性能优化库**：Vue Lazyload (图片懒加载), v-viewer (图片查看器)

## 🚀 开发指南

### 安装依赖
```bash
npm install
```

### 本地开发
```bash
npm run dev
```

### 构建生产环境
```bash
npm run build
```

### 预览构建产物
```bash
npm run preview
```

## � 版本管理与发布

项目采用 [Semantic Versioning (SemVer)](https://semver.org/lang/zh-CN/) 规范，并使用 `standard-version` 自动化发布流程。

### 版本发布流程

1.  **提交更改**：确保所有更改已提交并推送到 `master` 分支。
2.  **运行发布脚本**：
    - `npm run release`：自动根据 commit message 决定版本号递增类型（patch, minor, major）。
    - `npm run release:patch`：手动发布补丁版本（如 1.0.0 -> 1.0.1）。
    - `npm run release:minor`：手动发布次要版本（如 1.0.0 -> 1.1.0）。
    - `npm run release:major`：手动发布主要版本（如 1.0.0 -> 2.0.0）。
3.  **推送标签**：
    ```bash
    git push --follow-tags origin master
    ```

### 更新日志 (CHANGELOG)
每次运行发布脚本时，系统会自动生成/更新 `CHANGELOG.md` 文件，详细记录每个版本的功能变更、问题修复和优化内容。

### 版本查询
- **前端展示**：页面底部页脚显示当前运行版本。
- **静态接口**：可以通过访问 `/version.json` 获取当前生产环境的最新版本号。

## �📦 部署与分发

项目通过 **GitHub Actions** 自动化构建并部署至 **GitHub Pages**。

- **部署域名**：[shiva.ink](https://shiva.ink)
- **部署配置**：参见 [deploy.yml](.github/workflows/deploy.yml)
- **HTTPS**：已通过 GitHub Pages 强制开启 SSL 证书保障访问安全。

## 📈 性能优化实践

1. **GPU 硬件加速**：大量使用 `transform` (translate3d) 和 `opacity` 进行动画处理，并结合 `will-change` 减少回流重绘。
2. **资源优化**：视频源采用 CDN 托管，并根据屏幕方向动态加载，减少不必要的流量消耗。
3. **滚动优化**：为移动端添加原生滚动加速，并在全局处理布局偏移补偿。
4. **类型安全**：全量 TypeScript 覆盖，并通过 `env.d.ts` 处理 Vue 组件类型识别。

---

Made with ❤️ by Shiva.
