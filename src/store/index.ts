/*
 * @Author: ovenslove (1905997838@qq.com)
 * @Project: shiva.ink
 * @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
 * @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
 */
import { defineStore } from 'pinia'
import { mockArticles } from './mockData'

/**
 * 用户信息 Store
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    nickname: 'Shiva',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=shiva',
    signature: '在星辰大海中漫步的小女生 ✨',
    status: '正在学习 Vue 3 + Vite',
    mood: 'Happy',
    tags: ['日常', '旅行', '美食', '学习', '摄影', '技术']
  }),
  actions: {
    updateStatus(newStatus: string) {
      this.status = newStatus
    },
    updateMood(newMood: string) {
      this.mood = newMood
    }
  }
})

// --- 图文内容管理系统模型 ---

export interface Category {
  id: string
  name: string
  parentId: string | null
  children?: Category[]
}

export interface Article {
  id: string
  title: string
  content: string
  images: string[]
  author: string
  publishTime: string
  readCount: number
  likeCount: number
  commentCount: number
  categoryIds: string[]
  tags: string[]
  status: 'draft' | 'pending' | 'published'
}

export interface Album {
  id: number
  title: string
  cover: string
  date: string
  tags: string[]
  description?: string
  views: number
  likes: number
  images?: string[]
}

export interface Video {
  id: number
  title: string
  url: string
  cover: string
  date: string
  tags: string[]
  duration: string
  description: string
  views: number
  likes: number
}

/**
 * 内容管理 Store (原 useMediaStore)
 */
export const useMediaStore = defineStore('media', {
  state: () => ({
    // 相册数据
    albums: [
      { id: 1, title: '我的生活碎片', cover: 'https://picsum.photos/id/1011/800/600', date: '2026-02-28', tags: ['日常'], description: '记录下那些细碎而美好的瞬间，生活本身就是一种艺术。', views: 1250, likes: 320, images: ['https://picsum.photos/id/1012/800/600', 'https://picsum.photos/id/1013/800/600'] },
      { id: 2, title: '大理的云与风', cover: 'https://picsum.photos/id/1015/800/600', date: '2026-02-25', tags: ['旅行'], description: '苍山洱海，风花雪月。在大理度过了一个惬意的假期。', views: 2100, likes: 580 },
      { id: 3, title: '春日午后的咖啡厅', cover: 'https://picsum.photos/id/1080/800/600', date: '2026-02-20', tags: ['美食'], description: '阳光撒进窗台，一杯手冲，一份甜点，就是完美的午后。', views: 890, likes: 150 },
      { id: 4, title: '街头摄影：光与影', cover: 'https://picsum.photos/id/1025/800/600', date: '2026-02-10', tags: ['摄影'], description: '城市里的每一个角落都隐藏着故事，等待着被镜头发现。', views: 1560, likes: 410 },
      { id: 5, title: '深夜食堂：日式拉面', cover: 'https://picsum.photos/id/102/800/600', date: '2026-02-05', tags: ['美食'], description: '浓郁的骨汤，劲道的面条，温暖了深夜的胃。', views: 1100, likes: 280 },
    ] as Album[],
    
    // 分类数据
    categories: [
      { id: '1', name: '日常生活', parentId: null },
      { id: '1-1', name: '美食分享', parentId: '1' },
      { id: '1-2', name: '旅行记录', parentId: '1' },
      { id: '1-3', name: '家居生活', parentId: '1' },
      { id: '1-4', name: '宠物日常', parentId: '1' },
      { id: '2', name: '学习心得', parentId: null },
      { id: '2-1', name: '学习方法', parentId: '2' },
      { id: '2-2', name: '考试经验', parentId: '2' },
      { id: '2-3', name: '技能提升', parentId: '2' },
      { id: '2-4', name: '读书笔记', parentId: '2' },
      { id: '3', name: '生活感悟', parentId: null },
      { id: '3-1', name: '人生思考', parentId: '3' },
      { id: '3-2', name: '情感体验', parentId: '3' },
      { id: '3-3', name: '成长故事', parentId: '3' },
      { id: '3-4', name: '职场感悟', parentId: '3' },
    ] as Category[],
    
    // 文章数据 (CMS)
    articles: mockArticles as Article[],
    
    // 视频数据
    videos: [
      { id: 1, title: '大理洱海环湖记', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1015/800/600', date: '2026-02-25', tags: ['旅行', '日常'], duration: '03:45', description: '记录大理洱海边的惬意时光，阳光、微风与自由。', views: 2500, likes: 680 },
      { id: 2, title: 'Vue 3 组件库封装教程', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1/800/600', date: '2026-02-20', tags: ['技术', '学习'], duration: '15:20', description: '从零开始教你如何封装一个高质量的 Vue 3 组件库。', views: 4200, likes: 1100 },
      { id: 3, title: '自制芝士蛋糕全过程', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1080/800/600', date: '2026-02-15', tags: ['美食'], duration: '08:10', description: '简单易学的芝士蛋糕教程，新手也能零失败。', views: 1800, likes: 450 },
      { id: 4, title: '川西理塘航拍合集', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1036/800/600', date: '2026-02-05', tags: ['摄影', '旅行'], duration: '04:30', description: '以上帝视角看理塘，感受丁真的家乡之美。', views: 3100, likes: 890 },
      { id: 5, title: '日常桌面整理 VLOG', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1025/800/600', date: '2026-01-25', tags: ['日常'], duration: '06:15', description: '整理桌面也是整理心情，开启高效的一天。', views: 1500, likes: 320 },
      { id: 6, title: 'TypeScript 装饰器详解', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/2/800/600', date: '2026-01-15', tags: ['技术'], duration: '12:45', description: '深入剖析 TS 装饰器的原理及其在项目中的应用场景。', views: 3600, likes: 950 },
      { id: 7, title: '曼谷夜市扫街记', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1043/800/600', date: '2026-01-05', tags: ['美食', '旅行'], duration: '07:20', description: '感受曼谷夜市的热闹与烟火气，吃遍各种奇特美食。', views: 2200, likes: 580 },
      { id: 8, title: '人像摄影布光教程', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1047/800/600', date: '2025-12-20', tags: ['摄影', '学习'], duration: '10:30', description: '教你几招简单的单灯布光技巧，拍出电影感人像。', views: 2800, likes: 720 },
      { id: 9, title: '极简工作流程分享', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1031/800/600', date: '2025-12-10', tags: ['日常', '学习'], duration: '05:50', description: '如何利用 Notion + Todoist 构建一个高效的任务管理系统。', views: 1900, likes: 480 },
      { id: 10, title: '如何实现高性能虚拟列表', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/3/800/600', date: '2025-11-28', tags: ['技术'], duration: '14:10', description: '针对大数据量场景，手把手教你实现一个高性能的虚拟列表。', views: 3400, likes: 880 },
      { id: 11, title: '京都金阁寺冬雪记', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1071/800/600', date: '2025-11-15', tags: ['旅行', '摄影'], duration: '04:15', description: '当金阁寺遇上初雪，那份宁静与唯美令人息。', views: 2600, likes: 750 },
      { id: 12, title: '自制手工皮夹全记录', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1057/800/600', date: '2025-10-30', tags: ['日常', '学习'], duration: '09:40', description: '从裁剪到缝制，见证一个手工皮夹的诞生。', views: 1300, likes: 350 },
      { id: 13, title: 'React 18 并发模式浅析', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/7/800/600', date: '2025-10-15', tags: ['技术'], duration: '11:55', description: '探讨 React 18 并发模式背后的原理及其带来的性能提升。', views: 2900, likes: 790 },
      { id: 14, title: '伊斯坦布尔日落延时', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1062/800/600', date: '2025-10-02', tags: ['摄影', '旅行'], duration: '02:30', description: '用延时摄影记录伊斯坦布尔绝美的日落瞬间。', views: 2100, likes: 620 },
      { id: 15, title: '我的常用摄影器材分享', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1069/800/600', date: '2025-09-18', tags: ['摄影', '日常'], duration: '08:45', description: '从机身到镜头，聊聊我最喜欢的那些摄影装备。', views: 2400, likes: 650 },
      { id: 16, title: '如何阅读源码：以 Vue 3 为例', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/6/800/600', date: '2025-09-05', tags: ['技术', '学习'], duration: '18:30', description: '分享几个高效阅读源码的方法和建议，助你进阶。', views: 3900, likes: 1050 },
      { id: 17, title: '深夜食堂：麻辣烫篇', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/102/800/600', date: '2025-08-20', tags: ['美食'], duration: '06:50', description: '万物皆可麻辣烫，这才是深夜该有的样子。', views: 1700, likes: 420 },
      { id: 18, title: '自制夏日清凉气泡饮', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1060/800/600', date: '2025-08-05', tags: ['美食', '日常'], duration: '05:15', description: '清凉一夏，几款颜值高又好喝的气泡水教程。', views: 1600, likes: 410 },
      { id: 19, title: 'Vite 插件开发实战指南', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/4/800/600', date: '2025-07-22', tags: ['技术'], duration: '13:40', description: '手把手教你如何编写一个自定义的 Vite 插件。', views: 2700, likes: 710 },
      { id: 20, title: '我的书架 VLOG', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1067/800/600', date: '2025-07-08', tags: ['日常', '学习'], duration: '07:45', description: '聊聊我的藏书，以及那些改变我思维方式的书。', views: 1850, likes: 490 }
    ] as Video[]
  }),
  getters: {
    // 获取所有媒体内容的标签
    allTags: (state): string[] => {
      const tags = new Set<string>()
      state.albums.forEach(a => a.tags.forEach(t => tags.add(t)))
      state.videos.forEach(v => v.tags.forEach(t => tags.add(t)))
      return Array.from(tags)
    },
    // 获取层级分类树 (CMS)
    categoryTree: (state) => {
      const map: Record<string, Category> = {}
      const tree: Category[] = []
      state.categories.forEach(cat => {
        map[cat.id] = { ...cat, children: [] }
      })
      state.categories.forEach(cat => {
        const node = map[cat.id]
        if (cat.parentId) {
          map[cat.parentId].children?.push(node)
        } else {
          tree.push(node)
        }
      })
      return tree
    },
    // 获取所有文章标签 (CMS)
    allArticleTags: (state) => {
      const tags = new Set<string>()
      state.articles.forEach(a => a.tags.forEach(t => tags.add(t)))
      return Array.from(tags)
    }
  },
  actions: {
    // 模拟 RESTful API 接口 (CMS)
    async fetchArticles(params: { page?: number, pageSize?: number, keyword?: string, categoryId?: string }) {
      await new Promise(resolve => setTimeout(resolve, 150))
      let result = [...this.articles]
      if (params.keyword) {
        result = result.filter(a => a.title.includes(params.keyword!) || a.content.includes(params.keyword!))
      }
      if (params.categoryId) {
        result = result.filter(a => a.categoryIds.includes(params.categoryId!))
      }
      const total = result.length
      const page = params.page || 1
      const pageSize = params.pageSize || 10
      const list = result.slice((page - 1) * pageSize, page * pageSize)
      return { list, total, page, pageSize }
    },
    
    addArticle(article: Article) {
      if (!article.title || article.content.length < 10) return false
      this.articles.unshift({ ...article, status: 'published' })
      return true
    },
    
    updateArticle(id: string, updates: Partial<Article>) {
      const index = this.articles.findIndex(a => a.id === id)
      if (index !== -1) {
        this.articles[index] = { ...this.articles[index], ...updates }
        return true
      }
      return false
    },
    
    deleteArticle(id: string) {
      this.articles = this.articles.filter(a => a.id !== id)
    }
  }
})

/**
 * 全局设置 Store
 */
export const useSettingsStore = defineStore('settings', {
  state: () => ({
    enableAnimations: true,
    animationDensity: 0.5,
    particleSpeed: 1,
    themeColor: '#ffb6c1'
  }),
  actions: {
    toggleAnimations() {
      this.enableAnimations = !this.enableAnimations
    }
  }
})
