import Mock from 'mockjs'

const rules = [
  {
    url: '/crm/v1/clue/load',
    method: 'POST',
    response: () => {
      let data = []
      for (let i = 0; i < 10; i++) {
        data.push(
          Mock.mock({
            id: '@increment',
            name: '@cname',
            phone: /^1[385][1-9]\d{8}/,
            'status|1': ['未联系', '已联系', '已报名', '已放弃'],
            'source|1': ['线上', '线下'],
            'course|1': ['前端', '后端', '全栈', 'UI', '产品', '运营'],
            'channel|1': [
              '百度',
              '360',
              '搜狗',
              '头条',
              '抖音',
              '微博',
              '朋友圈',
              'QQ',
              '微信',
              '知乎',
              '豆瓣',
              '其他'
            ]
          })
        )
      }
      return {
        code: 200,
        data,
        message: 'success'
      }
    }
  }
]

export default rules
