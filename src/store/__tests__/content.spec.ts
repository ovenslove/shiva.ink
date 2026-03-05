import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useContentStore } from '../content'

describe('useContentStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize content with mock articles', async () => {
    const store = useContentStore()
    // 初始状态即包含 Mock 数据
    expect(store.items.length).toBeGreaterThanOrEqual(50)
    
    await store.initContent()
    
    // 应该包含 Mock 数据和 12 篇 Markdown 博客
    expect(store.items.length).toBeGreaterThanOrEqual(62)
    expect(store.stats.total).toBeGreaterThanOrEqual(62)
    expect(store.stats.articles).toBeGreaterThanOrEqual(50)
    expect(store.stats.blogs).toBeGreaterThanOrEqual(12)
  })

  it('should filter items by type', async () => {
    const store = useContentStore()
    await store.initContent()
    
    const articles = store.filterItems({ type: 'article' })
    expect(articles.length).toBeGreaterThanOrEqual(50)
    
    const blogs = store.filterItems({ type: 'blog' })
    // 现在应该有 12 篇本地 markdown 文件
    expect(blogs.length).toBeGreaterThanOrEqual(12)
  })
})
