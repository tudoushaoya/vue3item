import request from '@/utils/request'
//获取楼宇列表
export function getBuilding(params) {
  return request({
    url: '/park/building',
    params
  })
}
//删除楼宇
export function delBuilding(id) {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}
//楼宇详情查询
export function getBuilDetailById(id) {
  return request({
    url: `/park/building/${id}`
  })
}
//新增楼宇
export function addBuilding(data) {
  return request({
    url: '/park/building',
    method: 'POST',
    data
  })
}
//编辑楼宇
export function editBuilding(data) {
  return request({
    url: '/park/building',
    method: 'Put',
    data
  })
}
