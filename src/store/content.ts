/**
 * @Author: ovenslove (1905997838@qq.com)
 * @Project: shiva.ink
 * @Description: 统一内容管理 Store (Column Management System)
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ContentItem, ContentCategory } from '../types/content'
import { parseMarkdownToContentItem } from '../utils/markdown'
import { generateMockArticles } from './mockData'

// 在顶层定义 glob，确保 Vite 正确扫描
const mdFiles = import.meta.glob('../articles/**/*.md', { as: 'raw', eager: true })

export const useContentStore = defineStore('content', () => {
  const items = ref<ContentItem[]>([])
  const isLoading = ref(false)

  // 初始化时先加载 Mock 数据，避免首屏空白
  items.value = generateMockArticles()

  // 1. 独立的状态计算，避免嵌套对象导致丢失响应式
  const totalCount = computed(() => items.value.length)
  const blogCount = computed(() => items.value.filter(i => i.type === 'blog').length)
  const articleCount = computed(() => items.value.filter(i => i.type === 'article').length)

  const stats = computed(() => ({
    total: totalCount.value,
    blogs: blogCount.value,
    articles: articleCount.value,
  }))

  // 统一分类定义
  const categories = ref<ContentCategory[]>([
    { id: '热门推荐', name: '热门推荐', parentId: null },
    { id: '最新发布', name: '最新发布', parentId: null },
    { id: '编辑推荐', name: '编辑推荐', parentId: null },
    { id: '专题合集', name: '专题合集', parentId: null },
    { id: '用户投稿', name: '用户投稿', parentId: null },
    { id: 'news', name: '新闻资讯', parentId: null },
    { id: 'tech', name: '技术分享', parentId: null },
    { id: 'frontend', name: '前端开发', parentId: 'tech' },
    { id: 'backend', name: '后端技术', parentId: 'tech' },
    { id: 'database', name: '数据库', parentId: 'tech' },
    { id: 'devops', name: 'DevOps', parentId: 'tech' },
    { id: 'ai', name: '人工智能', parentId: 'tech' },
    { id: 'photography', name: '摄影作品', parentId: null },
    { id: 'life', name: '日常生活', parentId: null },
    { id: 'food', name: '美食分享', parentId: 'life' },
    { id: 'travel', name: '旅行记录', parentId: 'life' },
    { id: 'home', name: '家居生活', parentId: 'life' },
    { id: 'pet', name: '宠物日常', parentId: 'life' },
    { id: 'study', name: '学习心得', parentId: null },
    { id: 'method', name: '学习方法', parentId: 'study' },
    { id: 'exam', name: '考试经验', parentId: 'study' },
    { id: 'skill', name: '技能提升', parentId: 'study' },
    { id: 'book', name: '读书笔记', parentId: 'study' },
    { id: 'thought', name: '生活感悟', parentId: null },
    { id: 'life-thinking', name: '人生思考', parentId: 'thought' },
    { id: 'emotion', name: '情感体验', parentId: 'thought' },
    { id: 'growth', name: '成长故事', parentId: 'thought' },
    { id: 'career', name: '职场感悟', parentId: 'thought' }
  ])

  /**
   * 初始化并加载所有内容
   */
  const initContent = async () => {
    // 如果已经加载过数据，且包含博客，则不再重复加载
    if (items.value.length > 0 && items.value.some(i => i.type === 'blog')) {
      return
    }

    isLoading.value = true
    try {
      const allItems: ContentItem[] = []

      // 1. 加载 Legacy 文章 (Mock 数据) - 优先加载确保有数据展示
      const mockItems = generateMockArticles()
      if (mockItems && mockItems.length > 0) {
        allItems.push(...mockItems)
      }

      // 2. 加载本地 Markdown 博客 (智能归类已在解析器中实现)
      try {
        const paths = Object.keys(mdFiles)
        for (const path of paths) {
          const content = mdFiles[path] as string
          // 灵活提取相对路径：移除所有可能的前缀直到 articles/
          const relativePath = path.split('articles/').pop() || path
          const item = parseMarkdownToContentItem(content, relativePath)
          
          // 强制修正类型为 blog
          if (!item.type || item.type === 'article') {
            item.type = 'blog'
          }
          
          allItems.push(item)
        }
      } catch (mdError) {
        console.error('Critical: Failed to process markdown files:', mdError)
      }

      // 3. 排序：按日期降序 (带安全性检查)
      const sortedItems = [...allItems].sort((a, b) => {
        const dateA = new Date(a.date).getTime()
        const dateB = new Date(b.date).getTime()
        if (isNaN(dateA)) return 1
        if (isNaN(dateB)) return -1
        return dateB - dateA
      })
      
      items.value = sortedItems
    } catch (error) {
      console.error('Failed to load content:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 搜索与筛选功能
   */
  const filterItems = (params: { 
    keyword?: string, 
    categoryId?: string, 
    type?: string,
    tag?: string
  }) => {
    return items.value.filter(item => {
      const matchKeyword = !params.keyword || 
        item.title.toLowerCase().includes(params.keyword.toLowerCase()) ||
        item.summary.toLowerCase().includes(params.keyword.toLowerCase())
      
      const matchCategory = !params.categoryId || item.categories.includes(params.categoryId)
      const matchType = !params.type || item.type === params.type
      const matchTag = !params.tag || item.tags.includes(params.tag)

      return matchKeyword && matchCategory && matchType && matchTag
    })
  }

  /**
   * 获取详情
   */
  const getContentById = (id: string) => {
    // 兼容解码后的 ID 和原始 ID
    const decodedId = decodeURIComponent(id)
    return items.value.find(item => item.id === id || item.id === decodedId)
  }

  // --- Getters ---

  const categoryTree = computed(() => {
    const map: Record<string, ContentCategory> = {}
    const tree: ContentCategory[] = []
    categories.value.forEach(cat => {
      map[cat.id] = { ...cat, children: [] }
    })
    categories.value.forEach(cat => {
      const node = map[cat.id]
      if (cat.parentId && map[cat.parentId]) {
        map[cat.parentId].children?.push(node)
      } else if (!cat.parentId) {
        tree.push(node)
      }
    })
    return tree
  })

  const allTags = computed(() => {
    const tags = new Set<string>()
    items.value.forEach(item => item.tags.forEach(t => tags.add(t)))
    return Array.from(tags)
  })

  return {
    items,
    isLoading,
    categories,
    categoryTree,
    allTags,
    stats,
    totalCount,
    blogCount,
    articleCount,
    initContent,
    filterItems,
    getContentById
  }
})
