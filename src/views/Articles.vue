<template>
  <div class="articles-view container">
    <el-breadcrumb separator="/" class="breadcrumb animate__animated animate__fadeIn">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>文章</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="articles-header animate__animated animate__fadeIn">
      <h1 class="section-title">见闻与感悟</h1>
      <p class="subtitle">记录生活点滴，分享学习心得 ✨</p>
    </div>

    <div class="articles-layout">
      <!-- 侧边分类导航 -->
      <aside class="sidebar animate__animated animate__fadeInLeft">
        <el-card class="category-card cute-card">
          <template #header>
            <div class="card-header">
              <span>文章分类</span>
            </div>
          </template>
          <el-tree
            :data="mediaStore.categoryTree"
            :props="{ label: 'name', children: 'children' }"
            @node-click="handleCategoryClick"
            highlight-current
            node-key="id"
            :default-expanded-keys="['1', '2', '3']"
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
              v-for="tag in mediaStore.allArticleTags"
              :key="tag"
              class="tag-item"
              round
              effect="plain"
              @click="handleTagClick(tag)"
            >
              {{ tag }}
            </el-tag>
          </div>
        </el-card>
      </aside>

      <!-- 文章列表区域 -->
      <main class="main-content animate__animated animate__fadeInRight">
        <div class="filter-bar">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索文章标题或内容..."
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

        <div v-loading="loading" class="list-container">
          <el-row v-if="viewMode === 'grid'" :gutter="20">
            <el-col
              v-for="article in articleList"
              :key="article.id"
              :xs="24"
              :sm="12"
              class="article-col"
            >
              <el-card 
                class="article-grid-card cute-card" 
                :body-style="{ padding: '0px' }"
                @click="goToDetail(article.id)"
              >
                <div class="card-image">
                  <el-image :src="article.images[0]" fit="cover" lazy />
                  <div class="card-date">{{ article.publishTime }}</div>
                </div>
                <div class="card-content">
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ article.content.substring(0, 60) }}...</p>
                  <div class="card-footer">
                    <span class="meta"><el-icon><View /></el-icon> {{ article.readCount }}</span>
                    <span class="meta"><el-icon><Star /></el-icon> {{ article.likeCount }}</span>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <div v-else class="article-list-container">
            <div
              v-for="article in articleList"
              :key="article.id"
              class="article-list-item cute-card"
              @click="goToDetail(article.id)"
            >
              <el-image :src="article.images[0]" class="list-image" fit="cover" lazy />
              <div class="list-content">
                <h3 class="article-title">{{ article.title }}</h3>
                <p class="article-excerpt">{{ article.content.substring(0, 100) }}...</p>
                <div class="list-footer">
                  <span class="date">{{ article.publishTime }}</span>
                  <div class="metas">
                    <span class="meta"><el-icon><View /></el-icon> {{ article.readCount }}</span>
                    <span class="meta"><el-icon><Star /></el-icon> {{ article.likeCount }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :total="total"
            layout="prev, pager, next"
            class="pagination"
            @current-change="loadData"
          />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMediaStore, Article } from '../store'
import { Search, Grid, List, View, Star } from '@element-plus/icons-vue'

const router = useRouter()
const mediaStore = useMediaStore()

const loading = ref(false)
const viewMode = ref<'grid' | 'list'>('grid')
const searchKeyword = ref('')
const selectedCategoryId = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const articleList = ref<Article[]>([])

const loadData = async () => {
  loading.value = true
  const result = await mediaStore.fetchArticles({
    page: currentPage.value,
    pageSize: pageSize.value,
    keyword: searchKeyword.value,
    categoryId: selectedCategoryId.value
  })
  articleList.value = result.list
  total.value = result.total
  loading.value = false
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

const handleCategoryClick = (node: any) => {
  selectedCategoryId.value = node.id
  currentPage.value = 1
  loadData()
}

const handleTagClick = (tag: string) => {
  searchKeyword.value = tag
  handleSearch()
}

const goToDetail = (id: string) => {
  router.push(`/article/${id}`)
}

onMounted(() => {
  loadData()
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.articles-view {
  padding-top: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.articles-header {
  text-align: center;
  margin-bottom: 40px;
  .section-title {
    font-size: 32px;
    color: $color-text;
    margin-bottom: 10px;
  }
  .subtitle {
    color: #888;
  }
}

.articles-layout {
  display: flex;
  gap: 30px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
}

.sidebar {
  width: 280px;
  flex-shrink: 0;
  @media (max-width: 992px) {
    width: 100%;
  }
  .category-card, .tags-card {
    margin-bottom: 20px;
  }
  .tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    .tag-item {
      cursor: pointer;
      &:hover {
        background-color: $color-primary;
        color: white;
      }
    }
  }
}

.main-content {
  flex: 1;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
  .search-input {
    max-width: 400px;
  }
}

.article-col {
  margin-bottom: 20px;
}

.article-grid-card {
  cursor: pointer;
  transition: transform 0.3s;
  &:hover {
    transform: translateY(-5px);
  }
  .card-image {
    position: relative;
    height: 180px;
    overflow: hidden;
    .el-image {
      width: 100%;
      height: 100%;
    }
    .card-date {
      position: absolute;
      bottom: 10px;
      right: 10px;
      background: rgba(0,0,0,0.5);
      color: white;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 12px;
    }
  }
  .card-content {
    padding: 15px;
    .article-title {
      font-size: 18px;
      margin-bottom: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .article-excerpt {
      font-size: 14px;
      color: #666;
      height: 40px;
      margin-bottom: 15px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card-footer {
      display: flex;
      gap: 15px;
      font-size: 13px;
      color: #999;
      .meta {
        display: flex;
        align-items: center;
        gap: 4px;
      }
    }
  }
}

.article-list-item {
  display: flex;
  gap: 20px;
  padding: 15px;
  margin-bottom: 20px;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #fdf5f6;
  }
  .list-image {
    width: 200px;
    height: 130px;
    border-radius: 8px;
    flex-shrink: 0;
    @media (max-width: 576px) {
      width: 100px;
      height: 80px;
    }
  }
  .list-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .article-title {
      font-size: 20px;
      margin-bottom: 8px;
    }
    .article-excerpt {
      font-size: 15px;
      color: #666;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .list-footer {
      display: flex;
      justify-content: space-between;
      color: #999;
      font-size: 13px;
    }
  }
}

.pagination {
  margin-top: 30px;
  justify-content: center;
}

.cute-card {
  border-radius: 16px;
  border: 1px solid rgba(255, 182, 193, 0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
</style>
