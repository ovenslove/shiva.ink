<template>
  <div class="gallery-view container">
    <div class="filter-header animate__animated animate__fadeIn">
      <h2 class="section-title">我的相册</h2>
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

    <div class="gallery-grid" v-viewer="{ toolbar: true }">
      <el-row :gutter="20">
        <el-col
          v-for="album in filteredAlbums"
          :key="album.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          class="gallery-item animate__animated animate__zoomIn"
        >
          <el-card class="album-card cute-card" :body-style="{ padding: '0px' }">
            <div class="image-wrapper">
              <el-image
                v-lazy="album.cover"
                :src="album.cover"
                class="album-image"
                fit="cover"
                :preview-src-list="[album.cover]"
              />
              <div class="image-overlay">
                <el-icon><ZoomIn /></el-icon>
              </div>
            </div>
            <div class="album-info">
              <h3 class="album-title">{{ album.title }}</h3>
              <div class="album-meta">
                <span class="date">{{ album.date }}</span>
                <div class="tags">
                  <el-tag v-for="tag in album.tags" :key="tag" size="small" effect="plain" round>
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-empty v-if="filteredAlbums.length === 0" description="没有找到相关的相册哦 ✨" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search, ZoomIn } from '@element-plus/icons-vue'
import { useMediaStore } from '../store'

/**
 * 相册组件
 * @description 展示所有相册，支持搜索、标签筛选及 Lightbox 预览
 */

const mediaStore = useMediaStore()
const searchQuery = ref('')
const selectedTag = ref('')

const filteredAlbums = computed(() => {
  return mediaStore.albums.filter(album => {
    const matchesSearch = album.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          album.tags.some(t => t.toLowerCase().includes(searchQuery.value.toLowerCase()))
    const matchesTag = !selectedTag.value || album.tags.includes(selectedTag.value)
    return matchesSearch && matchesTag
  })
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.gallery-view {
  padding-top: 20px;
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
