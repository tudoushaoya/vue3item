import { defineStore } from 'pinia' //
import { ref } from 'vue'
const useToken = defineStore(
  'token',
  () => {
    const token = ref(null)
    const getToken = () => token.value
    const setToken = (val) => (token.value = val)
    const removeToken = () => (token.value = null)

    return { token, getToken, setToken, removeToken }
  },
  {
    persist: true
  }
)

export default useToken
