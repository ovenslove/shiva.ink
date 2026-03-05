<template>
  <div class="content-detail-view container">
    <div class="breadcrumb-wrapper animate__animated animate__fadeIn">
      <el-breadcrumb separator-icon="ArrowRight" class="custom-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/column' }">专栏</el-breadcrumb-item>
        <el-breadcrumb-item class="current-title">{{ item?.title || '详情' }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div v-if="item" class="detail-container animate__animated animate__fadeInUp">
      <!-- 封面图 (如果有) -->
      <div v-if="item.cover" class="detail-cover">
        <el-image :src="item.cover" fit="cover" />
      </div>

      <header class="detail-header">
        <div class="type-badge" :class="item.type">
          {{ item.type === 'blog' ? '博客文章' : '见闻感悟' }}
        </div>
        <h1 class="detail-title">{{ item.title }}</h1>
        
        <div class="detail-meta">
          <span class="meta-item author"><el-icon><User /></el-icon> {{ item.author }}</span>
          <span class="meta-item date"><el-icon><Calendar /></el-icon> {{ dayjs(item.date).format('YYYY-MM-DD') }}</span>
          <span class="meta-item views"><el-icon><View /></el-icon> {{ item.stats.views }} 阅读</span>
        </div>

        <div class="detail-tags">
          <el-tag 
            v-for="cat in item.categories" 
            :key="cat" 
            size="small" 
            effect="dark"
            class="tag-item"
          >
            {{ cat }}
          </el-tag>
          <el-tag 
            v-for="tag in item.tags" 
            :key="tag" 
            size="small" 
            type="warning"
            round
            class="tag-item"
          >
            # {{ tag }}
          </el-tag>
        </div>
      </header>

      <!-- 内容渲染 -->
      <div 
        v-if="item.type === 'blog'" 
        class="detail-content markdown-body" 
        v-html="item.html"
      ></div>
      
      <div v-else class="detail-content legacy-body">
        <p v-for="(p, index) in formattedContent" :key="index">{{ p }}</p>
        
        <div v-if="item.images && item.images.length > 0" class="content-images">
          <el-image 
            v-for="(img, idx) in item.images" 
            :key="idx" 
            :src="img" 
            fit="cover" 
            :preview-src-list="item.images"
            lazy
          />
        </div>
      </div>
      
      <footer class="detail-footer">
        <div class="actions">
          <el-button @click="handleLike" :type="isLiked ? 'danger' : 'default'" round>
            <el-icon><Star /></el-icon> {{ isLiked ? '已点赞' : '点赞' }} ({{ item.stats.likes }})
          </el-button>
          <el-button @click="router.back()" type="primary" plain round>返回列表</el-button>
        </div>
      </footer>
    </div>

    <div v-else-if="!contentStore.isLoading" class="not-found">
      <el-empty description="内容未找到或已下线" />
      <el-button @click="router.push('/column')" type="primary" round>返回专栏首页</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { useContentStore } from '../store/content'
import { User, Calendar, View, Star, ArrowRight } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const contentStore = useContentStore()

const isLiked = ref(false)

// 获取 ID 并解码 (如果是 blog)
const itemId = computed(() => {
  const id = route.params.id as string
  // 如果当前路由是 /blog/:id，说明需要解码
  return route.path.startsWith('/blog') ? decodeURIComponent(id) : id
})

const item = computed(() => contentStore.getContentById(itemId.value))

// 对非 Markdown 内容进行简单格式化 (按换行拆分)
const formattedContent = computed(() => {
  if (!item.value || item.value.type !== 'article') return []
  return item.value.content.split('\n').filter(p => p.trim())
})

const handleLike = () => {
  if (!isLiked.value && item.value) {
    item.value.stats.likes++
    isLiked.value = true
  }
}

onMounted(async () => {
  if (contentStore.items.length === 0) {
    await contentStore.initContent()
  }
})

// 监听 ID 变化
watch(() => route.params.id, async () => {
  if (contentStore.items.length === 0) {
    await contentStore.initContent()
  }
})
</script>

<style lang="scss">
@use "../styles/variables.scss" as *;

.content-detail-view {
  padding: 20px 20px 60px;
}

.breadcrumb-wrapper {
  max-width: 900px;
  margin: 0 auto 20px;
  padding: 0 10px;

  .custom-breadcrumb {
    font-size: 14px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(10px);
    padding: 12px 20px;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
    display: inline-flex;
    align-items: center;

    .el-breadcrumb__item {
      display: flex;
      align-items: center;
      
      .el-breadcrumb__inner {
        color: #888;
        transition: color 0.3s;
        
        &:hover {
          color: $color-primary;
        }
        
        &.is-link {
          font-weight: 500;
        }
      }

      &.current-title {
        .el-breadcrumb__inner {
          color: #333;
          font-weight: 600;
          max-width: 300px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }

    .el-breadcrumb__separator {
      color: #ccc;
      margin: 0 8px;
    }
  }
}

.detail-container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  padding: 0;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.detail-cover {
  width: 100%;
  height: 400px;
  .el-image {
    width: 100%;
    height: 100%;
  }
}

.detail-header {
  padding: 40px 40px 20px;
  text-align: center;
  
  .type-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    color: white;
    margin-bottom: 20px;
    
    &.blog { background-color: $color-primary; }
    &.article { background-color: $color-secondary; }
  }
  
  .detail-title {
    font-size: 36px;
    margin-bottom: 25px;
    color: #333;
    line-height: 1.3;
  }
  
  .detail-meta {
    display: flex;
    justify-content: center;
    gap: 30px;
    color: #999;
    font-size: 15px;
    margin-bottom: 25px;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
  }
  
  .detail-tags {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }
}

.detail-content {
  padding: 40px 60px 60px;
  line-height: 1.8;
  color: #2c3e50;
  font-size: 18px;
  letter-spacing: 0.02em;
  
  &.markdown-body {
    // 借用之前定义的 markdown 样式并进行增强
    h1, h2, h3, h4, h5, h6 {
      color: #1a1a1a;
      margin-top: 1.5em;
      margin-bottom: 0.8em;
      font-weight: 700;
    }

    h1 { font-size: 2.2em; }
    h2 {
      font-size: 1.8em;
      border-bottom: 2px solid rgba($color-primary, 0.15);
      padding-bottom: 12px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 60px;
        height: 2px;
        background: $color-primary;
      }
    }
    
    h3 { font-size: 1.4em; }

    p {
      margin-bottom: 1.6em;
      text-align: justify;
    }

    ul, ol {
      padding-left: 1.5em;
      margin-bottom: 1.6em;
      li { margin-bottom: 0.5em; }
    }

    blockquote {
      background: rgba($color-primary, 0.05);
      padding: 20px 25px;
      border-left: 4px solid $color-primary;
      border-radius: 4px 12px 12px 4px;
      color: #555;
      font-style: italic;
      margin: 2em 0;
    }
    
    pre {
      background-color: #282c34;
      color: #abb2bf;
      padding: 24px;
      border-radius: 16px;
      margin: 30px 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
      font-size: 15px;
      overflow-x: auto;
      
      code {
        background: transparent;
        padding: 0;
        color: inherit;
        font-family: 'Fira Code', 'Consolas', monospace;
      }
    }

    img {
      display: block;
      margin: 2em auto;
      max-width: 90%;
      border-radius: 16px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    }
  }
  
  &.legacy-body {
    p {
      margin-bottom: 25px;
      text-indent: 2em;
    }
    
    .content-images {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 30px;
      
      .el-image {
        border-radius: 16px;
        cursor: pointer;
        transition: transform 0.3s;
        &:hover { transform: scale(1.02); }
      }
    }
  }
}

.detail-footer {
  padding: 40px;
  border-top: 1px solid #f0f0f0;
  text-align: center;
  
  .actions {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .content-detail-view { padding: 10px 10px 40px; }
  .breadcrumb-wrapper { margin-bottom: 10px; padding: 0 5px; }
  .custom-breadcrumb { 
    padding: 10px 15px; 
    .current-title { display: none; } // 移动端隐藏过长的当前标题
  }
  
  .detail-container { border-radius: 16px; }
  .detail-cover { height: 200px; }
  .detail-header {
    padding: 30px 20px 10px;
    .detail-title { font-size: 24px; }
    .detail-meta { flex-direction: column; gap: 10px; align-items: center; font-size: 13px; }
  }
  .detail-content { 
    padding: 20px 20px 40px; 
    font-size: 16px; 
    
    &.markdown-body {
      h1 { font-size: 1.8em; }
      h2 { font-size: 1.5em; }
      pre { padding: 15px; border-radius: 12px; }
      blockquote { padding: 15px; }
    }
  }
}
</style>
