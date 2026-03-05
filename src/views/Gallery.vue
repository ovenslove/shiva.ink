<!--
  @Author: ovenslove (1905997838@qq.com)
  @Project: shiva.ink
  @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
  @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
-->

<template>
  <div class="gallery-view container">
    <el-breadcrumb separator="/" class="breadcrumb animate__animated animate__fadeIn">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>相册</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="filter-header animate__animated animate__fadeIn">
      <h1 class="section-title">我的相册 - Shiva.ink 摄影作品集</h1>
      <div class="filter-controls">
        <el-input
          v-model="searchQuery"
          placeholder="搜索相册或标签..."
          class="search-input"
          :prefix-icon="Search"
          clearable
        />
        <el-select v-model="selectedTag" placeholder="按标签筛选" clearable class="tag-select">
          <el-option v-for="tag in mediaStore.allTags" :key="tag" :label="tag" :value="tag" />
        </el-select>
      </div>
    </div>

    <div class="gallery-container animate__animated animate__fadeIn">
      <PhotoSkeleton v-if="mediaStore.isLoading" :count="8" />
      <template v-else>
        <PhotoGallery :images="displayImages" />
        
        <!-- 分页控件 -->
        <div v-if="filteredAlbums.length > 0" class="pagination-wrapper">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[8, 12, 24, 48]"
            layout="prev, pager, next"
            :total="filteredAlbums.length"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            background
          />
        </div>
      </template>
    </div>

    <el-empty v-if="filteredAlbums.length === 0" description="没有找到相关的相册哦 ✨" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { Search } from '@element-plus/icons-vue'
import { useMediaStore } from '../store'
import PhotoGallery from '../components/PhotoGallery.vue'
import PhotoSkeleton from '../components/PhotoSkeleton.vue'

/**
 * 相册视图
 * @description 展示所有相册，集成 PhotoGallery 组件
 */

const route = useRoute()
const router = useRouter()
const mediaStore = useMediaStore()

const searchQuery = ref('')
const selectedTag = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 监听路由查询参数的变化，确保在页面已挂载时点击首页动态也能触发搜索
watch(() => route.query.search, (newSearch) => {
  if (newSearch) {
    searchQuery.value = newSearch as string
    currentPage.value = 1 // 搜索时重置页码
  }
}, { immediate: true })

// 监听路由分页参数
watch(() => route.query.page, (newPage) => {
  if (newPage) {
    currentPage.value = parseInt(newPage as string)
  }
}, { immediate: true })

onMounted(async () => {
  // 初始加载时根据 URL 设置分页
  if (route.query.page) currentPage.value = parseInt(route.query.page as string)
  if (route.query.pageSize) pageSize.value = parseInt(route.query.pageSize as string)

  // 模拟加载效果以展示新设计的骨架屏
  mediaStore.isLoading = true
  setTimeout(() => {
    mediaStore.isLoading = false
  }, 1200)
})

const handleSizeChange = (val: number) => {
  pageSize.value = val
  currentPage.value = 1
  updateUrl()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  updateUrl()
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const updateUrl = () => {
  router.push({
    query: {
      ...route.query,
      page: currentPage.value,
      pageSize: pageSize.value
    }
  })
}

// 筛选后的所有相册
const filteredAlbums = computed(() => {
  return mediaStore.albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          album.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesTag = !selectedTag.value || album.tags.includes(selectedTag.value)
    return matchesSearch && matchesTag
  })
})

// 将筛选并分页后的数据转换为 PhotoGallery 需要的格式
const displayImages = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAlbums.value
    .slice(start, end)
    .map(album => ({
      url: album.cover,
      title: album.title,
      date: dayjs(album.date).format('YYYY-MM-DD')
    }))
})

// 监听搜索词和标签变化，重置页码
watch([searchQuery, selectedTag], () => {
  currentPage.value = 1
  updateUrl()
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.gallery-view {
  padding-top: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;

  .filter-controls {
    display: flex;
    gap: 10px;
    
    .search-input {
      width: 250px;
    }
    .tag-select {
      width: 150px;
    }
  }
}

.section-title {
  font-size: 24px;
  color: $color-text;
  margin: 0;
}

.gallery-grid {
  min-height: 400px;
}

.pagination-wrapper {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;

  :deep(.el-pagination) {
    --el-pagination-button-bg-color: #fff;
    --el-pagination-hover-color: #{$color-primary};
    
    .el-pager li.is-active {
      background-color: $color-primary !important;
      color: #fff !important;
    }
  }
}

.album-card {
  margin-bottom: 25px;
  overflow: hidden;
  border: 1px solid rgba(255, 182, 193, 0.2);

  .image-wrapper {
    position: relative;
    width: 100%;
    aspect-ratio: 4 / 3;
    overflow: hidden;

    .album-image {
      width: 100%;
      height: 100%;
      transition: transform 0.5s ease;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(255, 182, 193, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      color: #fff;
      font-size: 32px;
    }

    &:hover {
      .album-image {
        transform: scale(1.1);
      }
      .image-overlay {
        opacity: 1;
      }
    }
  }

  .album-info {
    padding: 15px;

    .album-title {
      margin: 0 0 8px 0;
      font-size: 18px;
      color: $color-text;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .album-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .date {
        font-size: 13px;
        color: #999;
      }

      .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    .filter-controls {
      width: 100%;
      .search-input, .tag-select {
        flex: 1;
      }
    }
  }
}
</style>
