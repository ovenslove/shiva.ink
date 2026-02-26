import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueLazyload from 'vue-lazyload'
import 'viewerjs/dist/viewer.css'
import VueViewer from 'v-viewer'

import App from './App.vue'
import router from './router'
import './styles/main.scss'

/**
 * 应用初始化
 * @description 配置全局插件、组件及样式
 */
const app = createApp(App)
const pinia = createPinia()

// 注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(VueViewer)
app.use(VueLazyload, {
  preLoad: 1.3,
  error: 'https://placehold.co/400x300?text=Error',
  loading: 'https://placehold.co/400x300?text=Loading',
  attempt: 1
})

app.mount('#app')

/**
 * 禁用页面缩放 (针对移动端及 iOS 优化)
 */
// 阻止双指缩放手势 (iOS Safari)
document.addEventListener('gesturestart', (e) => {
  e.preventDefault()
})

// 阻止双击缩放 (iOS Safari)
let lastTouchEnd = 0
document.addEventListener('touchend', (e) => {
  const now = Date.now()
  if (now - lastTouchEnd <= 300) {
    e.preventDefault()
  }
  lastTouchEnd = now
}, false)

// 阻止鼠标滚轮缩放 (Ctrl + Scroll)
document.addEventListener('wheel', (e) => {
  if (e.ctrlKey) {
    e.preventDefault()
  }
}, { passive: false })

// 阻止键盘快捷键缩放 (Ctrl/Cmd + +/-/0)
document.addEventListener('keydown', (e) => {
  if (
    (e.ctrlKey || e.metaKey) && 
    (e.key === '=' || e.key === '-' || e.key === '0' || e.key === '+')
  ) {
    e.preventDefault()
  }
})
