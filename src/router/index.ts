/*
 * @Author: ovenslove 1905997838@qq.com
 * @Date: 2026-02-25 14:38:26
 * @LastEditors: ovenslove 1905997838@qq.com
 * @LastEditTime: 2026-02-27 17:27:53
 * @FilePath: /shiva.ink/src/router/index.ts
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

import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

/**
 * 路由配置
 * @description 定义项目的核心导航结构
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { 
      title: '首页 - Shiva.ink 创意摄影与视频作品集',
      description: 'Shiva.ink 个人主页，展示最新摄影动态与视频创作。',
      keywords: 'Shiva, 首页, 摄影, 视频, 创意作品'
    }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/Gallery.vue'),
    meta: { 
      title: '相册 - Shiva.ink 摄影作品集',
      description: '探索 Shiva 的摄影世界，包含自然、人像、城市等多种风格的精选相册。',
      keywords: '相册, 摄影作品, Shiva 摄影, 图片展示'
    }
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('../views/Video.vue'),
    meta: { 
      title: '视频 - Shiva.ink 视频创作展示',
      description: '观看 Shiva 的视频作品，记录生活中的动人瞬间与创意叙事。',
      keywords: '视频, 短片, 创意视频, Shiva 视频'
    }
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../views/Archive.vue'),
    meta: { 
      title: '归档 - Shiva.ink 往期内容回顾',
      description: '按时间顺序回顾 Shiva.ink 的所有摄影与视频作品，记录成长足迹。',
      keywords: '归档, 时间轴, 往期作品, 历史记录'
    }
  },
  {
    path: '/articles',
    name: 'Articles',
    component: () => import('../views/Column.vue'),
    meta: { 
      title: '文章 - Shiva.ink 见闻与感悟',
      description: '阅读 Shiva 的生活感悟、学习心得与日常分享。',
      keywords: '博客, 文章, 生活感悟, 学习心得'
    },
    beforeEnter: (to) => { to.query.type = 'article' }
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: () => import('../views/ContentDetail.vue'),
    meta: { title: '文章详情 - Shiva.ink' }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/Column.vue'),
    meta: { 
      title: '博客 - Shiva.ink 自动化 Markdown 系统',
      description: '阅读基于 Markdown 自动化解析系统的本地文章。',
      keywords: 'Markdown, 博客, 技术分享, 自动化'
    },
    beforeEnter: (to) => { to.query.type = 'blog' }
  },
  {
    path: '/blog/:id',
    name: 'BlogPost',
    component: () => import('../views/ContentDetail.vue'),
    meta: { title: '博文详情 - Shiva.ink' }
  },
  {
    path: '/column',
    name: 'Column',
    component: () => import('../views/Column.vue'),
    meta: { 
      title: '专栏 - Shiva.ink 统一内容平台',
      description: 'Shiva.ink 统一内容管理与展示系统，汇聚博客、文章与生活点滴。',
      keywords: '专栏, 博客, 文章, 统一平台, 内容管理'
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(), // GitHub Pages 推荐使用 Hash 模式或配合 404.html 使用 History 模式
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 设置页面 SEO 元素
router.beforeEach((to) => {
  // 设置标题
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 设置描述
  const description = to.meta.description as string
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute('content', description)
    }
  }

  // 设置关键词
  const keywords = to.meta.keywords as string
  if (keywords) {
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (metaKeywords) {
      metaKeywords.setAttribute('content', keywords)
    }
  }
})

export default router
