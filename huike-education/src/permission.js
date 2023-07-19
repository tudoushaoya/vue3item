import router from '@/router'
import useToken from '@/stores/token'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
const whiteList = ['/login', '/404'] // 白名单

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  nprogress.start()
  const { getToken } = useToken()
  if (getToken()) {
    // 有token的情况下
    if (to.path === '/login') {
      next('/')
    } else {
      next()
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

//路由后置守卫
router.afterEach(() => {
  nprogress.done()
})
