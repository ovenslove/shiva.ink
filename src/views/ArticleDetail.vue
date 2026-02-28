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
            @click="openGallery(index)"
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
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMediaStore, useUserStore, Article } from '../store'
import { User, Calendar, View, Star, Share } from '@element-plus/icons-vue'
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

const route = useRoute()
const router = useRouter()
const mediaStore = useMediaStore()
const userStore = useUserStore()

const article = ref<Article | null>(null)
const isLiked = ref(false)
let lightbox: PhotoSwipeLightbox | null = null

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

const parseImageDimensions = (url: string) => {
  // 尝试从 Picsum URL 解析宽高 (e.g. .../800/600)
  const matches = url.match(/\/(\d+)\/(\d+)$/)
  if (matches) {
    return { w: parseInt(matches[1]), h: parseInt(matches[2]) }
  }
  // 默认值
  return { w: 1200, h: 800 }
}

const openGallery = (index: number) => {
  if (!article.value || !article.value.images) return

  const dataSource = article.value.images.map(img => {
    const dims = parseImageDimensions(img)
    return {
      src: img,
      width: dims.w,
      height: dims.h
    }
  })

  lightbox = new PhotoSwipeLightbox({
    dataSource,
    pswpModule: () => import('photoswipe'),
    index,
    bgOpacity: 0.9,
    showHideAnimationType: 'zoom',
    zoom: true,
    
    // 自定义缩放范围
    maxZoomLevel: 3, 
    secondaryZoomLevel: 2,
    
    // PhotoSwipe 5 API 差异：使用 width/height 而不是 w/h
    // 并且通过 wheelToZoom 来控制滚轮缩放
    wheelToZoom: true,
    
    // 禁止拖动：PhotoSwipe 默认行为是 scale=1 时拖动切换，scale>1 拖动平移。
    // 这符合“禁止随意拖动，仅允许缩放”的要求（即非放大状态下不能随意拖动位置，只能切换）
  })
  
  // 注册底部缩略图 UI
  lightbox.on('uiRegister', () => {
    lightbox!.pswp!.ui!.registerElement({
      name: 'custom-thumbnails',
      order: 9,
      isButton: false,
      tagName: 'div',
      className: 'pswp__thumbnails-container',
      html: '',
      onInit: (el, pswp) => {
        const images = article.value?.images || []
        const thumbnailsHtml = images.map((img, idx) => `
          <div class="pswp__thumbnail-item" data-index="${idx}" role="button" aria-label="查看第 ${idx + 1} 张图片">
            <img src="${img}" loading="lazy" />
          </div>
        `).join('')
        
        el.innerHTML = `<div class="pswp__thumbnails-wrapper">${thumbnailsHtml}</div>`
        
        const wrapper = el.querySelector('.pswp__thumbnails-wrapper')
        wrapper?.addEventListener('click', (e) => {
          const target = (e.target as HTMLElement).closest('.pswp__thumbnail-item')
          if (target) {
            const index = parseInt(target.getAttribute('data-index') || '0')
            pswp.goTo(index)
          }
        })
        
        const updateActiveThumbnail = () => {
          const currIndex = pswp.currIndex
          const items = el.querySelectorAll('.pswp__thumbnail-item')
          const wrapper = el.querySelector('.pswp__thumbnails-wrapper')
          
          if (!wrapper) return

          items.forEach((item, idx) => {
            if (idx === currIndex) {
              item.classList.add('is-active')
              
              // 使用手动计算 scrollLeft 替代 scrollIntoView，避免触发全局布局偏移
              const itemEl = item as HTMLElement
              const wrapperEl = wrapper as HTMLElement
              const wrapperRect = wrapperEl.getBoundingClientRect()
              const itemRect = itemEl.getBoundingClientRect()
              
              // 计算目标滚动位置：使当前项居中
              const targetScrollLeft = wrapperEl.scrollLeft + (itemRect.left - wrapperRect.left) - (wrapperRect.width / 2) + (itemRect.width / 2)
              
              wrapperEl.scrollTo({
                left: targetScrollLeft,
                behavior: 'smooth'
              })
            } else {
              item.classList.remove('is-active')
            }
          })
        }
        
        pswp.on('change', updateActiveThumbnail)
        // 初始高亮
        pswp.on('firstUpdate', updateActiveThumbnail)
      }
    })
  })
  
  lightbox.init()
  lightbox.loadAndOpen(index)
}

onUnmounted(() => {
  if (lightbox) {
    lightbox.destroy()
    lightbox = null
  }
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
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  
  .article-img {
    width: 100%;
    aspect-ratio: 16 / 9;
    border-radius: 12px;
    cursor: zoom-in;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    
    // 确保 el-image 内部 img 填满
    :deep(.el-image__inner) {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  // 针对只有一张图片的特殊处理：放大展示
  &:has(> :nth-last-child(1):first-child) {
    grid-template-columns: 1fr;
    .article-img {
      aspect-ratio: 21 / 9;
    }
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

<style lang="scss">
/* PhotoSwipe 自定义缩略图样式 (全局) */
/* 调整 top-bar 到底部 */
.pswp__top-bar {
  top: auto !important;
  bottom: 0 !important;
  background-color: rgba(0, 0, 0, 0.5) !important;
  padding-bottom: env(safe-area-inset-bottom); /* 适配全面屏底部安全区 */
}

/* 调整缩略图栏位置到顶部 */
.pswp__thumbnails-container {
  position: absolute;
  bottom: 65px !important;
  left: 0;
  width: 100%;
  height: 80px;
  z-index: 1500;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

/* 适配缩略图栏位置，避免遮挡顶部内容 */
.pswp__thumbnails-wrapper {
  margin-top: env(safe-area-inset-top);
  display: flex;
  gap: 10px;
  overflow-x: auto;
  pointer-events: auto;
  background: rgba(0, 0, 0, 0.4);
  padding: 8px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  max-width: 90%;
  scrollbar-width: none;
}

.pswp__thumbnails-wrapper::-webkit-scrollbar {
  display: none;
}

.pswp__thumbnail-item {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.5;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  
  &:hover {
    opacity: 0.8;
  }
}

.pswp__thumbnail-item.is-active {
  opacity: 1;
  border-color: #ffb6c1;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.pswp__thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
</style>
