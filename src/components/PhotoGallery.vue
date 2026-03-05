<!--
  @Author: ovenslove (1905997838@qq.com)
  @Project: shiva.ink
  @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
  @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
-->

<template>
  <div class="photo-gallery">
    <!-- 图片网格展示 -->
    <div class="gallery-grid">
      <el-row :gutter="20">
        <el-col
          v-for="(image, index) in images"
          :key="index"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="gallery-item"
        >
          <div 
            class="thumbnail-card cute-card" 
            @click="openViewer(index)"
          >
            <div class="thumbnail-wrapper">
              <img 
                v-lazy="image.url" 
                :alt="image.title" 
                class="thumbnail-img"
                @load="handleLoad(index)"
              />
              <div class="blur-placeholder" v-if="!loadedIndices.has(index)"></div>
              <div class="thumbnail-overlay">
                <el-icon><ZoomIn /></el-icon>
              </div>
            </div>
            <div v-if="image.title || image.date" class="thumbnail-info">
              <span class="title">{{ image.title }}</span>
              <span class="date">{{ image.date }}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 大图查看器 (Lightbox) -->
    <teleport to="body">
      <transition name="viewer-fade">
        <div 
          v-if="viewerVisible" 
          class="viewer-overlay"
          @click.self="closeViewer"
          @keydown.esc="closeViewer"
          tabindex="0"
          ref="viewerRef"
        >
          <!-- 顶部工具栏 (确保按钮位置固定且不被内容遮挡) -->
          <div class="viewer-header">
            <div class="viewer-header-info">
              <span v-if="images[currentIndex].title" class="header-title">{{ images[currentIndex].title }}</span>
            </div>
            <button class="viewer-close" @click="closeViewer" title="关闭 (Esc)">
              <el-icon><Close /></el-icon>
            </button>
          </div>

          <!-- 左右切换按钮 -->
        <button 
          v-if="images.length > 1" 
          class="viewer-nav prev" 
          @click="prevImage"
          aria-label="Previous image"
        >
          <el-icon><ArrowLeft /></el-icon>
        </button>
        <button 
          v-if="images.length > 1" 
          class="viewer-nav next" 
          @click="nextImage"
          aria-label="Next image"
        >
          <el-icon><ArrowRight /></el-icon>
        </button>

        <!-- 主图片容器 -->
        <div 
          class="viewer-content"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
        >
          <transition :name="slideDirection" mode="out-in">
            <div :key="currentIndex" class="viewer-image-container">
              <div v-if="loading" class="viewer-loader">
                <el-icon class="is-loading"><Loading /></el-icon>
              </div>
              <img 
                :src="images[currentIndex].url" 
                :alt="images[currentIndex].title"
                class="viewer-image"
                @load="onImageLoad"
                @error="onImageError"
              />
              <div v-if="error" class="viewer-error">
                <el-icon><CircleClose /></el-icon>
                <span>图片加载失败</span>
              </div>
            </div>
          </transition>
        </div>

        <!-- 底部信息与指示器 -->
        <div class="viewer-footer">
          <div class="viewer-info">
            <h3>{{ images[currentIndex].title }}</h3>
            <p>{{ images[currentIndex].date }}</p>
          </div>
          <div class="viewer-counter">
            {{ currentIndex + 1 }} / {{ images.length }}
          </div>
        </div>
      </div>
    </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { ZoomIn, Close, ArrowLeft, ArrowRight, Loading, CircleClose } from '@element-plus/icons-vue'

interface GalleryImage {
  url: string
  title?: string
  date?: string
}

const props = defineProps<{
  images: GalleryImage[]
}>()

const loadedIndices = ref(new Set<number>())

const handleLoad = (index: number) => {
  loadedIndices.value.add(index)
}

const viewerVisible = ref(false)
const currentIndex = ref(0)
const loading = ref(true)
const error = ref(false)
const slideDirection = ref('slide-next')
const viewerRef = ref<HTMLElement | null>(null)

// --- 查看器控制 ---
const openViewer = (index: number) => {
  currentIndex.value = index
  viewerVisible.value = true
  loading.value = true
  error.value = false
  document.body.style.overflow = 'hidden' // 锁定滚动
  
  // 预加载相邻图片
  preloadImages(index)
}

const closeViewer = () => {
  viewerVisible.value = false
  document.body.style.overflow = ''
}

const nextImage = () => {
  if (props.images.length <= 1) return
  slideDirection.value = 'slide-next'
  currentIndex.value = (currentIndex.value + 1) % props.images.length
  resetState()
  preloadImages(currentIndex.value)
}

const prevImage = () => {
  if (props.images.length <= 1) return
  slideDirection.value = 'slide-prev'
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
  resetState()
  preloadImages(currentIndex.value)
}

const resetState = () => {
  loading.value = true
  error.value = false
}

// --- 图片状态处理 ---
const onImageLoad = () => {
  loading.value = false
}

const onImageError = () => {
  loading.value = false
  error.value = true
}

const preloadImages = (index: number) => {
  const nextIdx = (index + 1) % props.images.length
  const prevIdx = (index - 1 + props.images.length) % props.images.length
  
  const nextImg = new Image()
  nextImg.src = props.images[nextIdx].url
  
  const prevImg = new Image()
  prevImg.src = props.images[prevIdx].url
}

// --- 键盘事件 ---
const handleKeyDown = (e: KeyboardEvent) => {
  if (!viewerVisible.value) return
  
  if (e.key === 'ArrowRight') nextImage()
  if (e.key === 'ArrowLeft') prevImage()
  if (e.key === 'Escape') closeViewer()
}

// --- 触摸手势 ---
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchMove = (e: TouchEvent) => {
  // 可以增加简单的跟手动画逻辑，此处仅记录结束位置
  touchEndX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  if (touchEndX < touchStartX - swipeThreshold) {
    nextImage()
  } else if (touchEndX > touchStartX + swipeThreshold) {
    prevImage()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = ''
})

// 监听查看器显示状态以自动聚焦，支持 Esc 键
watch(viewerVisible, (visible) => {
  if (visible) {
    setTimeout(() => {
      viewerRef.value?.focus()
    }, 100)
  }
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.photo-gallery {
  width: 100%;
}

// --- 缩略图网格 ---
.gallery-item {
  margin-bottom: 20px;
}

.thumbnail-card {
  cursor: pointer;
  background: #fff;
  border: 1px solid rgba($color-primary, 0.1);
  
  .thumbnail-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    overflow: hidden;
    
    .thumbnail-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 2;
      position: relative;
    }

    .blur-placeholder {
      position: absolute;
      inset: 0;
      background: #f5f5f5;
      backdrop-filter: blur(10px);
      z-index: 1;
      
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(
          90deg,
          transparent 0%,
          rgba(255, 255, 255, 0.4) 50%,
          transparent 100%
        );
        animation: shimmer 1.5s infinite linear;
      }
    }
    
    .thumbnail-overlay {
      position: absolute;
      inset: 0;
      background: rgba($color-primary, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      color: #fff;
      font-size: 24px;
      backdrop-filter: blur(2px);
    }
  }
  
  .thumbnail-info {
    padding: 10px;
    display: flex;
    flex-direction: column;
    
    .title {
      font-weight: 600;
      color: $color-text;
      font-size: 14px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .date {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
    }
  }
  
  &:hover {
    .thumbnail-img {
      transform: scale(1.08);
    }
    .thumbnail-overlay {
      opacity: 1;
    }
  }
}

// --- 查看器 ---
.viewer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.98);
  z-index: 10000; // 极高层级，确保在 body 根部覆盖所有内容
  display: flex;
  flex-direction: column;
  outline: none;
}

.viewer-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 5020;
  background: linear-gradient(to bottom, rgba(0,0,0,0.8), transparent);
  pointer-events: none; // 允许点击穿透到背景关闭，除非点击子元素
  box-sizing: border-box;

  .viewer-header-info {
    color: #fff;
    .header-title {
      font-size: 18px;
      font-weight: 600;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
  }

  .viewer-close {
    pointer-events: auto;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: #fff;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg) scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }
  }
}

.viewer-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #fff;
  font-size: 24px;
  padding: 20px 15px;
  cursor: pointer;
  z-index: 5010;
  transition: background 0.3s ease;
  border-radius: 4px;
  
  &:hover { background: rgba(255, 255, 255, 0.2); }
  &.prev { left: 20px; }
  &.next { right: 20px; }
}

.viewer-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  padding-top: calc(var(--el-header-height, 70px) + 20px); // 确保不被导航栏遮挡，并留出额外间距
  position: relative;
  overflow: hidden;
}

.viewer-image-container {
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.viewer-image {
  max-width: 100%;
  max-height: 80vh;
  object-fit: contain;
  box-shadow: 0 0 30px rgba(0,0,0,0.5);
  user-select: none;
}

.viewer-loader {
  position: absolute;
  font-size: 40px;
  color: $color-primary;
}

.viewer-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #ff4d4f;
  gap: 10px;
  font-size: 18px;
}

.viewer-footer {
  padding: 20px 40px 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: #fff;
  
  .viewer-info {
    h3 { margin: 0 0 5px; font-size: 20px; }
    p { margin: 0; font-size: 14px; color: #ccc; }
  }
  
  .viewer-counter {
    font-size: 16px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.1);
    padding: 5px 15px;
    border-radius: 20px;
  }
}

// --- 动画 ---
.viewer-fade-enter-active, .viewer-fade-leave-active {
  transition: opacity 0.3s ease;
}
.viewer-fade-enter-from, .viewer-fade-leave-to {
  opacity: 0;
}

// 左右滑动切换动画
.slide-next-enter-active, .slide-next-leave-active,
.slide-prev-enter-active, .slide-prev-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-next-enter-from { opacity: 0; transform: translateX(50px); }
.slide-next-leave-to { opacity: 0; transform: translateX(-50px); }

.slide-prev-enter-from { opacity: 0; transform: translateX(-50px); }
.slide-prev-leave-to { opacity: 0; transform: translateX(50px); }

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

// 响应式调整
@media (max-width: 768px) {
  .viewer-nav { display: none; } // 移动端依赖手势
  
  .viewer-header {
    padding: 15px 20px;
    .viewer-close {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    .header-title {
      font-size: 16px;
    }
  }

  .viewer-content { 
    padding: 10px;
    padding-top: calc(var(--el-header-height, 60px) + 20px);
  }

  .viewer-image {
    max-height: 70vh;
  }

  .viewer-footer { 
    padding: 10px 20px 20px;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);

    .viewer-info {
      h3 { font-size: 16px; margin-bottom: 2px; }
      p { font-size: 12px; }
    }

    .viewer-counter {
      font-size: 14px;
      padding: 3px 12px;
    }
  }
}
</style>
