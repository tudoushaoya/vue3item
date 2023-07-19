import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
import clueDefault from '@/views/clueManage/clueDefault.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      hidden: true,
      component: () => import('@/views/login/index.vue')
    },
    // 首页路由
    {
      path: '/',
      name: 'layout',
      component: Layout,
      redirect: '/home',
      meta: {
        title: '首页',
        icon: 'House',
        id: '1',
        isTitle: false
      },
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index.vue')
        }
      ]
    },
    // 线索管理
    {
      path: '/clue',
      name: 'clue',
      component: Layout,
      redirect: '/clue/clue',
      meta: {
        title: '线索管理',
        icon: 'Tickets',
        id: '2',
        isTitle: false
      },
      children: [
        {
          path: 'clue',
          name: 'clue',
          hidden: true,
          component: () => import('@/views/clueManage/clue.vue'),
          children: [
            {
              path: 'pool', //线索池
              name: 'cluePool',
              hidden: true,
              component: () => import('@/views/clueManage/cluePool.vue')
            },
            {
              path: 'default', //默认线索
              name: 'clueDefault',
              hidden: true,
              // component: () => import('@/views/clueManage/clueDefault.vue')
              component: clueDefault
            }
          ]
        },
        {
          path: 'detail/:id', //线索跟进路由
          name: 'clueDetail',
          hidden: true,
          component: () => import('@/views/clueManage/clueDetail.vue')
        }
      ]
    },
    // 商机管理
    {
      path: '/business',
      name: 'business',
      component: Layout,
      redirect: '/business/business',
      meta: {
        title: '商机管理',
        icon: 'Place',
        id: '3',
        isTitle: false
      },
      children: [
        {
          path: 'business',
          name: 'business',
          hidden: true,
          component: () => import('@/views/businessOpport/business.vue')
        },
        {
          path: 'businessDetail/:id?/:flag?', //商机跟进路由
          name: 'businessDetail',
          hidden: true,
          component: () => import('@/views/businessOpport/businessDetail.vue')
        }
      ]
    },
    //合同管理
    {
      path: '/contract',
      name: 'contract',
      component: Layout,
      redirect: '/contract/contract',
      meta: {
        title: '合同管理',
        icon: 'Memo',
        id: '4',
        isTitle: false
      },
      children: [
        {
          path: 'contract',
          name: 'contract',
          hidden: true,
          component: () => import('@/views/contractManage/contract.vue')
        }
      ]
    },
    // 课程管理
    {
      path: '/course',
      name: 'course',
      component: Layout,
      redirect: '/course/course',
      meta: {
        title: '课程管理',
        icon: 'Collection',
        id: '5',
        isTitle: false
      },
      children: [
        {
          path: 'course',
          name: 'course',
          hidden: true,
          component: () => import('@/views/courseManage/course.vue')
        }
      ]
    },
    // 活动管理
    {
      path: '/activity',
      name: 'activity',
      component: Layout,
      redirect: '/activity/activity',
      meta: {
        title: '活动管理',
        icon: 'Star',
        id: '6',
        isTitle: false
      },
      children: [
        {
          path: 'activity',
          name: 'activity',
          hidden: true,
          component: () => import('@/views/activityManage/activity.vue')
        }
      ]
    },
    //工单管理
    {
      path: '/order',
      name: 'order',
      component: Layout,
      redirect: '/order/order',
      meta: {
        title: '工单管理',
        icon: 'DocumentCopy',
        id: '7',
        isTitle: false
      },
      children: [
        {
          path: 'order',
          name: 'order',
          hidden: true,
          component: () => import('@/views/orderManage/order.vue')
        }
      ]
    },
    // 统计分析
    {
      path: '/statistics',
      name: 'statistics',
      component: Layout,
      redirect: '/statistics/statistics',
      meta: {
        title: '统计分析',
        icon: 'Reading',
        id: '8',
        isTitle: false
      },
      children: [
        {
          path: 'statistics',
          name: 'statistics',
          hidden: true,
          component: () => import('@/views/statisticalAnalysis/statistics.vue')
        }
      ]
    },
    // 系统管理
    {
      path: '/system',
      name: 'system',
      component: Layout,
      // redirect: '/system/notifyCenter',
      meta: {
        title: '系统管理',
        icon: 'Tools',
        id: '9',
        isTitle: true
      },
      children: [
        {
          path: '/system/notifyCenter',
          name: 'notifyCenter',
          component: () => import('@/views/systemManage/notifyCenter.vue'),
          meta: {
            title: '通知中心',
            icon: 'ChatDotRound',
            id: '91',
            isTitle: false
          }
        },
        {
          path: '/system/permissions',
          name: 'permissions',
          // redirect: '/system/permissions/role',
          component: () => import('@/views/systemManage/permissionsManage.vue'),
          meta: {
            title: '权限管理',
            icon: 'Lock',
            id: '92',
            isTitle: true
          },
          children: [
            {
              path: '/system/permissions/role',
              name: 'role',
              component: () => import('@/views/systemManage/roleManage.vue'),
              meta: {
                title: '角色管理',
                id: '921'
              }
            },
            {
              path: '/system/permissions/user',
              name: 'user',
              component: () => import('@/views/systemManage/userManage.vue'),
              meta: {
                title: '用户管理',
                id: '922'
              }
            },
            {
              path: '/system/permissions/menu',
              name: 'menu',
              component: () => import('@/views/systemManage/menuManage.vue'),
              meta: {
                title: '菜单管理',
                id: '923'
              }
            },
            {
              path: '/system/permissions/department',
              name: 'department',
              component: () => import('@/views/systemManage/departmentManage.vue'),
              meta: {
                title: '部门管理',
                id: '924'
              }
            },
            {
              path: '/system/permissions/job',
              name: 'job',
              component: () => import('@/views/systemManage/jobManage.vue'),
              meta: {
                title: '岗位管理',
                id: '925'
              }
            }
          ]
        },
        {
          path: '/system/dictionary',
          name: 'dictionary',
          component: () => import('@/views/systemManage/dictionaryManage.vue'),
          meta: {
            title: '字典管理',
            icon: 'Notebook',
            id: '93',
            isTitle: false
          }
        },
        {
          path: '/system/systemLog',
          name: 'systemLog',
          component: () => import('@/views/systemManage/systemLog.vue'),
          meta: {
            title: '系统日志',
            icon: 'CollectionTag',
            id: '94',
            isTitle: false
          }
        }
      ]
    }
    // {
    //   path: '*',
    //   name: '404',
    //   component: () => import('@/views/404/index.vue')
    // }
  ]
})

export default router
