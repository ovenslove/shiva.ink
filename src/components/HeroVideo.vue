<template>
  <div class="hero-video-container">
    <!-- 静态背景图降级 & 视频封面 -->
    <transition name="fade">
      <div 
        v-if="!videoStarted" 
        class="video-fallback"
        :style="{ backgroundImage: `url(${currentPoster})` }"
      ></div>
    </transition>

    <!-- 视频背景 -->
    <video
      ref="videoRef"
      class="bg-video"
      :poster="currentPoster"
      autoplay
      muted
      loop
      playsinline
      crossorigin="anonymous"
      @playing="onPlaying"
      @pause="isVideoPlaying = false"
    >
      <source v-if="currentSrc" :src="currentSrc" />
      您的浏览器不支持 HTML5 视频播放。
    </video>

    <!-- 柔和遮罩层，提升文字可读性 -->
    <div class="video-overlay"></div>

    <!-- 底部渐变遮罩层，实现与内容区域的平滑过渡 -->
    <div class="video-bottom-mask"></div>

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
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { VideoPlay, VideoPause, ArrowDown } from '@element-plus/icons-vue'

/**
 * HeroVideo 组件
 * @description 实现首页全屏视频背景，包含自动播放、降级处理及可访问性控制
 */

interface Props {
  landscapeSrc: string
  portraitSrc: string
  landscapePoster?: string
  portraitPoster?: string
}

const props = defineProps<Props>()
const videoRef = ref<HTMLVideoElement | null>(null)
const isVideoPlaying = ref(false)
const videoStarted = ref(false)
const isPortrait = ref(false)

const currentSrc = computed(() => {
  return isPortrait.value ? props.portraitSrc : props.landscapeSrc
})

const currentPoster = computed(() => {
  return isPortrait.value ? props.portraitPoster : props.landscapePoster
})

// 监听源变化，手动触发视频重新加载
watch(currentSrc, () => {
  videoStarted.value = false
  if (videoRef.value) {
    videoRef.value.load()
    videoRef.value.play().catch(error => {
      console.log("Autoplay on switch prevented:", error)
    })
  }
})

const onPlaying = () => {
  isVideoPlaying.value = true
  // 延迟一小会儿隐藏封面，确保视频已经渲染出第一帧，防止黑屏
  setTimeout(() => {
    videoStarted.value = true
  }, 100)
}

const checkOrientation = () => {
  isPortrait.value = window.innerHeight > window.innerWidth
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
  checkOrientation()
  window.addEventListener('resize', checkOrientation)

  // 处理 iOS/Android 自动播放策略
  if (videoRef.value) {
    videoRef.value.play().catch(error => {
      console.log("Autoplay prevented:", error)
      isVideoPlaying.value = false
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkOrientation)
})
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.hero-video-container {
  position: relative;
  width: 100%;
  height: calc(100vh - var(--el-header-height));
  overflow: hidden;
  background-color: transparent; // 移除背景色，防止闪烁
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
  background-color: transparent;
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
  transition: opacity 1s ease; // 延长过渡时间，使切换更自然
}

// 渐变过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.2) 0%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.1) 100%
  );
  z-index: 3;
}

.video-bottom-mask {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 150px; // 渐变区域高度
  background: linear-gradient(
    to bottom,
    rgba($color-bg, 0) 0%,
    rgba($color-bg, 0.8) 70%,
    $color-bg 100%
  );
  z-index: 4;
}

.hero-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; // 确保文字在所有遮罩之上
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
