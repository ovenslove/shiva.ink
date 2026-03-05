<!--
  @Author: ovenslove (1905997838@qq.com)
  @Project: shiva.ink
  @Description: 高性能相册骨架屏组件 (Photo Skeleton)
-->

<template>
  <div class="photo-skeleton-grid">
    <el-row :gutter="gutter">
      <el-col
        v-for="i in count"
        :key="i"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="skeleton-item"
      >
        <div class="skeleton-card" :style="cardStyle">
          <!-- 图片占位区域：采用叠加卡片设计 -->
          <div class="skeleton-image-container">
            <div class="skeleton-stack-base"></div>
            <div class="skeleton-stack-mid"></div>
            <div class="skeleton-main-shimmer">
              <div class="shimmer-effect"></div>
              <!-- 模拟居中图标 -->
              <div class="skeleton-icon"></div>
            </div>
          </div>
          <!-- 文本占位区域 -->
          <div class="skeleton-info">
            <div class="skeleton-line title-line"></div>
            <div class="skeleton-line date-line"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  count?: number
  gutter?: number
  speed?: string // 动画速度，默认 1.5s
  primaryColor?: string // 基础颜色
}

const props = withDefaults(defineProps<Props>(), {
  count: 8,
  gutter: 20,
  speed: '1.5s',
  primaryColor: '#ffb6c1' // 默认项目粉色
})

const cardStyle = computed(() => ({
  '--skeleton-speed': props.speed,
  '--skeleton-color': props.primaryColor
}))
</script>

<style lang="scss" scoped>
@use "../styles/variables.scss" as *;

.photo-skeleton-grid {
  width: 100%;
  padding: 10px 0;
}

.skeleton-card {
  background: #fff;
  border-radius: $border-radius;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.skeleton-image-container {
  position: relative;
  width: 100%;
  padding-top: 120%; // 保持 4:5 或 3:4 比例
  background: #f0f0f0;
  overflow: hidden;
}

// 模拟叠放卡片效果
.skeleton-stack-base, .skeleton-stack-mid {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 100%;
  background: rgba(0, 0, 0, 0.03);
  border-radius: $border-radius;
  transform: translateY(15px) scale(0.9);
  z-index: 1;
}

.skeleton-stack-mid {
  transform: translateY(8px) scale(0.95);
  background: rgba(0, 0, 0, 0.02);
  z-index: 2;
}

.skeleton-main-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.skeleton-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
}

// 扫光动画
.shimmer-effect {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.6) 50%,
    transparent 100%
  );
  animation: shimmer var(--skeleton-speed) infinite linear;
}

.skeleton-info {
  padding: 15px;
  background: #fff;
}

.skeleton-line {
  height: 14px;
  background: #eee;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.4) 50%,
      transparent 100%
    );
    animation: shimmer var(--skeleton-speed) infinite linear;
  }
}

.title-line { width: 70%; }
.date-line { width: 40%; height: 10px; margin-bottom: 0; }

@keyframes shimmer {
  0% { left: -100%; }
  100% { left: 100%; }
}

// 响应式微调
@media (max-width: 768px) {
  .skeleton-image-container {
    padding-top: 100%; // 移动端 1:1 比例
  }
}
</style>
