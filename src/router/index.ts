import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'

/**
 * 路由配置
 * @description 定义项目的核心导航结构
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页 - Shiva.ink' }
  },
  {
    path: '/gallery',
    name: 'Gallery',
    component: () => import('../views/Gallery.vue'),
    meta: { title: '相册 - Shiva.ink' }
  },
  {
    path: '/video',
    name: 'Video',
    component: () => import('../views/Video.vue'),
    meta: { title: '视频 - Shiva.ink' }
  },
  {
    path: '/archive',
    name: 'Archive',
    component: () => import('../views/Archive.vue'),
    meta: { title: '归档 - Shiva.ink' }
  }
]

const router = createRouter({
  history: createWebHashHistory(), // GitHub Pages 推荐使用 Hash 模式或配合 404.html 使用 History 模式
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// 设置页面标题
router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
})

export default router
