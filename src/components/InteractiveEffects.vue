<template>
  <div class="interactive-effects" :class="{ 'is-disabled': !settings.enableAnimations }">
    <!-- 粒子绘制画布 -->
    <canvas 
      ref="particleCanvas" 
      class="particle-canvas"
    ></canvas>
    
    <!-- 爱心渲染层 -->
    <div class="hearts-container">
      <div 
        v-for="heart in hearts" 
        :key="heart.id"
        class="heart"
        :style="{
          transform: `translate3d(${heart.x}px, ${heart.y}px, 0) scale(${heart.scale}) rotate(${heart.rotate}deg)`,
          opacity: heart.opacity,
          color: heart.color
        }"
      >
        ❤️
      </div>
    </div>

    <!-- 交互设置控制台 (仅在非移动端显示或通过特定方式呼出) -->
    <div class="effect-panel" v-if="showPanel">
      <el-card class="panel-card" shadow="hover">
        <template #header>
          <div class="panel-header">
            <span>✨ 特效设置</span>
            <el-button link @click="showPanel = false">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </template>
        
        <el-form label-position="top">
          <el-form-item label="启用特效">
            <el-switch v-model="settings.enableAnimations" />
          </el-form-item>
          
          <el-form-item label="粒子密度">
            <el-slider v-model="settings.animationDensity" :min="0.1" :max="1.0" :step="0.1" />
          </el-form-item>
          
          <el-form-item label="粒子速度">
            <el-slider v-model="settings.particleSpeed" :min="0.5" :max="2.0" :step="0.1" />
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    
    <!-- 呼出按钮 -->
    <div class="panel-trigger" v-if="!showPanel">
      <el-button circle @click="showPanel = true" type="primary" plain>
        <el-icon><Setting /></el-icon>
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useSettingsStore } from '../store'
import { Close, Setting } from '@element-plus/icons-vue'

/**
 * 交互特效组件
 * @description 实现鼠标/触摸跟随爱心动画、粒子发射系统及重力感应效果
 */

const settings = useSettingsStore()
const showPanel = ref(false)
const particleCanvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)

// --- 爱心跟随逻辑 ---
interface Heart {
  id: number
  x: number
  y: number
  scale: number
  rotate: number
  opacity: number
  color: string
  startTime: number // 记录开始时间以供统一循环计算
}

const hearts = ref<Heart[]>([])
let heartId = 0
// 对象池优化：预分配爱心对象
const heartPool: Heart[] = []
const MAX_HEARTS = 50

/**
 * 创建漂浮爱心
 * @param x X坐标
 * @param y Y坐标
 */
const createHeart = (x: number, y: number) => {
  if (!settings.enableAnimations || hearts.value.length >= MAX_HEARTS) return
  
  let heart: Heart
  const now = performance.now()
  if (heartPool.length > 0) {
    heart = heartPool.pop()!
    heart.id = heartId++
    heart.x = x - 12
    heart.y = y - 12
    heart.scale = 0.5 + Math.random() * 0.5
    heart.rotate = Math.random() * 360
    heart.opacity = 1
    heart.color = ['#ffb6c1', '#e0b0ff', '#ff8a8a'][Math.floor(Math.random() * 3)]
    heart.startTime = now
  } else {
    heart = {
      id: heartId++,
      x: x - 12,
      y: y - 12,
      scale: 0.5 + Math.random() * 0.5,
      rotate: Math.random() * 360,
      opacity: 1,
      color: ['#ffb6c1', '#e0b0ff', '#ff8a8a'][Math.floor(Math.random() * 3)],
      startTime: now
    }
  }
  
  hearts.value.push(heart)
}

/**
 * 统一更新爱心动画
 * @param now 当前时间戳
 */
const updateHearts = (now: number) => {
  const duration = 1000
  for (let i = hearts.value.length - 1; i >= 0; i--) {
    const heart = hearts.value[i]
    const elapsed = now - heart.startTime
    const progress = elapsed / duration
    
    if (progress < 1) {
      heart.opacity = 1 - progress * progress
      heart.y -= 1.5
      heart.rotate += 1.5
      heart.scale += 0.005
    } else {
      hearts.value.splice(i, 1)
      heartPool.push(heart)
    }
  }
}

// --- 粒子系统逻辑 ---
interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  life: number
}

const particles: Particle[] = []
const particlePool: Particle[] = [] // 粒子对象池
const MAX_PARTICLES = 200 // 限制最大粒子数
const colors = ['#ffb6c1', '#e0b0ff', '#a7f3d0', '#fce7cf', '#ff8a8a']

/**
 * 初始化粒子系统
 */
const initParticles = () => {
  if (!particleCanvas.value) return
  // 使用 desynchronized: true 减少延迟
  ctx.value = particleCanvas.value.getContext('2d', { 
    alpha: true,
    desynchronized: true
  })
  resizeCanvas()
}

/**
 * 画布尺寸适配
 */
const resizeCanvas = () => {
  if (particleCanvas.value) {
    const dpr = window.devicePixelRatio || 1
    particleCanvas.value.width = window.innerWidth * dpr
    particleCanvas.value.height = window.innerHeight * dpr
    if (ctx.value) {
      ctx.value.scale(dpr, dpr)
    }
  }
}

/**
 * 触发粒子爆炸
 * @param x X轴位置
 * @param y Y轴位置
 */
const explode = (x: number, y: number) => {
  if (!settings.enableAnimations) return
  
  const availableSpace = MAX_PARTICLES - particles.length
  if (availableSpace <= 0) return

  const count = Math.min(
    availableSpace,
    Math.floor((12 + Math.random() * 8) * settings.animationDensity * 2)
  )

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2
    const speed = (Math.random() * 4 + 2) * settings.particleSpeed
    
    let p: Particle
    if (particlePool.length > 0) {
      p = particlePool.pop()!
      p.x = x
      p.y = y
      p.vx = Math.cos(angle) * speed
      p.vy = Math.sin(angle) * speed
      p.size = 2 + Math.random() * 3
      p.color = colors[Math.floor(Math.random() * colors.length)]
      p.life = 1
    } else {
      p = {
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
      }
    }
    particles.push(p)
  }
}

// --- 物理效果逻辑 ---
let gravityX = 0
let gravityY = 0.05

/**
 * 响应设备倾斜
 */
const handleOrientation = (e: DeviceOrientationEvent) => {
  if (e.gamma !== null && e.beta !== null) {
    // 限制重力感应强度
    gravityX = Math.max(-0.5, Math.min(0.5, e.gamma / 45))
    gravityY = Math.max(-0.5, Math.min(0.5, e.beta / 45))
  }
}

/**
 * 每一帧渲染逻辑
 */
const render = (time: number) => {
  if (!settings.enableAnimations) {
    requestAnimationFrame(render)
    return
  }

  // 统一更新爱心动画状态
  updateHearts(time)

  if (!ctx.value || !particleCanvas.value) {
    requestAnimationFrame(render)
    return
  }

  ctx.value.clearRect(0, 0, particleCanvas.value.width, particleCanvas.value.height)

  // 更新与绘制粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]
    p.vx += gravityX
    p.vy += gravityY
    p.x += p.vx
    p.y += p.vy
    p.life -= 0.015

    // 屏幕边界碰撞回弹
    const dpr = window.devicePixelRatio || 1
    const width = particleCanvas.value.width / dpr
    const height = particleCanvas.value.height / dpr

    if (p.x < 0 || p.x > width) p.vx *= -0.6
    if (p.y < 0 || p.y > height) p.vy *= -0.6

    if (p.life <= 0) {
      particles.splice(i, 1)
      particlePool.push(p) // 回收到粒子池
      continue
    }

    ctx.value.fillStyle = p.color
    ctx.value.globalAlpha = p.life
    ctx.value.beginPath()
    ctx.value.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.value.fill()
  }

  // 随机生成自动漂浮粒子 (背景氛围)
  if (particles.length < MAX_PARTICLES && Math.random() < 0.03 * settings.animationDensity) {
    const dpr = window.devicePixelRatio || 1
    const width = particleCanvas.value.width / dpr
    
    let p: Particle
    if (particlePool.length > 0) {
      p = particlePool.pop()!
      p.x = Math.random() * width
      p.y = -10
      p.vx = (Math.random() - 0.5) * 1
      p.vy = Math.random() * 1.5 + 0.5
      p.size = 1 + Math.random() * 2
      p.color = colors[Math.floor(Math.random() * colors.length)]
      p.life = 1
    } else {
      p = {
        x: Math.random() * width,
        y: -10,
        vx: (Math.random() - 0.5) * 1,
        vy: Math.random() * 1.5 + 0.5,
        size: 1 + Math.random() * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1
      }
    }
    particles.push(p)
  }

  requestAnimationFrame(render)
}

// --- 全局事件监听 ---
let lastMoveTime = 0
const EVENT_THROTTLE = 64 // 增加节流时间，从 16ms 调整至 64ms，降低生成频率

const handleGlobalMouseMove = (e: MouseEvent) => {
  const now = performance.now()
  if (now - lastMoveTime >= EVENT_THROTTLE) {
    // 引入概率生成机制：仅 60% 的概率生成爱心，进一步减少数量
    if (Math.random() < 0.6) {
      createHeart(e.clientX, e.clientY)
    }
    lastMoveTime = now
  }
}

const handleGlobalClick = (e: MouseEvent) => {
  explode(e.clientX, e.clientY)
}

const handleGlobalTouchMove = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    const now = performance.now()
    if (now - lastMoveTime >= EVENT_THROTTLE) {
      // 移动端同样应用 60% 概率生成
      if (Math.random() < 0.6) {
        createHeart(e.touches[0].clientX, e.touches[0].clientY)
      }
      lastMoveTime = now
    }
  }
}

const handleGlobalTouchStart = (e: TouchEvent) => {
  if (e.touches.length > 0) {
    explode(e.touches[0].clientX, e.touches[0].clientY)
  }
}

onMounted(() => {
  initParticles()
  window.addEventListener('resize', resizeCanvas)
  
  // 使用 passive: true 优化滚动性能，移除 capture 以避免干扰原生滚动识别
  window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
  window.addEventListener('click', handleGlobalClick)
  window.addEventListener('touchmove', handleGlobalTouchMove, { passive: true })
  window.addEventListener('touchstart', handleGlobalTouchStart, { passive: true })
  
  // 降级策略：检测设备性能
  const isLowEnd = (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 4
  if (isLowEnd) {
    settings.setDensity(0.3)
  }
  
  // 仅在支持方向传感器的设备上监听
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleOrientation, { passive: true })
  }
  
  requestAnimationFrame(render)
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', handleGlobalMouseMove)
  window.removeEventListener('click', handleGlobalClick)
  window.removeEventListener('touchmove', handleGlobalTouchMove)
  window.removeEventListener('touchstart', handleGlobalTouchStart)
  window.removeEventListener('deviceorientation', handleOrientation)
})

// 监听动画开关，切换时清理资源
watch(() => settings.enableAnimations, (val) => {
  if (!val) {
    particles.length = 0
    hearts.value = []
  }
})
</script>

<style lang="scss" scoped>
.interactive-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; // 关键：允许点击穿透到下方元素
  z-index: 1000; // 调低 z-index，使其位于 Element Plus 覆盖层 (默认 2000+) 之下
  
  &.is-disabled {
    display: none;
  }
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.hearts-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.heart {
  position: absolute;
  font-size: 24px;
  user-select: none;
  pointer-events: none;
  will-change: transform, opacity;
  filter: drop-shadow(0 2px 4px rgba(255, 182, 193, 0.4));
}

.effect-panel {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 260px;
  pointer-events: auto;
  z-index: 10001;
  animation: slide-in 0.3s ease-out;

  .panel-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 182, 193, 0.3);
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: bold;
    color: #5c4b51;
  }
}

.panel-trigger {
  position: fixed;
  bottom: 20px;
  right: 20px;
  pointer-events: auto;
  z-index: 10000;
  
  .el-button {
    box-shadow: 0 4px 12px rgba(255, 182, 193, 0.4);
    &:hover {
      transform: scale(1.1);
    }
  }
}

@keyframes slide-in {
  from { transform: translateX(100%) opacity(0); }
  to { transform: translateX(0) opacity(1); }
}

@media (max-width: 768px) {
  .effect-panel {
    width: 220px;
    bottom: 10px;
    right: 10px;
  }
  .panel-trigger {
    bottom: 10px;
    right: 10px;
  }
}
</style>
