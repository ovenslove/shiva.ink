<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="nav-content container">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-text">Shiva.ink</span>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="nav-menu"
          :ellipsis="false"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/gallery">相册</el-menu-item>
          <el-menu-item index="/video">视频</el-menu-item>
          <el-menu-item index="/archive">归档</el-menu-item>
        </el-menu>
      </div>
    </el-header>

    <el-main class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </el-main>

    <el-footer class="footer">
      <div class="footer-content container">
        <p>© 2026 Shiva.ink - Crafted with ❤️ for a lovely girl</p>
      </div>
    </el-footer>

    <!-- 粒子效果背景 (可选) -->
    <div id="particles-js" class="particles-bg"></div>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 根组件
 * @description 定义全局布局、导航及过渡动画
 */

const route = useRoute()
const activeMenu = computed(() => route.path)
</script>

<style lang="scss">
@use "./styles/variables.scss" as *;

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 10px rgba(255, 182, 193, 0.1);
  padding: 0;
  height: 70px;

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  .logo {
    cursor: pointer;
    .logo-text {
      font-size: 24px;
      font-weight: bold;
      background: linear-gradient(45deg, $color-primary, $color-secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Pacifico', cursive; // 建议引入可爱字体
    }
  }

  .nav-menu {
    border-bottom: none;
    background: transparent;
    
    .el-menu-item {
      font-size: 16px;
      &:hover, &.is-active {
        background: transparent !important;
        color: $color-primary !important;
      }
    }
  }
}

.main {
  flex: 1;
  padding: 40px 0;
}

.footer {
  text-align: center;
  padding: 30px 0;
  color: #999;
  font-size: 14px;
}

// 页面切换动画
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.5s ease;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.particles-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
</style>
