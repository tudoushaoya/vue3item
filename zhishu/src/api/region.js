import request from '@/utils/request'

// 获取列表
export function getRegionList(params) {
  return request({
    url: '/parking/area/list',
    method: 'get',
    params
  })
}
// 删除
export function deleteRegion(id) {
  return request({
    url: `/parking/area/${id}`,
    method: 'delete'
  })
}
// 添加
export function addRegion(data) {
  return request({
    url: '/parking/area',
    method: 'post',
    data
  })
}

// 编辑
export function editRegion(data) {
  return request({
    url: '/parking/area',
    method: 'put',
    data
  })
}
