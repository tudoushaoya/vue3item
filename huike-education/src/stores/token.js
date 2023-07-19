import { defineStore } from 'pinia' //
import { ref } from 'vue'
const useToken = defineStore(
  'token',
  () => {
    const token = ref(null)
    const setToken = (val) => {
      token.value = val
    }
    const getToken = () => token.value
    const removeToken = () => {
      token.value = null
    }
    return { token, setToken, getToken, removeToken }
  },
  {
    persist: true // 可持久化的标记- 将我们的数据 持久化到前端缓存中
  }
)
export default useToken
