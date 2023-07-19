import request from '@/utils/request'

// 获取月卡列表信息
export const getList = (params) => {
  return request({
    url: '/parking/card/list',
    params
  })
}

// 获取月卡占有率
export const getRate = () => {
  return request({
    url: '/parking/card/proportion'
  })
}

// 删除月卡
export const deleteCard = (ids) => {
  return request({
    url: `/parking/card/${ids}`,
    method: 'delete'
  })
}
// 添加月卡
export const addCard = (data) => {
  return request({
    url: '/parking/card',
    method: 'post',
    data
  })
}

// 月卡续费
export const renewCard = (data) => {
  return request({
    url: '/parking/card/recharge',
    method: 'post',
    data
  })
}
// 月卡详情
export const getDetail = (id) => {
  return request({
    url: `/parking/card/${id}`
  })
}
//  查看月卡详情
export const viewDetail = (id) => {
  return request({
    url: `/parking/card/${id}`
  })
}

// 获取编辑页面的月卡详情
export const getEditDetail = (id) => {
  return request({
    url: `/parking/card/detail/${id}`
  })
}

// 编辑月卡
export const editCard = (data) => {
  return request({
    url: '/parking/card/edit',
    method: 'put',
    data
  })
}