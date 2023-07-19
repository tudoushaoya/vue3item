import request from '@/utils/request'
//获取部门列表
export const getSection = (params) => {
  return request({
    url: '/crm/system/dept/page',
    params
  })
}
//删除
export const delSection = (deptId) => {
  return request({
    url: `/crm/system/dept/${deptId}`,
    method: 'DELETE'
  })
}
//添加
export const addSection = (data) => {
  return request({
    url: '/crm/system/dept',
    method: 'POST',
    data
  })
}
//编辑
export const editSection = (data) => {
  return request({
    url: '/crm/system/dept',
    method: 'PUT',
    data
  })
}
