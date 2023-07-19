import request from '@/utils/request'
//获取字典管理列表rows
export const getDictionary = (params) => {
  return request({
    url: '/crm/system/dict/page',
    params
  })
}
//删除字典
export const delDictionary = (params) => {
  return request({
    url: '/crm/system/dict',
    method: 'DELETE',
    params
  })
}
//新增
export const addDictionary = (data) => {
  return request({
    url: '/crm/system/dict',
    method: 'POST',
    data
  })
}
//编辑
export const editDictionary = (data) => {
  return request({
    url: '/crm/system/dict',
    method: 'PUT',
    data
  })
} //导出
export const deriveDictionary = () => {
  return request({
    url: '/crm/system/dict/export/excel'
  })
}
