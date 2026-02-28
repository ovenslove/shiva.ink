<template>
  <div class="article-detail container">
    <el-breadcrumb separator="/" class="breadcrumb animate__animated animate__fadeIn">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/articles' }">文章</el-breadcrumb-item>
      <el-breadcrumb-item>文章详情</el-breadcrumb-item>
    </el-breadcrumb>

    <div v-if="article" class="article-layout">
      <main class="main-content animate__animated animate__fadeInUp">
        <header class="article-header">
          <h1 class="article-title">{{ article.title }}</h1>
          <div class="article-meta">
            <span class="meta-item"><el-icon><User /></el-icon> {{ article.author }}</span>
            <span class="meta-item"><el-icon><Calendar /></el-icon> {{ article.publishTime }}</span>
            <span class="meta-item"><el-icon><View /></el-icon> {{ article.readCount }}</span>
            <span class="meta-item"><el-icon><Star /></el-icon> {{ article.likeCount }}</span>
          </div>
          <div class="article-tags">
            <el-tag v-for="tag in article.tags" :key="tag" size="small" round effect="plain">{{ tag }}</el-tag>
          </div>
        </header>

        <div class="article-images">
          <el-image 
            v-for="(img, index) in article.images" 
            :key="index" 
            :src="img" 
            lazy 
            fit="cover" 
            class="article-img"
            :preview-src-list="article.images"
            :initial-index="index"
          />
        </div>

        <div class="article-content" v-html="formattedContent"></div>

        <div class="article-actions">
          <el-button 
            type="primary" 
            circle 
            :plain="!isLiked"
            @click="toggleLike"
            class="action-btn"
          >
            <el-icon><Star /></el-icon>
            <span class="count">{{ article.likeCount }}</span>
          </el-button>
          <el-button type="success" circle plain class="action-btn">
            <el-icon><Share /></el-icon>
          </el-button>
        </div>
      </main>

      <aside class="sidebar animate__animated animate__fadeInRight">
        <el-card class="related-card cute-card">
          <template #header>
            <div class="card-header">
              <span>相关文章</span>
            </div>
          </template>
          <div class="related-list">
            <div 
              v-for="rel in relatedArticles" 
              :key="rel.id" 
              class="related-item"
              @click="goToDetail(rel.id)"
            >
              <el-image :src="rel.images[0]" class="rel-image" fit="cover" lazy />
              <div class="rel-info">
                <h4 class="rel-title">{{ rel.title }}</h4>
                <span class="rel-date">{{ rel.publishTime }}</span>
              </div>
            </div>
          </div>
        </el-card>

        <el-card class="author-card cute-card">
          <div class="author-info">
            <el-avatar :size="80" :src="userStore.avatar" />
            <h3 class="author-name">{{ article.author }}</h3>
            <p class="author-bio">{{ userStore.signature }}</p>
          </div>
        </el-card>
      </aside>
    </div>

    <el-empty v-else description="文章加载中或不存在..." />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaStore, useUserStore, Article } from '../store'
import { User, Calendar, View, Star, Share } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const mediaStore = useMediaStore()
const userStore = useUserStore()

const article = ref<Article | null>(null)
const isLiked = ref(false)

const formattedContent = computed(() => {
  if (!article.value) return ''
  // 模拟将换行符转换为 HTML 段落
  return article.value.content.split('\n').map(p => `<p>${p}</p>`).join('')
})

const relatedArticles = computed(() => {
  if (!article.value) return []
  return mediaStore.articles
    .filter(a => a.id !== article.value?.id && a.categoryIds.some(id => article.value?.categoryIds.includes(id)))
    .slice(0, 5)
})

const loadArticle = () => {
  const id = route.params.id as string
  const found = mediaStore.articles.find(a => a.id === id)
  if (found) {
    article.value = found
    // 模拟增加阅读量
    found.readCount++
  }
}

const toggleLike = () => {
  if (!article.value) return
  if (!isLiked.value) {
    article.value.likeCount++
    isLiked.value = true
  } else {
    article.value.likeCount--
    isLiked.value = false
  }
}

const goToDetail = (id: string) => {
  router.push(`/article/${id}`)
}

onMounted(() => {
  loadArticle()
})

watch(() => route.params.id, () => {
  loadArticle()
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.article-detail {
  padding-top: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.article-layout {
  display: flex;
  gap: 30px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
}

.main-content {
  flex: 1;
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  @media (max-width: 576px) {
    padding: 20px;
  }
}

.article-header {
  margin-bottom: 30px;
  .article-title {
    font-size: 32px;
    margin-bottom: 20px;
    color: $color-text;
    line-height: 1.4;
  }
  .article-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    color: #999;
    font-size: 14px;
    margin-bottom: 15px;
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
  .article-tags {
    display: flex;
    gap: 8px;
  }
}

.article-images {
  margin-bottom: 30px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .article-img {
    width: 100%;
    border-radius: 12px;
    cursor: zoom-in;
  }
}

.article-content {
  font-size: 17px;
  line-height: 1.8;
  color: #444;
  margin-bottom: 40px;
  :deep(p) {
    margin-bottom: 1.5em;
  }
}

.article-actions {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  .action-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    height: auto;
    .count {
      font-size: 16px;
    }
  }
}

.sidebar {
  width: 320px;
  flex-shrink: 0;
  @media (max-width: 992px) {
    width: 100%;
  }
}

.related-card {
  margin-bottom: 20px;
  .related-item {
    display: flex;
    gap: 12px;
    margin-bottom: 15px;
    cursor: pointer;
    &:last-child { margin-bottom: 0; }
    &:hover .rel-title { color: $color-primary; }
    .rel-image {
      width: 80px;
      height: 60px;
      border-radius: 6px;
      flex-shrink: 0;
    }
    .rel-info {
      flex: 1;
      .rel-title {
        font-size: 14px;
        line-height: 1.4;
        margin-bottom: 4px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      .rel-date {
        font-size: 12px;
        color: #999;
      }
    }
  }
}

.author-card {
  .author-info {
    text-align: center;
    padding: 20px 0;
    .author-name {
      font-size: 20px;
      margin: 15px 0 10px;
    }
    .author-bio {
      color: #888;
      font-size: 14px;
    }
  }
}

.cute-card {
  border-radius: 20px;
  border: 1px solid rgba(255, 182, 193, 0.2);
}
</style>
