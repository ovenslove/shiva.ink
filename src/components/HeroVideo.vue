<template>
  <div class="hero-video-container">
    <!-- 静态背景图降级 & 视频封面 -->
    <div 
      v-if="!videoLoaded || !isVideoPlaying" 
      class="video-fallback"
      :style="{ backgroundImage: `url(${poster})` }"
    ></div>

    <!-- 视频背景 -->
    <video
      ref="videoRef"
      class="bg-video"
      :poster="poster"
      autoplay
      muted
      loop
      playsinline
      crossorigin="anonymous"
      @canplay="onCanPlay"
      @playing="isVideoPlaying = true"
      @pause="isVideoPlaying = false"
    >
      <source :src="src" type="video/mp4" />
      您的浏览器不支持 HTML5 视频播放。
    </video>

    <!-- 柔和遮罩层，提升文字可读性 -->
    <div class="video-overlay"></div>

    <!-- 视频控制按钮 (可访问性) -->
    <div class="video-controls">
      <el-button 
        circle 
        class="control-btn"
        @click="togglePlay"
      >
        <el-icon v-if="isVideoPlaying"><VideoPause /></el-icon>
        <el-icon v-else><VideoPlay /></el-icon>
      </el-button>
    </div>

    <!-- 居中文字内容 -->
    <div class="hero-content">
      <slot>
        <h1 class="hero-title animate__animated animate__fadeInDown">Shiva.ink</h1>
        <p class="hero-subtitle animate__animated animate__fadeInUp animate__delay-1s">
          在星辰大海中漫步的小女生 ✨
        </p>
      </slot>
      <div class="scroll-indicator animate__animated animate__bounce animate__infinite">
        <el-icon><ArrowDown /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { VideoPlay, VideoPause, ArrowDown } from '@element-plus/icons-vue'

/**
 * HeroVideo 组件
 * @description 实现首页全屏视频背景，包含自动播放、降级处理及可访问性控制
 */

interface Props {
  src: string
  poster?: string
}

const props = defineProps<Props>()
const videoRef = ref<HTMLVideoElement | null>(null)
const videoLoaded = ref(false)
const isVideoPlaying = ref(false)

const onCanPlay = () => {
  videoLoaded.value = true
}

const togglePlay = () => {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play()
  } else {
    videoRef.value.pause()
  }
}

onMounted(() => {
  // 处理 iOS/Android 自动播放策略
  if (videoRef.value) {
    videoRef.value.play().catch(error => {
      console.log("Autoplay prevented:", error)
      isVideoPlaying.value = false
    })
  }
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.hero-video-container {
  position: relative;
  width: 100%;
  height: calc(100vh - var(--el-header-height));
  overflow: hidden;
  background-color: #000;
}

.bg-video {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
  object-fit: cover;
  z-index: 1;
}

.video-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 2;
  transition: opacity 0.8s ease;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(255, 182, 193, 0.2) 100%
  );
  z-index: 3;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 4;
  text-align: center;
  color: #fff;
  width: 90%;
  max-width: 800px;

  .hero-title {
    font-size: clamp(48px, 10vw, 80px);
    margin-bottom: 20px;
    font-family: 'Pacifico', cursive;
    text-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .hero-subtitle {
    font-size: clamp(18px, 4vw, 24px);
    letter-spacing: 2px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
}

.video-controls {
  position: absolute;
  bottom: 40px;
  left: 40px;
  z-index: 10;

  .control-btn {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.4);
    color: #fff;
    backdrop-filter: blur(4px);
    
    &:hover {
      background: rgba(255, 182, 193, 0.4);
    }
  }
}

.scroll-indicator {
  position: absolute;
  bottom: -100px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  color: #fff;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .hero-content {
    .hero-title {
      font-size: 40px;
    }
    .hero-subtitle {
      font-size: 16px;
    }
  }
  .video-controls {
    bottom: 20px;
    left: 20px;
  }
}
</style>
