import axios from 'axios'
import { message as Msg } from 'ant-design-vue'
// 使用axios创建实例  new Vue()  createApp()

const serive = axios.create({
  // 初始化参数
  baseURL: '/api' //   /sys/login => /api/sys/login
}) // service和axios的功能一摸一样
// 请求拦截器
serive.interceptors.request.use()
// 响应拦截器- 数据获取到之后-  >then之前
// 1. 成功  2. 失败
serive.interceptors.response.use(
  (response) => {
    const { success, message, data } = response.data // axios默认加了一层data
    if (success) {
      // 表示执行成功
      return data // 返回需要的业务数据
    }
    // 提示消息
    Msg.error(message)
    // 报错
    return Promise.reject(new Error(message))
  },
  (error) => Promise.reject(error)
)
export default serive // 导出工具
