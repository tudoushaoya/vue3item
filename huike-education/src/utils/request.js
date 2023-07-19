import axios from 'axios'
import useToken from '@/stores/token.js'
import router from '@/router/index.js'
import { ElMessage } from 'element-plus'
const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    const { getToken } = useToken()
    if (getToken()) {
      config.headers.token = getToken()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    if (response.data.code === 401) {
      useToken().removeToken()
      ElMessage.error('登录过期，请重新登录')
      router.push('/login')
    }
    return response.data
  },

  (error) => {
    return Promise.reject(error)
  }
)

export default service
