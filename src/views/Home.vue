<!--
  @Author: ovenslove (1905997838@qq.com)
  @Project: shiva.ink
  @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
  @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
-->

<template>
  <div class="home-view">
    <!-- 全屏视频 Hero 区域 -->
    <HeroVideo 
      landscapeSrc="https://perfectdiary-public.oss-cn-shenzhen.aliyuncs.com/owQiTIFIdXAIXB1PiQB7ka2jpqEIW4PPEATRm.MP4"
      portraitSrc="https://perfectdiary-public.oss-cn-shenzhen.aliyuncs.com/oghsfcA6hYgCMvHuRIuHfYwQHyEhfEY0exAfyT.mov"
      landscapePoster="https://perfectdiary-public.oss-cn-shenzhen.aliyuncs.com/owQiTIFIdXAIXB1PiQB7ka2jpqEIW4PPEATRm.jpeg"
      portraitPoster="https://perfectdiary-public.oss-cn-shenzhen.aliyuncs.com/oghsfcA6hYgCMvHuRIuHfYwQHyEhfEY0exAfyT.jpeg"
    />
    <div class="home-content container">
      <!-- 欢迎横幅 -->
      <div class="welcome-banner animate__animated animate__fadeInUp">
        <h1 class="welcome-title">欢迎来到 Shiva 的小天地 ✨</h1>
        <p class="welcome-desc">记录成长，分享快乐，遇见最美好的自己</p>
      </div>

    <el-row :gutter="40">
      <!-- 个人资料卡片 -->
      <el-col :xs="24" :sm="8">
        <el-card class="profile-card cute-card animate__animated animate__fadeInLeft">
          <div class="avatar-wrapper">
            <el-avatar :size="120" :src="userStore.avatar" class="avatar-img" />
            <div class="status-badge" :title="userStore.status"></div>
          </div>
          <h2 class="nickname">{{ userStore.nickname }}</h2>
          <p class="signature">{{ userStore.signature }}</p>
          <div class="user-stats">
            <el-tag v-for="tag in userStore.tags" :key="tag" class="user-tag" round effect="plain">
              {{ tag }}
            </el-tag>
          </div>
          <el-divider />
          <div class="mood-section">
            <span class="label">当前心情:</span>
            <span class="mood-text">{{ userStore.mood }} ✨</span>
          </div>
        </el-card>
      </el-col>

      <!-- 动态/内容区域 -->
      <el-col :xs="24" :sm="16">
        <div class="content-section animate__animated animate__fadeInRight">
          <h3 class="section-title">我的动态</h3>
          <el-timeline>
            <el-timeline-item
              v-for="item in mediaStore.albums.slice(0, 3)"
              :key="item.id"
              :timestamp="dayjs(item.date).format('YYYY-MM-DD')"
              placement="top"
              color="#ffb6c1"
            >
              <el-card 
                class="timeline-card cute-card clickable-card" 
                @click="goToAlbum(item)"
              >
                <h4>{{ item.title }}</h4>
                <div class="album-preview">
                  <img 
                    v-lazy="item.cover" 
                    class="preview-img" 
                    fit="cover"
                    :alt="item.title"
                  />
                </div>
                <div class="card-footer">
                  <el-tag size="small" v-for="tag in item.tags" :key="tag">{{ tag }}</el-tag>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
          <div class="view-more">
            <el-button class="cute-button" type="primary" plain @click="$router.push('/gallery')">
              查看更多相册
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 地理位置与联系方式 (GEO 优化) -->
    <div class="geo-section animate__animated animate__fadeInUp">
      <h3 class="section-title">我的坐标</h3>
      <div class="geo-container">
        <div class="map-wrapper">
          <!-- 这里可以嵌入实际的地图，目前使用占位图展示 -->
          <div class="map-placeholder">
            <el-icon :size="40"><Location /></el-icon>
            <p>中国 · 广东 · 广州</p>
          </div>
        </div>
        <div class="contact-info">
          <p class="location-desc">
            Shiva 目前常驻于<strong>中国广州</strong>，专注于探索城市角落的美好与自然光影。
          </p>
          <div class="local-stats">
            <el-tag effect="plain" round># 深圳摄影师</el-tag>
            <el-tag effect="plain" round># 广东视觉创作</el-tag>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import HeroVideo from '../components/HeroVideo.vue'
import { useUserStore, useMediaStore } from '../store'
import { Location } from '@element-plus/icons-vue'

/**
 * 首页组件
 * @description 展示个人基本信息、心情状态及最新动态
 */

const router = useRouter()
const userStore = useUserStore()
const mediaStore = useMediaStore()

const goToAlbum = (album: any) => {
  router.push({
    path: '/gallery',
    query: { search: album.title }
  })
}
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.home-view {
  padding: 0;
}

.home-content {
  padding-top: 60px;
  padding-bottom: 60px;
}

.welcome-banner {
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 20px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 24px;
  backdrop-filter: blur(8px);
  border: 2px dashed $color-primary;

  .welcome-title {
    font-size: 36px;
    margin-bottom: 10px;
    background: linear-gradient(45deg, $color-primary, $color-secondary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
  }

  .welcome-desc {
    font-size: 18px;
    color: #888;
  }
}

.profile-card {
  text-align: center;
  padding: 20px;

  .avatar-wrapper {
    position: relative;
    display: inline-block;
    margin-bottom: 20px;

    .avatar-img {
      border: 4px solid #fff;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    .status-badge {
      position: absolute;
      bottom: 5px;
      right: 5px;
      width: 15px;
      height: 15px;
      background-color: $color-accent;
      border: 2px solid #fff;
      border-radius: 50%;
    }
  }

  .nickname {
    margin: 10px 0;
    color: $color-text;
    font-size: 24px;
  }

  .signature {
    color: #888;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .user-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    margin-bottom: 20px;
  }

  .mood-section {
    font-size: 14px;
    .label {
      color: #999;
      margin-right: 8px;
    }
    .mood-text {
      color: $color-secondary;
      font-weight: bold;
    }
  }
}

.content-section {
  :deep(.el-timeline-item__timestamp.is-top) {
    margin-bottom: 16px;
  }
}

.section-title {
  font-size: 20px;
  margin-bottom: 20px;
  color: $color-text;
  position: relative;
  padding-left: 15px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 18px;
    background-color: $color-primary;
    border-radius: 2px;
  }
}

.timeline-card {
  margin-bottom: 20px;

  &.clickable-card {
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(255, 182, 193, 0.3);
      border-color: $color-primary;
    }

    &:active {
      transform: translateY(-2px);
    }
  }

  h4 {
    margin: 0 0 10px 0;
  }
  .album-preview {
    height: 150px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
    .preview-img {
      width: 100%;
      height: 100%;
    }
  }
  .card-footer {
    display: flex;
    gap: 5px;
  }
}

.view-more {
  text-align: center;
  margin-top: 30px;
}

.geo-section {
  margin-top: 60px;
  padding-bottom: 40px;

  .geo-container {
    display: flex;
    gap: 30px;
    background: white;
    padding: 30px;
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(255, 182, 193, 0.1);
    align-items: center;

    @media (max-width: 768px) {
      flex-direction: column;
    }
  }

  .map-wrapper {
    flex: 1;
    height: 200px;
    width: 100%;
    background: #fdf5f6;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px dashed #ffb6c1;

    .map-placeholder {
      width: 100%;
      text-align: center;
      color: #ffb6c1;
      
      p {
        margin-top: 10px;
        font-weight: bold;
      }
    }
  }

  .contact-info {
    flex: 1;

    .location-desc {
      font-size: 16px;
      line-height: 1.8;
      color: #666;
      margin-bottom: 20px;

      strong {
        color: #ffb6c1;
      }
    }

    .local-stats {
      display: flex;
      gap: 10px;
    }
  }
}
</style>
