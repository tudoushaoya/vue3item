import request from '@/utils/request'

// 获取账单列表
export function getPropertyList(params) {
  return request({
    url: '/park/propertyfee',
    method: 'get',
    params
  })
}
// 删除账单
export function deleteProperty(id) {
  return request({
    url: `park/propertyfee/${id}`,
    method: 'delete'
  })
}
// 添加账单
export function addProperty(data) {
  return request({
    url: '/park/propertyfee',
    method: 'post',
    data
  })
}
// 选择租户列表
export function getTenantList() {
  return request({
    url: 'park/all/enterprise',
    method: 'get'
  })
}
// 选择楼宇列表
export function getBuildingList() {
  return request({
    url: 'park/all/building',
    method: 'get'
  })
}
// 查看详细信息
export function getPropertyDetail(id) {
  return request({
    url: `park/propertyfee/${id}`,
    method: 'get'
  })
}
