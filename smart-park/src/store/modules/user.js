
import { getToken, removeToken, setToken } from '@/utils/auth'
import { login } from '@/api/user'
export default {
  namespaced: true,
  state: () => ({
    token: getToken() || ''
  }),
  getters: {},
  mutations: {
    setToken(state, data) {
      state.token = data
      setToken(data)
    }

  },
  actions: {
    async login(ctx, data) {
      const res = await login(data)
      ctx.commit('setToken', res.data.data.token)
    },
    async logout(ctx) {
      ctx.commit('setToken', '')
      removeToken()
    }
  }
}
