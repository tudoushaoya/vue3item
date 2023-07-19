import Mock from 'mockjs'

const rules = [
  {
    url: 'http://127.0.0.1:5173/login/api',
    method: 'post',
    timeout: 1000,
    response: () => {
      Mock.mock({
        username: '@cname',
        password: '@word(6, 12)',
        code: '@integer(1, 10)'
      })
      return {
        code: 1000,
        message: '登录成功'
      }
    }
  }
]
export default rules
