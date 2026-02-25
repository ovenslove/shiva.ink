import { defineStore } from 'pinia'

/**
 * 用户信息 Store
 * @description 管理个人简介、心情、状态等
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    nickname: 'Shiva',
    avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=shiva', // 默认可爱头像
    signature: '在星辰大海中漫步的小女生 ✨',
    status: '正在学习 Vue 3 + Vite',
    mood: 'Happy',
    tags: ['日常', '旅行', '美食', '学习']
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

interface Album {
  id: number
  title: string
  cover: string
  date: string
  tags: string[]
}

interface Video {
  id: number
  title: string
  url: string
  cover: string
  date: string
  tags: string[]
}

/**
 * 媒体内容 Store
 * @description 管理相册、视频、标签、归档
 */
export const useMediaStore = defineStore('media', {
  state: () => ({
    albums: [
      { id: 1, title: '我的生活', cover: 'https://picsum.photos/id/1011/400/300', date: '2026-02-25', tags: ['日常'] },
      { id: 2, title: '旅行日记', cover: 'https://picsum.photos/id/1015/400/300', date: '2026-02-20', tags: ['旅行'] },
      { id: 3, title: '美味实验室', cover: 'https://picsum.photos/id/1080/400/300', date: '2026-02-15', tags: ['美食'] },
    ] as Album[],
    videos: [
      { id: 1, title: '初春午后', url: 'https://www.w3schools.com/html/movie.mp4', cover: 'https://picsum.photos/id/1020/400/300', date: '2026-02-10', tags: ['日常'] }
    ] as Video[]
  }),
  getters: {
    allTags: (state): string[] => {
      const tags = new Set<string>()
      state.albums.forEach((a: Album) => a.tags.forEach((t: string) => tags.add(t)))
      state.videos.forEach((v: Video) => v.tags.forEach((t: string) => tags.add(t)))
      return Array.from(tags)
    }
  }
})
