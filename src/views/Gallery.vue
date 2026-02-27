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
      <PhotoGallery :images="displayImages" />
    </div>

    <el-empty v-if="filteredAlbums.length === 0" description="没有找到相关的相册哦 ✨" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { useMediaStore } from '../store'
import PhotoGallery from '../components/PhotoGallery.vue'

/**
 * 相册视图
 * @description 展示所有相册，集成 PhotoGallery 组件
 */

const mediaStore = useMediaStore()
const searchQuery = ref('')
const selectedTag = ref('')

// 将 Album 数据转换为 PhotoGallery 需要的格式
const displayImages = computed(() => {
  return mediaStore.albums
    .filter(album => {
      const matchesSearch = album.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                            album.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
      const matchesTag = !selectedTag.value || album.tags.includes(selectedTag.value)
      return matchesSearch && matchesTag
    })
    .map(album => ({
      url: album.cover,
      title: album.title,
      date: album.date
    }))
})

const filteredAlbums = computed(() => {
  // 用于空状态判断
  return displayImages.value
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
