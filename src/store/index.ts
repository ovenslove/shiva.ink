/*
 * @Author: ovenslove (1905997838@qq.com)
 * @Project: shiva.ink
 * @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
 * @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
 */
import { defineStore } from 'pinia'
import { generateMockArticles } from './mockData'
import { ContentItem, ContentCategory } from '../types/content'

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

// --- 图文内容管理系统模型 (保持向后兼容) ---

export type { Category, Article } from '../types/content'

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
  photoCount: number
  createdAt: string
  updatedAt: string
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
 * 媒体管理 Store (原 useMediaStore)
 */
export const useMediaStore = defineStore('media', {
  state: () => {
    // 生成 50 条测试数据
    const mockAlbums: Album[] = Array.from({ length: 50 }, (_, i) => {
      const id = i + 1;
      const dateStr = new Date(Date.now() - i * 86400000).toISOString().split('T')[0];
      return {
        id,
        title: `相册 ${id}: ${['光影流年', '岁月如歌', '旅行随笔', '生活碎片', '城市之光'][i % 5]}`,
        cover: `https://picsum.photos/800/600?random=${id}`,
        date: dateStr,
        tags: [['日常', '旅行', '美食', '摄影', '技术'][i % 5], ['瞬间', '感悟'][i % 2]],
        description: `这是第 ${id} 个相册的详细描述，记录了生活中的美好瞬间。`,
        views: Math.floor(Math.random() * 5000),
        likes: Math.floor(Math.random() * 1000),
        photoCount: Math.floor(Math.random() * 100) + 1,
        createdAt: new Date(Date.now() - i * 86400000).toISOString(),
        updatedAt: new Date().toISOString(),
        images: Array.from({ length: 5 }, (_, j) => `https://picsum.photos/800/600?random=${id * 10 + j}`)
      };
    });

    return {
      isLoading: false,
      // 相册数据
      albums: mockAlbums,
      
      // 视频数据
      videos: [
        { id: 1, title: '大理洱海环湖记', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/800/600?random=2', date: '2026-02-25', tags: ['旅行', '日常'], duration: '03:45', description: '记录大理洱海边的惬意时光，阳光、微风与自由。', views: 2500, likes: 680 },
        { id: 2, title: 'Vue 3 组件库封装教程', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/800/600?random=101', date: '2026-02-20', tags: ['技术', '学习'], duration: '15:20', description: '从零开始教你如何封装一个高质量的 Vue 3 组件库。', views: 4200, likes: 1100 },
        { id: 3, title: '自制芝士蛋糕全过程', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/800/600?random=3', date: '2026-02-15', tags: ['美食'], duration: '08:10', description: '简单易学的芝士蛋糕教程，新手也能零失败。', views: 1800, likes: 450 },
        { id: 4, title: '川西理塘航拍合集', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/800/600?random=102', date: '2026-02-05', tags: ['摄影', '旅行'], duration: '04:30', description: '以上帝视角看理塘，感受丁真的家乡之美。', views: 3100, likes: 890 },
        { id: 5, title: '日常桌面整理 VLOG', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/800/600?random=4', date: '2026-02-10', tags: ['日常'], duration: '06:15', description: '整理桌面也是整理心情，开启高效的一天。', views: 1500, likes: 320 },
      ] as Video[]
    };
  },
  actions: {
    /**
     * 分页获取相册
     * @param page 页码 (从1开始)
     * @param pageSize 每页数量
     */
    async getAlbumsByPage(page: number, pageSize: number) {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return {
        list: this.albums.slice(start, end),
        total: this.albums.length,
        page,
        pageSize
      };
    }
  },
  getters: {
    allTags: (state): string[] => {
      const tags = new Set<string>()
      state.albums.forEach(a => a.tags.forEach(t => tags.add(t)))
      state.videos.forEach(v => v.tags.forEach(t => tags.add(t)))
      return Array.from(tags)
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
    },
    setDensity(val: number) {
      this.animationDensity = val
    }
  }
})
