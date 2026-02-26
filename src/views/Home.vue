<template>
  <div class="home-view">
    <!-- 全屏视频 Hero 区域 -->
    <HeroVideo 
      src="https://player.vimeo.com/external/370331493.sd.mp4?s=7b23197340c693749dc64877f0d79742713a6c1e&profile_id=139&oauth2_token_id=57447761"
      poster="https://picsum.photos/id/1015/1920/1080"
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
              :timestamp="item.date"
              placement="top"
              color="#ffb6c1"
            >
              <el-card class="timeline-card cute-card">
                <h4>{{ item.title }}</h4>
                <div class="album-preview">
                  <el-image 
                    v-lazy="item.cover" 
                    class="preview-img" 
                    fit="cover"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import HeroVideo from '../components/HeroVideo.vue'
import { useUserStore, useMediaStore } from '../store'

/**
 * 首页组件
 * @description 展示个人基本信息、心情状态及最新动态
 */

const userStore = useUserStore()
const mediaStore = useMediaStore()
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
</style>
