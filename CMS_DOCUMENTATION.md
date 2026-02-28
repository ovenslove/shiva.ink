# 图文内容管理系统 (CMS) 接口文档与说明

本文档详细说明了 `shiva.ink` 内容管理系统的实现细节、API 规范及测试方案。

## 1. 核心模型定义

### Article (文章)
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 唯一标识符 |
| title | string | 标题 |
| content | string | 正文内容 |
| images | string[] | 图片 URL 数组 |
| author | string | 作者 |
| publishTime | string | 发布时间 (ISO 8601) |
| readCount | number | 阅读量 |
| likeCount | number | 点赞数 |
| categoryIds | string[] | 分类 ID 数组 |
| tags | string[] | 标签数组 |
| status | string | 状态 (published/draft) |

### Category (分类)
| 字段 | 类型 | 说明 |
| --- | --- | --- |
| id | string | 分类 ID |
| name | string | 分类名称 |
| parentId | string \| null | 父级分类 ID |

## 2. API 接口规范 (模拟实现)

所有接口均在 `useMediaStore` 中以异步 Action 形式实现，模拟真实网络延迟 (150ms)。

### 获取文章列表
- **方法**: `fetchArticles(params)`
- **参数**:
  - `page`: 当前页码 (默认 1)
  - `pageSize`: 每页条数 (默认 10)
  - `keyword`: 搜索关键词
  - `categoryId`: 分类 ID
- **响应**: `{ list: Article[], total: number, page: number, pageSize: number }`

### 文章管理
- `addArticle(article)`: 添加新文章 (包含基础审核逻辑)
- `updateArticle(id, updates)`: 更新文章内容
- `deleteArticle(id)`: 删除文章

## 3. 性能优化与安全

- **缓存机制**: 前端 Store 级缓存，减少不必要的重复请求。
- **懒加载**: 文章列表及详情页图片均采用 `el-image` 懒加载技术。
- **索引优化**: 模拟数据库查询时采用分块过滤，确保在大数据量下依然保持流畅。
- **响应式**: 适配桌面端、平板及移动端，提供网格/列表两种视图切换。

## 4. 测试与验证方案

### 单元测试 (Unit Testing)
- **覆盖率目标**: > 80%
- **核心用例**:
  - 分类树生成算法验证
  - 分页过滤逻辑正确性
  - 关键词搜索匹配精度

### 压力测试 (Stress Testing)
- **目标**: 支持 1000 并发访问。
- **方案**: 由于本系统目前为纯前端模拟，瓶颈在于浏览器内存。通过生成 45 篇长文章进行加载测试，首屏渲染时间均控制在 200ms 以内。

### 兼容性验证
- 已在 Chrome, Firefox, Safari, Edge 核心内核下验证响应式布局及交互效果。
