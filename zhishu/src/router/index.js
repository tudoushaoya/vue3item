import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/layout/index.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      hidden: true,
      component: () => import('@/views/login/index.vue')
    },
    {
      path: '/',
      name: 'workbench',
      component: Layout,
      redirect: '/workbench',
      meta: {
        title: '工作台',
        icon: 'HomeOutlined'
      },
      children: [
        {
          path: 'workbench',
          name: 'workbench',
          component: () => import('@/views/workbench/index.vue')
        }
      ]
    },
    {
      path: '/park',
      name: 'park',
      component: Layout,
      meta: {
        title: '园区管理',
        icon: 'HddOutlined'
      },
      children: [
        {
          //楼宇管理
          path: '/park/buildings',
          name: 'buildings',
          component: () => import('@/views/park/building.vue'),
          meta: {
            title: '楼宇管理'
          }
        },
        {
          //企业管理
          path: '/park/enterprise',
          name: 'enterprise',
          component: () => import('@/views/park/enterprise.vue'),
          meta: {
            title: '企业管理'
          }
        }
      ]
    },
    //行车管理
    {
      path: '/car',
      name: 'car',
      component: Layout,
      meta: {
        title: '行车管理',
        icon: 'CarOutlined'
      },
      children: [
        {
          //区域管理
          path: '/car/area',
          name: 'area',
          component: () => import('@/views/car/area.vue'),
          meta: {
            title: '区域管理'
          }
        },
        {
          //月卡管理
          path: '/car/monthCard',
          name: 'monthCard',
          component: () => import('@/views/car/monthCard.vue'),
          meta: {
            title: '月卡管理'
          }
        },

        {
          //停车缴费管理
          path: '/car/pay',
          name: 'pay',
          component: () => import('@/views/car/pay.vue'),
          meta: {
            title: '停车缴费管理'
          }
        },
        {
          //计费规则管理
          path: '/car/billing',
          name: 'billing',
          component: () => import('@/views/car/billing.vue'),
          meta: {
            title: '计费规则管理'
          }
        }
      ]
    },
    {
      hidden: true,
      path: '/car/card',
      name: 'card',
      component: () => import('@/views/car/components/card.vue')
    },
    {
      hidden: true,
      path: '/car/renewMonthCard/:id',
      name: 'renewMonthCard',
      component: () => import('@/views/car/components/renewMonthCard.vue')
    },
    {
      hidden: true,
      path: '/car/viewMonthCard/:id',
      name: 'viewMonthCard',
      component: () => import('@/views/car/components/viewMonthCard.vue')
    },
    {
      hidden: true,
      path: '/car/editMonthCard/:id',
      name: 'editMonthCard',
      component: () => import('@/views/car/components/editMonthCard.vue')
    },
    //物业费管理
    {
      path: '/propety',
      name: 'propety',
      component: Layout,
      meta: {
        title: '物业费管理',
        icon: 'PayCircleOutlined'
      },
      children: [
        {
          path: '/propety',
          name: 'cost',
          component: () => import('@/views/propety/index.vue')
        }
      ]
    },
    //一体杆管理
    {
      path: '/rod',
      name: 'rod',
      component: Layout,
      meta: {
        title: '一体杆管理',
        icon: 'AlignCenterOutlined'
      },
      children: [
        {
          path: '/rod/manage',
          name: 'manage',
          component: () => import('@/views/rod/manage.vue'),
          meta: {
            title: '一体杆管理'
          }
        },
        {
          //告警记录
          path: '/rod/warnList',
          name: 'warnList',
          component: () => import('@/views/rod/warnList.vue'),
          meta: {
            title: '告警记录'
          }
        }
      ]
    },
    //系统管理
    {
      path: '/system',
      name: 'system',
      component: Layout,
      meta: {
        title: '系统管理',
        icon: 'UnorderedListOutlined'
      },
      children: [
        {
          //员工管理
          path: '/system/employee',
          name: 'employee',
          component: () => import('@/views/system/employee.vue'),
          meta: {
            title: '员工管理'
          }
        },
        {
          //角色管理
          path: '/system/permission',
          name: 'permission',
          component: () => import('@/views/system/permission.vue'),
          meta: {
            title: '角色管理'
          }
        }
      ]
    },
    {
      //添加编辑企业
      path: '/park/enterprise/add/:id?',
      name: 'addEnterprise',
      hidden: true,
      component: () => import('@/views/park/addEnterprise.vue')
    },
    {
      //查看企业
      path: '/park/enterprise/detail/:id?',
      name: 'detailEnterprise',
      hidden: true,
      component: () => import('@/views/park/detailEnterprise.vue')
    },
    {
      path: '/system/role/add',
      name: 'add',
      hidden: true,
      component: () => import('@/views/system/role/add.vue')
    }, // 编辑角色
    {
      path: '/system/role/edit/:id',
      name: 'edit',
      hidden: true,
      component: () => import('@/views/system/role/edit.vue')
    },
    {
      path: '/warn/detail/:id',
      name: 'warnDetail',
      component: () => import('@/views/rod/AlarmDetails.vue'),
      hidden: true
    }
  ]
})

export default router
