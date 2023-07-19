const KEY = 'huike-token'

export const getToken = () => localStorage.getItem(KEY)

export const setToken = (val) => {
  localStorage.setItem(KEY, val)
}

export const removeToken = () => localStorage.removeItem(KEY)
