import { Article } from './index'

const generateMockArticles = (): Article[] => {
  const articles: Article[] = []
  const categories = {
    '1': ['1-1', '1-2', '1-3', '1-4'], // 日常生活
    '2': ['2-1', '2-2', '2-3', '2-4'], // 学习心得
    '3': ['3-1', '3-2', '3-3', '3-4']  // 生活感悟
  }

  const authors = ['Shiva', 'Ovenslove', 'Guest']
  
  // 生成 15 篇日常生活类
  for (let i = 1; i <= 15; i++) {
    const subCat = categories['1'][Math.floor(Math.random() * categories['1'].length)]
    articles.push({
      id: `art-1-${i}`,
      title: `日常生活分享 #${i}: ${['美味下午茶', '周末旅行漫记', '温馨家居整理', '可爱的猫主子'][i % 4]}`,
      content: `这是一篇关于日常生活的详细文章内容... (模拟 800-1500 字) `.repeat(50),
      images: [
        `https://picsum.photos/id/${10 + i}/800/600`,
        `https://picsum.photos/id/${20 + i}/800/600`,
        `https://picsum.photos/id/${30 + i}/800/600`
      ],
      author: authors[0],
      publishTime: `2025-${(Math.floor(Math.random() * 8) + 5).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
      readCount: Math.floor(Math.random() * 2000) + 500,
      likeCount: Math.floor(Math.random() * 500) + 100,
      commentCount: Math.floor(Math.random() * 50) + 5,
      categoryIds: ['1', subCat],
      tags: ['日常', '生活'],
      status: 'published'
    })
  }

  // 生成 15 篇学习心得类
  for (let i = 1; i <= 15; i++) {
    const subCat = categories['2'][Math.floor(Math.random() * categories['2'].length)]
    articles.push({
      id: `art-2-${i}`,
      title: `学习心得笔记 #${i}: ${['Vue3 深度进阶', 'TypeScript 高级用法', '高效学习方法论', '前端工程化实践'][i % 4]}`,
      content: `这是一篇关于学习心得的专业文章内容... (模拟 800-1500 字) `.repeat(60),
      images: [
        `https://picsum.photos/id/${100 + i}/800/600`,
        `https://picsum.photos/id/${110 + i}/800/600`,
        `https://picsum.photos/id/${120 + i}/800/600`
      ],
      author: authors[0],
      publishTime: `2025-${(Math.floor(Math.random() * 8) + 5).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
      readCount: Math.floor(Math.random() * 5000) + 1000,
      likeCount: Math.floor(Math.random() * 1000) + 200,
      commentCount: Math.floor(Math.random() * 100) + 10,
      categoryIds: ['2', subCat],
      tags: ['学习', '技术'],
      status: 'published'
    })
  }

  // 生成 15 篇生活感悟类
  for (let i = 1; i <= 15; i++) {
    const subCat = categories['3'][Math.floor(Math.random() * categories['3'].length)]
    articles.push({
      id: `art-3-${i}`,
      title: `生活感悟录 #${i}: ${['关于成长的思考', '情感世界的独白', '职场进阶之路', '寻找内心的宁静'][i % 4]}`,
      content: `这是一篇关于生活感悟的深度文章内容... (模拟 800-1500 字) `.repeat(55),
      images: [
        `https://picsum.photos/id/${200 + i}/800/600`,
        `https://picsum.photos/id/${210 + i}/800/600`,
        `https://picsum.photos/id/${220 + i}/800/600`
      ],
      author: authors[0],
      publishTime: `2025-${(Math.floor(Math.random() * 8) + 5).toString().padStart(2, '0')}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`,
      readCount: Math.floor(Math.random() * 3000) + 800,
      likeCount: Math.floor(Math.random() * 800) + 150,
      commentCount: Math.floor(Math.random() * 80) + 8,
      categoryIds: ['3', subCat],
      tags: ['感悟', '思考'],
      status: 'published'
    })
  }

  return articles
}

export const mockArticles = generateMockArticles()
