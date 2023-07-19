import request from '@/utils/request'
export const getParkingListApi = (params) => {
  return request({ url: '/parking/payment/list', method: 'GET', params })
}

export const getParkingRulesApi = () => {
  return request({ url: '/parking/rule/list', method: 'GET' })
}

// 添加计费规则
export const addParkingRulesApi = (data) => {
  return request({ url: '/parking/rule', method: 'POST', data })
}

// 修改计费规则
export const editParkingRulesApi = (data) => {
  return request({ url: '/parking/rule', method: 'PUT', data })
}

// 获取具体的计费规则
export const getParkingRulesDetailApi = (id) => {
  return request({ url: `/parking/rule/${id}`, method: 'GET' })
}

// 删除计费规则
export const deleteParkingRulesApi = (id) => {
  return request({ url: `/parking/rule/${id}`, method: 'DELETE' })
}
