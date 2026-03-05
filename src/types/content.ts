/*
 * @Author: ovenslove 1905997838@qq.com
 * @Date: 2026-03-05 13:40:00
 * @LastEditors: ovenslove 1905997838@qq.com
 * @LastEditTime: 2026-03-05 13:48:12
 * @FilePath: /shiva.ink/src/types/content.ts
 * @Description: 
 * 
 * Copyright (c) 2026 by Yatsen, All Rights Reserved. 
 */
/**
 * @Author: ovenslove (1905997838@qq.com)
 * @Project: shiva.ink
 * @Description: 统一内容模型定义
 */

/**
 * 内容类型枚举
 */
export type ContentType = 'article' | 'blog' | 'video' | 'album'

/**
 * 统一内容项接口
 */
export interface ContentItem {
  id: string              // 唯一标识符 (对于 Markdown 为相对路径，对于 Mock 为 ID)
  type: ContentType       // 内容类型
  title: string           // 标题
  author: string          // 作者
  date: string            // 发布日期 (YYYY-MM-DD)
  categories: string[]    // 分类体系 (支持多级或多个)
  tags: string[]          // 标签系统
  summary: string         // 摘要/简介
  content: string         // 原始内容 (Markdown 或纯文本)
  html?: string           // 解析后的 HTML 内容 (仅限 Markdown 类型)
  cover?: string          // 封面图片
  images?: string[]       // 图片列表
  path?: string           // 文件路径 (本地 Markdown 文件特有)
  stats: {
    views: number
    likes: number
    comments: number
  }
  status: 'published' | 'draft' | 'archived'
  meta?: Record<string, any> // 其他扩展元数据
}

/**
 * 内容分类接口
 */
export interface ContentCategory {
  id: string
  name: string
  parentId: string | null
  children?: ContentCategory[]
}

/**
 * 为保持向后兼容提供的别名
 */
export type Category = ContentCategory
export type Article = ContentItem
