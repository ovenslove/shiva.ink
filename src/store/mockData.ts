import { ContentItem } from '../types/content'

/**
 * 生成符合要求的 50+ 篇测试文章数据
 */
export const generateMockArticles = (): ContentItem[] => {
  const articles: ContentItem[] = []
  
  // 极简数据生成，排除所有潜在运行错误
  for (let i = 1; i <= 50; i++) {
    articles.push({
      id: `mock-${i}`,
      type: 'article',
      title: `测试文章 #${i}`,
      author: 'Shiva',
      date: new Date().toISOString(),
      categories: ['热门推荐', 'news'],
      tags: ['测试'],
      summary: '这是一篇生成的测试文章摘要',
      cover: `https://picsum.photos/400/300?random=${i + 200}`,
      content: '这是一篇生成的测试文章正文内容',
      stats: { views: i * 10, likes: i, comments: 0 },
      status: 'published'
    })
  }
  
  return articles
}
