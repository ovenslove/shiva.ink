<!--
  @Author: ovenslove (1905997838@qq.com)
  @Project: shiva.ink
  @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
  @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
-->

<template>
  <div class="archive-view container">
    <el-breadcrumb separator="/" class="breadcrumb animate__animated animate__fadeIn">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>归档</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header-section animate__animated animate__fadeIn">
      <h1 class="section-title">时间轴归档 - 记录 Shiva 的美好瞬间</h1>
      <p class="subtitle">记录每一个美好的瞬间 ✨</p>
    </div>

    <div class="timeline-container animate__animated animate__fadeInUp">
      <el-timeline>
        <el-timeline-item
          v-for="item in sortedItems"
          :key="item.id + item.type"
          :timestamp="item.date"
          placement="top"
          :type="item.type === 'album' ? 'primary' : 'success'"
          :hollow="true"
        >
          <el-card class="archive-card cute-card" @click="navigateTo(item)">
            <div class="card-content">
              <div class="info">
                <div class="type-tag">
                  <el-icon v-if="item.type === 'album'"><Picture /></el-icon>
                  <el-icon v-else><VideoCamera /></el-icon>
                  {{ item.type === 'album' ? '相册' : '视频' }}
                </div>
                <h4 class="title">{{ item.title }}</h4>
                <div class="tags">
                  <el-tag v-for="tag in item.tags" :key="tag" size="small" effect="plain" round>
                    {{ tag }}
                  </el-tag>
                </div>
              </div>
              <div class="thumbnail">
                <el-image v-lazy="item.cover" fit="cover" class="thumb-img" :alt="item.title" />
              </div>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <el-empty v-if="sortedItems.length === 0" description="空空如也，快去记录生活吧 ✨" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMediaStore } from '../store'
import { Picture, VideoCamera } from '@element-plus/icons-vue'

/**
 * 归档组件
 * @description 按日期排序展示所有媒体内容的时间轴视图
 */

const router = useRouter()
const mediaStore = useMediaStore()

interface ArchiveItem {
  id: number
  title: string
  date: string
  type: 'album' | 'video'
  cover: string
  tags: string[]
}

const sortedItems = computed<ArchiveItem[]>(() => {
  const albums: ArchiveItem[] = mediaStore.albums.map(a => ({ ...a, type: 'album' as const }))
  const videos: ArchiveItem[] = mediaStore.videos.map(v => ({ ...v, type: 'video' as const }))
  
  return [...albums, ...videos].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
})

const navigateTo = (item: ArchiveItem) => {
  if (item.type === 'album') {
    router.push('/gallery')
  } else {
    router.push('/video')
  }
}
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.archive-view {
  padding-top: 20px;
}

.breadcrumb {
  margin-bottom: 20px;
}

.header-section {
  text-align: center;
  margin-bottom: 50px;
  
  .section-title {
    font-size: 28px;
    margin-bottom: 10px;
  }
  .subtitle {
    color: #999;
    font-size: 16px;
  }
}

.timeline-container {
  max-width: 800px;
  margin: 0 auto;
}

.archive-card {
  cursor: pointer;
  
  .card-content {
    display: flex;
    justify-content: space-between;
    gap: 20px;

    .info {
      flex: 1;
      .type-tag {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: #999;
        margin-bottom: 8px;
      }
      .title {
        margin: 0 0 15px 0;
        font-size: 18px;
        color: $color-text;
      }
      .tags {
        display: flex;
        gap: 8px;
      }
    }

    .thumbnail {
      width: 120px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      flex-shrink: 0;

      .thumb-img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

// 响应式调整
@media (max-width: 576px) {
  .archive-card .card-content {
    flex-direction: column-reverse;
    .thumbnail {
      width: 100%;
      height: 150px;
    }
  }
}
</style>
