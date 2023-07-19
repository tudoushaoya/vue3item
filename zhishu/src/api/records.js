import request from '@/utils/request'
//获取告警记录列表
export function getRecords(params) {
  return request({
    url: '/pole/warning/list',
    params
  })
}
//删除告警记录
export function delRecords(id) {
  return request({
    url: `/pole/warning/${id}`,
    method: 'DELETE'
  })
}
//查看告警详情
export function getAlarm(id) {
  return request({
    url: `/pole/warning/${id}`
  })
}
