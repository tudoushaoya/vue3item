import { message } from 'ant-design-vue'
import axios from 'axios'
import useToken from '@/stores/token.js'
import router from '@/router/index.js'
const service = axios.create({
  baseURL: '/api',
  timeout: 10000
})

service.interceptors.request.use(
  (config) => {
    const { getToken } = useToken()
    if (getToken()) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  (response) => {
    // console.log(response)
    return response.data
  },
  (error) => {
    if (error.response.status === 400) {
      message.error(error.response.data.msg)
    }
    if (error.response.status === 401) {
      message.error('登录过期，请重新登录')
      const { removeToken } = useToken()
      removeToken()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default service
