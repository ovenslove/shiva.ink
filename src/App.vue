<!--
  @Author: ovenslove (1905997838@qq.com)
  @Project: shiva.ink
  @License: CC BY-NC 4.0 (Creative Commons Attribution-NonCommercial 4.0 International)
  @Copyright: Copyright (c) 2025 ovenslove. All rights reserved.
-->

<template>
  <el-container class="layout-container">
    <el-header class="header" :class="{ 'is-scrolled': isScrolled }">
      <div class="nav-content container">
        <div class="logo" @click="$router.push('/')">
          <span class="logo-text">Shiva.ink</span>
        </div>

        <!-- 桌面端菜单 -->
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          router
          class="nav-menu hidden-sm-and-down"
          :ellipsis="false"
        >
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/gallery">相册</el-menu-item>
          <el-menu-item index="/video">视频</el-menu-item>
          <el-menu-item index="/articles">文章</el-menu-item>
          <el-menu-item index="/archive">归档</el-menu-item>
        </el-menu>

        <!-- 移动端菜单按钮 -->
        <div class="mobile-menu-trigger hidden-md-and-up">
          <el-button link @click="mobileMenuVisible = true">
            <el-icon :size="28" color="#ffb6c1"><Menu /></el-icon>
          </el-button>
        </div>
      </div>

      <!-- 移动端侧边抽屉 -->
      <el-drawer
        v-model="mobileMenuVisible"
        direction="rtl"
        size="280px"
        :with-header="false"
        class="mobile-drawer"
        append-to-body
        :z-index="3000"
        :lock-scroll="false"
      >
        <div class="drawer-content">
          <div class="drawer-logo">
            <span class="logo-text">Shiva.ink</span>
          </div>
          <el-menu
            :default-active="activeMenu"
            router
            class="mobile-nav-menu"
            @select="mobileMenuVisible = false"
          >
            <el-menu-item index="/">
              <el-icon><HomeFilled /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-menu-item index="/gallery">
              <el-icon><Picture /></el-icon>
              <span>相册</span>
            </el-menu-item>
            <el-menu-item index="/video">
              <el-icon><VideoCamera /></el-icon>
              <span>视频</span>
            </el-menu-item>
            <el-menu-item index="/articles">
              <el-icon><Document /></el-icon>
              <span>文章</span>
            </el-menu-item>
            <el-menu-item index="/archive">
              <el-icon><Collection /></el-icon>
              <span>归档</span>
            </el-menu-item>
          </el-menu>
          <div class="drawer-footer">
            <p>Made with ❤️ for Shiva</p>
          </div>
        </div>
      </el-drawer>
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
        <p class="version-info">Version 1.0.0</p>
      </div>
    </el-footer>
  </el-container>

  <!-- 全局交互特效 -->
  <InteractiveEffects />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  HomeFilled, 
  Picture, 
  VideoCamera, 
  Collection, 
  Menu,
  Document
} from '@element-plus/icons-vue'
import InteractiveEffects from './components/InteractiveEffects.vue'

/**
 * 根组件
 * @description 定义全局布局、导航及过渡动画
 */

const route = useRoute()
const activeMenu = computed(() => route.path)
const mobileMenuVisible = ref(false)
const isScrolled = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="scss">
@use "./styles/variables.scss" as *;

:root { 
  --el-header-height: 60px;
  --el-header-height-scrolled: 60px;
}

.main { 
  padding: 0 !important;
}

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: var(--el-header-height);
}

.header {
  width: 100%;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  z-index: 2000; // 确保在普通内容之上
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
  height: var(--el-header-height);
  border-bottom: 1px solid transparent;

  &.is-scrolled {
    height: var(--el-header-height-scrolled);
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 4px 20px rgba(255, 182, 193, 0.15);
    border-bottom: 1px solid rgba(255, 182, 193, 0.2);
  }

  .nav-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
  }

  .logo {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;

    .logo-text {
      font-size: 28px;
      font-weight: bold;
      background: linear-gradient(45deg, $color-primary, $color-secondary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-family: 'Comic Sans MS', 'Pacifico', cursive;
    }

    &::before {
      content: '🎀';
      font-size: 24px;
    }
  }

  .nav-menu {
    border-bottom: none !important;
    background: transparent;
    
    .el-menu-item {
      font-size: 16px;
      &:hover, &.is-active {
        background: transparent !important;
        color: $color-primary !important;
      }
    }
  }

  .mobile-menu-trigger {
    display: flex;
    align-items: center;
  }
}

/* 抽屉导航样式 */
.mobile-drawer {
  .el-drawer__body {
    padding: 0;
    background-color: $color-bg;
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;
    padding: 30px 0;

    .drawer-logo {
      padding: 0 25px 30px;
      .logo-text {
        font-size: 24px;
        font-weight: bold;
        background: linear-gradient(45deg, $color-primary, $color-secondary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        font-family: 'Comic Sans MS', cursive;
      }
    }

    .mobile-nav-menu {
      border-right: none;
      background: transparent;
      flex: 1;

      .el-menu-item {
        height: 60px;
        line-height: 60px;
        font-size: 18px;
        margin: 5px 15px;
        border-radius: 12px;
        
        &.is-active {
          background: rgba(255, 182, 193, 0.1) !important;
          color: $color-primary !important;
        }

        .el-icon {
          font-size: 20px;
          margin-right: 12px;
        }
      }
    }

    .drawer-footer {
      padding: 20px;
      text-align: center;
      color: #ccc;
      font-size: 12px;
    }
  }
}

.main {
  flex: 1;
  padding: 0; // 取消默认 padding，由内部 view 控制或保持结构
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
