import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      hidden: true
    },
    {
      path: '/',
      redirect: '/dashboard',
      component: Layout,
      // 子节点
      children: [
        {
          path: 'dashboard', // 二级路由的地址
          component: () => import('@/views/dashboard/index.vue'),
          // 路由元信息
          meta: {
            title: '首页',
            icon: 'HomeOutlined'
          }
        }
      ]
    },
    {
      path: '/',
      redirect: '/role',
      component: Layout,
      // 子节点
      children: [
        {
          path: '', // 二级路由的地址
          component: () => import('@/views/role/index.vue'),
          // 路由元信息
          meta: {
            title: '角色',
            icon: 'MenuUnfoldOutlined'
          }
        }
      ]
    }
  ]
})

export default router
