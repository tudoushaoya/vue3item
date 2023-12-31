import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
// 基地址：https://api-hmzs.itheima.net/v1
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL: 'https://api-hmzs.itheima.net/api8',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 10000 // request timeout
})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
  // 在发送请求之前做些什么
  const token = store.getters.token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, function(error) {
  // 对请求错误做些什么
  console.log(error)
  return Promise.reject(error)
})

// 添加响应拦截器
service.interceptors.response.use(function(response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  return response
}, function(error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  if (error.response.status === 400) {
    Message.error(error.response.data.msg)
  }

  return Promise.reject(error)
})
export default service
