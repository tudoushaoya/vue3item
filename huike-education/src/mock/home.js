import Mock from 'mockjs'
const rules = [
  {
    url: '/api/crm/homePage/ranking/cule',
    method: 'get',
    timeout: 1000,
    response: () => {
      const data = []
      for (let i = 0; i <= 7; i++) {
        data.push(
          Mock.mock({
            name: '@cname',
            channel: '@integer(1)',
            dept: '@word(3, 5)',
            validCuleCount: '@integer(1, 100)',
            culeTransferRate: '@integer(1, 100)'
          })
        )
      }
      return {
        code: 1000,
        message: '获取成功',
        data: {
          records: data,
          total: 100
        }
      }
    }
  }
]
export default rules
