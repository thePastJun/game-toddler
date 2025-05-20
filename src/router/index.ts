import { createRouter, RouteRecordRaw, createWebHashHistory } from 'vue-router'

// 定义路由类型
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页', keepAlive: true }
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('../views/Game.vue'),
    meta: { title: '游戏关卡', keepAlive: false }
  },
  {
    path: '/words',
    name: 'Words',
    component: () => import('../views/Words.vue'),
    meta: { title: '单词学习', keepAlive: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { title: '个人中心', keepAlive: true }
  },
  {
    path: '/achievements',
    name: 'Achievements',
    component: () => import('../views/Achievements.vue'),
    meta: { title: '我的成就', keepAlive: true }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { title: '页面不存在' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = `${to.meta.title || '单词通关游戏'}`
  next()
})

export default router