<template>
  <div class="column-view container">
    <el-breadcrumb separator="/" class="breadcrumb animate__animated animate__fadeIn">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>专栏管理</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="column-header animate__animated animate__fadeIn">
      <h1 class="section-title">{{ pageTitle }}</h1>
      <p class="subtitle">{{ pageSubtitle }} ✨</p>
      
      <!-- 内容类型快速切换 -->
      <div class="type-filter">
        <el-radio-group v-model="selectedType" size="large" @change="handleTypeChange">
          <el-radio-button label="">全部 ({{ contentStore.items.length }})</el-radio-button>
          <el-radio-button label="blog">博客 ({{ contentStore.items.filter(i => i.type === 'blog').length }})</el-radio-button>
          <el-radio-button label="article">文章 ({{ contentStore.items.filter(i => i.type === 'article').length }})</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <div class="column-layout">
      <!-- 移动端悬浮按钮 -->
      <div class="mobile-filter-trigger" @click="isDrawerOpen = true">
        <el-icon><Operation /></el-icon>
        <span>筛选</span>
      </div>

      <!-- 移动端侧边栏 -->
      <el-drawer
        v-model="isDrawerOpen"
        title="内容筛选"
        direction="ltr"
        size="280px"
        class="mobile-sidebar-drawer"
      >
        <div class="sidebar drawer-content">
          <el-card class="category-card cute-card no-border">
            <template #header>
              <div class="card-header">
                <span>内容分类</span>
              </div>
            </template>
            <el-tree
              :data="contentStore.categoryTree"
              :props="{ label: 'name', children: 'children' }"
              @node-click="handleCategoryClick"
              highlight-current
              node-key="id"
              default-expand-all
            />
          </el-card>

          <el-card class="tags-card cute-card no-border">
            <template #header>
              <div class="card-header">
                <span>热门标签</span>
              </div>
            </template>
            <div class="tags-cloud">
              <el-tag
                v-for="tag in contentStore.allTags"
                :key="tag"
                class="tag-item"
                :type="selectedTag === tag ? 'danger' : 'info'"
                round
                effect="plain"
                @click="handleTagClick(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-card>
        </div>
      </el-drawer>

      <!-- 桌面端侧边栏：统一分类与标签 -->
      <aside class="sidebar desktop-sidebar animate__animated animate__fadeInLeft">
        <el-card class="category-card cute-card">
          <template #header>
            <div class="card-header">
              <span>内容分类</span>
            </div>
          </template>
          <el-tree
            :data="contentStore.categoryTree"
            :props="{ label: 'name', children: 'children' }"
            @node-click="handleCategoryClick"
            highlight-current
            node-key="id"
            default-expand-all
          />
        </el-card>

        <el-card class="tags-card cute-card">
          <template #header>
            <div class="card-header">
              <span>热门标签</span>
            </div>
          </template>
          <div class="tags-cloud">
            <el-tag
              v-for="tag in contentStore.allTags"
              :key="tag"
              class="tag-item"
              :type="selectedTag === tag ? 'danger' : 'info'"
              round
              effect="plain"
              @click="handleTagClick(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-card>
      </aside>

      <!-- 主内容区域 -->
      <main class="main-content animate__animated animate__fadeInRight">
        <div class="filter-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索标题、摘要或内容..."
            class="search-input"
            :prefix-icon="Search"
            clearable
            @input="handleSearch"
          />
          <div class="view-switch">
            <el-radio-group v-model="viewMode" size="small">
              <el-radio-button label="grid">
                <el-icon><Grid /></el-icon>
              </el-radio-button>
              <el-radio-button label="list">
                <el-icon><List /></el-icon>
              </el-radio-button>
            </el-radio-group>
          </div>
        </div>

        <div v-loading="contentStore.isLoading" class="list-container">
          <el-empty v-if="filteredItems.length === 0" description="没有找到匹配的内容" />
          
          <el-row v-if="viewMode === 'grid'" :gutter="16" class="content-grid-row">
            <el-col
              v-for="item in pagedItems"
              :key="item.id"
              :xs="24"
              :sm="12"
              :md="12"
              :lg="8"
              class="content-col"
            >
              <el-card 
                class="content-grid-card cute-card" 
                :body-style="{ padding: '0px' }"
                @click="goToDetail(item)"
              >
                <div class="card-image">
                  <el-image :src="item.cover || 'https://picsum.photos/id/10/800/600'" fit="cover" lazy />
                  <div class="card-badge" :class="item.type">{{ item.type === 'blog' ? '博客' : '文章' }}</div>
                  <div class="card-date">{{ dayjs(item.date).format('YYYY-MM-DD') }}</div>
                </div>
                <div class="card-content">
                  <h3 class="content-title">{{ item.title }}</h3>
                  <p class="content-excerpt">{{ item.summary }}</p>
                  <div class="card-footer">
                    <div class="categories">
                      <el-tag v-for="cat in item.categories.slice(0, 2)" :key="cat" size="small" effect="plain">{{ cat }}</el-tag>
                    </div>
                    <div class="stats">
                      <span><el-icon><View /></el-icon> {{ item.stats.views }}</span>
                      <span><el-icon><Star /></el-icon> {{ item.stats.likes }}</span>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <div v-else class="content-list-container">
            <div
              v-for="item in pagedItems"
              :key="item.id"
              class="content-list-item cute-card"
              @click="goToDetail(item)"
            >
              <el-image :src="item.cover || 'https://picsum.photos/id/10/800/600'" class="list-image" fit="cover" lazy />
              <div class="list-content">
                <div class="list-header">
                  <h3 class="content-title">{{ item.title }}</h3>
                  <el-tag size="small" :class="item.type" effect="dark">{{ item.type === 'blog' ? '博客' : '文章' }}</el-tag>
                </div>
                <p class="content-excerpt">{{ item.summary }}</p>
                <div class="list-footer">
                  <div class="meta-left">
                    <span class="date">{{ dayjs(item.date).format('YYYY-MM-DD') }}</span>
                    <span class="author">By {{ item.author }}</span>
                  </div>
                  <div class="meta-right">
                    <span class="meta"><el-icon><View /></el-icon> {{ item.stats.views }}</span>
                    <span class="meta"><el-icon><Star /></el-icon> {{ item.stats.likes }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-pagination
            v-if="filteredItems.length > 0"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="filteredItems.length"
            :page-sizes="[10, 20, 50]"
            layout="prev, pager, next"
            class="pagination"
            background
            @size-change="handleSizeChange"
            @current-change="handlePageChange"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import dayjs from 'dayjs'
import { useContentStore } from '../store/content'
import { ContentItem } from '../types/content'
import { Search, Grid, List, View, Star, Operation } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const contentStore = useContentStore()

// 状态
const viewMode = ref<'grid' | 'list'>('grid')
const searchKeyword = ref('')
const selectedCategoryId = ref('')
const selectedTag = ref('')
const selectedType = ref<string>((route.query.type as string) || '')
const currentPage = ref(1)
const pageSize = ref(10)
const isDrawerOpen = ref(false)

// 页面标题
const pageTitle = computed(() => {
  if (selectedType.value === 'blog') return '博客文库'
  if (selectedType.value === 'article') return '见闻感悟'
  return '专栏精选'
})

const pageSubtitle = computed(() => {
  if (selectedType.value === 'blog') return '基于 Markdown 的自动化解析系统'
  if (selectedType.value === 'article') return '记录生活点滴，分享学习心得'
  return '统一的内容管理与展示系统'
})

// 过滤后的数据
const filteredItems = computed(() => {
  return contentStore.filterItems({
    keyword: searchKeyword.value,
    categoryId: selectedCategoryId.value,
    type: selectedType.value,
    tag: selectedTag.value
  })
})

// 分页后的数据
const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredItems.value.slice(start, start + pageSize.value)
})

// 事件处理
const handleSearch = () => {
  currentPage.value = 1
}

const handleTypeChange = (val: string) => {
  selectedType.value = val
  currentPage.value = 1
  router.replace({ query: { ...route.query, type: val || undefined } })
}

const handleCategoryClick = (node: any) => {
  selectedCategoryId.value = node.id
  currentPage.value = 1
  isDrawerOpen.value = false // 移动端点击后自动关闭
  localStorage.setItem('shiva_column_last_category', node.id)
}

const handleTagClick = (tag: string) => {
  selectedTag.value = selectedTag.value === tag ? '' : tag
  currentPage.value = 1
  isDrawerOpen.value = false // 移动端点击后自动关闭
  localStorage.setItem('shiva_column_last_tag', selectedTag.value)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const goToDetail = (item: ContentItem) => {
  // 保持原有链接逻辑：blog 使用编码路径，article 使用 id
  if (item.type === 'blog') {
    router.push(`/blog/${encodeURIComponent(item.id)}`)
  } else {
    router.push(`/article/${item.id}`)
  }
}

onMounted(async () => {
  await contentStore.initContent()
  // 根据本地存储恢复状态
  const lastCategory = localStorage.getItem('shiva_column_last_category')
  const lastTag = localStorage.getItem('shiva_column_last_tag')
  if (lastCategory) selectedCategoryId.value = lastCategory
  if (lastTag) selectedTag.value = lastTag

  // 根据路由 query 初始化 (优先级更高)
  if (route.query.category) selectedCategoryId.value = route.query.category as string
  if (route.query.tag) selectedTag.value = route.query.tag as string
})

// 监听路由变化，同步类型过滤
watch(() => route.query.type, (newType) => {
  selectedType.value = (newType as string) || ''
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.column-view {
  padding: 2.5rem 1.5rem;
  
  @media (max-width: 375px) {
    padding: 2.5rem 1rem;
  }
}

.breadcrumb {
  margin-bottom: 1.875rem;
}

.column-header {
  text-align: center;
  margin-bottom: 3.125rem;
  
  .section-title {
    font-size: 2.25rem;
    margin-bottom: 0.9375rem;
    background: linear-gradient(45deg, $color-primary, $color-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    
    @media (max-width: 768px) {
      font-size: 1.75rem;
    }
  }
  
  .subtitle {
    color: #666;
    font-size: 1.125rem;
    margin-bottom: 1.875rem;
    
    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }
}

.type-filter {
  margin-top: 1.25rem;
}

.column-layout {
  display: grid;
  grid-template-columns: 17.5rem 1fr;
  gap: 1.875rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.mobile-filter-trigger {
  display: none;
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: $color-primary;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  box-shadow: 0 4px 12px rgba($color-primary, 0.4);
  z-index: 100;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;

  &:active {
    transform: translateX(-50%) scale(0.9);
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

.desktop-sidebar {
  @media (max-width: 768px) {
    display: none !important; // 强制隐藏，防止被 .sidebar 的 media query 覆盖
  }
}

.mobile-sidebar-drawer {
  :deep(.el-drawer__body) {
    padding: 0;
    background: #fdfdfd;
  }
  
  .drawer-content {
    height: 100%;
    overflow-y: auto;
    padding: 1rem;
    
    .cute-card.no-border {
      border: none;
      box-shadow: none;
      margin-bottom: 0.5rem;
      background: transparent;
      
      :deep(.el-card__header) {
        border-bottom: 1px solid #f5f5f5;
        padding: 1rem 0;
      }
      
      :deep(.el-card__body) {
        padding: 1rem 0;
      }
    }
  }
}

.sidebar {
  .cute-card {
    margin-bottom: 1.25rem;
    border-radius: 1rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-0.3125rem);
      box-shadow: 0 0.625rem 1.25rem rgba(0,0,0,0.05);
    }
  }
  
  .card-header {
    font-weight: bold;
    color: $color-primary;
  }
  
  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
}

.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  
  .tag-item {
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover {
      transform: scale(1.1);
    }
  }
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.875rem;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 18.75rem;
    
    @media (max-width: 768px) {
      width: 100%;
    }
    
    :deep(.el-input__wrapper) {
      border-radius: 1.25rem;
    }
  }
  
  .view-switch {
    @media (max-width: 768px) {
      display: flex;
      justify-content: flex-end;
    }
  }
}

.list-container {
  overflow: hidden; // 关键：防止 el-row 的负 margin 导致横向滚动条
}

.content-grid-row {
  margin-bottom: -1rem; // 抵消下方 col 的 margin
}

.content-col {
  margin-bottom: 1.5rem; // 增加纵向间距，解决卡片紧贴问题
}

.content-grid-card {
  margin-bottom: 0; // 移除原有的 card margin，改用 col 控制
  cursor: pointer;
  border-radius: 1.25rem;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
  
  .card-image {
    position: relative;
    height: 12.5rem;
    overflow: hidden;
    
    .el-image {
      width: 100%;
      height: 100%;
      transition: transform 0.5s ease;
    }
    
    .card-badge {
      position: absolute;
      top: 0.9375rem;
      left: 0.9375rem;
      padding: 0.25rem 0.75rem;
      border-radius: 1.25rem;
      font-size: 0.75rem;
      color: white;
      backdrop-filter: blur(0.25rem);
      z-index: 1;
      
      &.blog { background: rgba($color-primary, 0.8); }
      &.article { background: rgba($color-secondary, 0.8); }
    }
    
    .card-date {
      position: absolute;
      bottom: 0.9375rem;
      right: 0.9375rem;
      color: white;
      font-size: 0.75rem;
      background: rgba(0,0,0,0.3);
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      backdrop-filter: blur(0.25rem);
    }
  }
  
  &:hover .el-image {
    transform: scale(1.1);
  }
  
  .card-content {
    padding: 1.25rem;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    
    .content-title {
      font-size: 1.125rem;
      margin-bottom: 0.625rem;
      color: #333;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .content-excerpt {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.9375rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex-grow: 1;
    }
    
    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 0.9375rem;
      border-top: 0.0625rem dashed #eee;
      
      .categories {
        display: flex;
        gap: 0.3125rem;
      }
      
      .stats {
        font-size: 0.75rem;
        color: #999;
        display: flex;
        gap: 0.625rem;
        
        span {
          display: flex;
          align-items: center;
          gap: 0.1875rem;
        }
      }
    }
  }
}

.content-list-item {
  display: flex;
  margin-bottom: 1.25rem;
  cursor: pointer;
  padding: 0.9375rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  &:hover {
    transform: translateX(0.625rem);
    box-shadow: 0 0.3125rem 0.9375rem rgba(0,0,0,0.05);
    
    @media (max-width: 768px) {
      transform: translateY(-0.3125rem);
    }
  }
  
  .list-image {
    width: 15rem;
    height: 9.375rem;
    border-radius: 0.75rem;
    margin-right: 1.25rem;
    flex-shrink: 0;
    
    @media (max-width: 768px) {
      width: 100%;
      height: 12.5rem;
      margin-right: 0;
      margin-bottom: 0.9375rem;
    }
  }
  
  .list-content {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.625rem;
      
      .content-title {
        font-size: 1.25rem;
        color: #333;
        
        @media (max-width: 768px) {
          font-size: 1.125rem;
        }
      }

      .el-tag.blog { background-color: $color-primary; border-color: $color-primary; }
      .el-tag.article { background-color: $color-secondary; border-color: $color-secondary; }
    }
    
    .content-excerpt {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.9375rem;
      line-height: 1.6;
    }
    
    .list-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
      color: #999;
      
      .meta-left {
        display: flex;
        gap: 1.25rem;
      }
      
      .meta-right {
        display: flex;
        gap: 0.9375rem;
        
        .meta {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
      }
    }
  }
}

.pagination {
  margin-top: 2.5rem;
  display: flex;
  justify-content: center;
  padding-bottom: 2rem;

  :deep(.el-pagination) {
    --el-pagination-button-bg-color: #fff;
    --el-pagination-hover-color: #{$color-primary};
    
    // 增加按钮点击区域以符合移动端规范 (44x44px)
    .el-pager li, 
    .btn-prev, 
    .btn-next {
      min-width: 2.75rem; // 44px
      height: 2.75rem;    // 44px
      line-height: 2.75rem;
      font-size: 1rem;
      border-radius: 0.5rem;
      margin: 0 0.25rem;
    }

    .el-pager li.is-active {
      background-color: $color-primary !important;
      color: #fff !important;
    }

    // 移动端响应式换行
    @media (max-width: 768px) {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;

      // 第一行：页码和翻页按钮
      .el-pager,
      .btn-prev,
      .btn-next {
        order: 1;
      }

      // 第二行：总数和每页条数选择器
      .el-pagination__total,
      .el-pagination__sizes {
        order: 2;
        margin: 0 0.5rem;
      }

      // 强制换行效果
      &::after {
        content: "";
        width: 100%;
        order: 1;
      }
      
      .el-pagination__total {
        margin-left: 0;
      }
    }

    // 针对极窄屏幕进一步优化
    @media (max-width: 480px) {
      .el-pager li {
        min-width: 2.25rem; // 36px (折中处理)
        height: 2.25rem;
        line-height: 2.25rem;
      }
      
      .el-pagination__sizes {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 0.5rem;
      }
    }
  }
}
</style>
