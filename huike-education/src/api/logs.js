import request from '@/utils/request'
//获取日志列表
export const getLogs = (params) => {
  return request({
    url: '/crm/system/operLog/page',
    params
  })
}
//查询
export const getInquire = (id) => {
  return request({
    url: `/crm/system/operLog/${id}`
  })
}
