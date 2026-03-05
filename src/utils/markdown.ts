/*
 * @Author: ovenslove (1905997838@qq.com)
 * @Project: shiva.ink
 * @Description: Markdown 解析与元数据提取工具
 */

import MarkdownIt from 'markdown-it'
import matter from 'gray-matter'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'
import { ContentItem } from '../types/content'

// 初始化 markdown-it
const md: MarkdownIt = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: (str: string, lang: string): string => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`
      } catch (__) {}
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`
  }
})

/**
 * 解析单个 Markdown 文件内容，并转换为统一的 ContentItem 格式
 * @param contentRaw 文件原始文本内容
 * @param filePath 文件相对路径 (e.g., 'tech/vue3-guide.md')
 * @returns 解析后的统一内容项
 */
export function parseMarkdownToContentItem(contentRaw: string, filePath: string): ContentItem {
  const { data, content } = matter(contentRaw)
  const html = md.render(content)
  
  const pathParts = filePath.split('/')
  const fileName = pathParts.pop()?.replace('.md', '') || ''
  const folderCategory = pathParts.length > 0 ? pathParts[0] : 'Uncategorized'
  
  // 智能识别：优先使用元数据，否则根据路径自动归类
  const categories = data.categories || (folderCategory !== 'Uncategorized' ? [folderCategory] : [])
  const dateStr = data.date ? new Date(data.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
  
  return {
    id: filePath,
    type: data.type || 'blog',
    title: data.title || fileName,
    author: data.author || 'Shiva',
    date: dateStr,
    categories,
    tags: data.tags || [],
    summary: data.summary || content.slice(0, 150).replace(/[#*`]/g, '') + '...',
    content,
    html,
    cover: data.cover || (data.images && data.images.length > 0 ? data.images[0] : ''),
    images: data.images || [],
    path: filePath,
    stats: {
      views: data.views || Math.floor(Math.random() * 1000),
      likes: data.likes || Math.floor(Math.random() * 100),
      comments: 0
    },
    status: data.status || 'published',
    meta: {
      ...data,
      fileName
    }
  }
}
