<template>
  <div class="video-view container">
    <div class="header-section animate__animated animate__fadeIn">
      <h2 class="section-title">我的视频</h2>
    </div>

    <el-row :gutter="30">
      <el-col
        v-for="video in mediaStore.videos"
        :key="video.id"
        :xs="24"
        :md="12"
        class="video-item animate__animated animate__fadeInUp"
      >
        <el-card class="video-card cute-card" :body-style="{ padding: '0px' }">
          <div class="video-player-container">
            <video
              class="html5-video"
              controls
              :poster="video.cover"
              preload="metadata"
              playsinline
            >
              <source :src="video.url" type="video/mp4" />
              您的浏览器不支持 HTML5 视频播放。
            </video>
          </div>
          <div class="video-info">
            <h3 class="video-title">{{ video.title }}</h3>
            <div class="video-meta">
              <span class="date">{{ video.date }}</span>
              <div class="tags">
                <el-tag v-for="tag in video.tags" :key="tag" size="small" effect="plain" round>
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="mediaStore.videos.length === 0" description="还没有上传视频哦 ✨" />
  </div>
</template>

<script setup lang="ts">
import { useMediaStore } from '../store'

/**
 * 视频展示组件
 * @description 集成 HTML5 播放器展示个人视频作品
 */

const mediaStore = useMediaStore()
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.video-view {
  padding-top: 20px;
}

.header-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  color: $color-text;
}

.video-item {
  margin-bottom: 30px;
}

.video-card {
  .video-player-container {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    background: #000;
    
    .html5-video {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .video-info {
    padding: 20px;

    .video-title {
      margin: 0 0 10px 0;
      font-size: 18px;
      color: $color-text;
    }

    .video-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #999;
      font-size: 14px;

      .tags {
        display: flex;
        gap: 8px;
      }
    }
  }
}
</style>
