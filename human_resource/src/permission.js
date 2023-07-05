// 做权限控制
import router from '@/router' // 可以不写index.js
import useToken from '@/stores/token'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css' // 引入进度条样式
// import { useRouter } from 'vue-router' 这个方法只能用在组件中

// 前置导航守卫
// 只要是路由发生跳转-就会执行- 跳转之前执行
// to 到哪里去
// from 从哪里来
// next 必须执行的一个函数

const whiteList = ['/login', '/404'] // 登录页 404白名单
router.beforeEach((to, from, next) => {
  nprogress.start() // 开启进度条
  const { token } = useToken()
  if (token) {
    // 有token的情况下
    if (to.path === '/login') {
      // 就是登录页
      next('/') // 跳转到主页
    } else {
      next() // 放行的意思
    }
  } else {
    // 没有token的情况下
    if (whiteList.includes(to.path)) {
      // 在白名单中 直接放行
      next()
    } else {
      next('/login')
    }
  }
})

// 后置导航守卫

router.afterEach(() => nprogress.done()) // 关闭进度条
