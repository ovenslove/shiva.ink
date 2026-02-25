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
