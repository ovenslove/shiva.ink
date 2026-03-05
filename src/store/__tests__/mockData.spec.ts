import { describe, it, expect } from 'vitest'
import { generateMockArticles } from '../mockData'
import { ContentItem } from '../../types/content'

describe('mockData content generation', () => {
  const mockArticles = generateMockArticles()
  
  it('should generate at least 50 articles', () => {
    expect(mockArticles.length).toBeGreaterThanOrEqual(50)
  })

  it('should have correct structure and types for each article', () => {
    mockArticles.forEach((article: ContentItem) => {
      // 验证必填字段存在且类型正确
      expect(typeof article.id).toBe('string')
      expect(article.type).toBe('article')
      expect(typeof article.title).toBe('string')
      expect(typeof article.author).toBe('string')
      expect(typeof article.date).toBe('string')
      
      // 验证日期符合 ISO 8601 格式
      expect(new Date(article.date).toISOString()).toBe(article.date)

      // 验证标签系统
      expect(Array.isArray(article.tags)).toBe(true)
      expect(article.tags.length).toBeGreaterThanOrEqual(1)
      article.tags.forEach(tag => {
        expect(typeof tag).toBe('string')
      })

      // 验证分类系统 (分组 + 类型)
      expect(Array.isArray(article.categories)).toBe(true)
      expect(article.categories.length).toBe(2)

      // 验证统计数据
      expect(typeof article.stats.views).toBe('number')
      expect(typeof article.stats.likes).toBe('number')
      expect(typeof article.stats.comments).toBe('number')
    })
  })

  it('should have balanced distribution among groups', () => {
    const groups = ['热门推荐', '最新发布', '编辑推荐', '专题合集', '用户投稿']
    const groupCounts = groups.reduce((acc, group) => {
      acc[group] = mockArticles.filter(a => a.categories.includes(group)).length
      return acc
    }, {} as Record<string, number>)

    groups.forEach(group => {
      expect(groupCounts[group]).toBeGreaterThanOrEqual(10)
    })
  })
})
