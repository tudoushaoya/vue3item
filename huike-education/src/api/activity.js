import request from '@/utils/request'

//获取活动列表
export function getActivityData(params) {
  return request({
    url: '/crm/activity/list',
    method: 'get',
    params
  })
}

//新增活动
export const addActivityData = (data) => {
  return request({
    url: '/crm/activity',
    method: 'post',
    data
  })
}
//修改活动
export function updateActivity(data) {
  return request({
    url: '/crm/activity',
    method: 'put',
    data
  })
}

//删除活动
export function deleteActivity(params) {
  return request({
    url: '/crm/activity',
    method: 'delete',
    params
  })
}

//获取活动详情
export function getActivityDetail(id) {
  return request({
    url: `/crm/activity/${id}`,
    method: 'get'
  })
}

//获取活动类型
export function getActivityType() {
  return request({
    url: '/crm/activity/type',
    method: 'get'
  })
}

// 获取渠道来源
export function getChannelSource(dictType) {
  return request({
    url: `/crm/system/dictData/${dictType}`,
    method: 'get'
  })
}
