import request from '@/utils/request'
//获取岗位管理列表
export const getPostList = (params) => {
  return request({
    url: '/crm/system/post/page',
    params
  })
}
//删除
export const delPost = (id) => {
  return request({
    url: `/crm/system/post/${id}`,
    method: 'DELETE'
  })
}
//添加
export const addPost = (data) => {
  return request({
    url: '/crm/system/post',
    method: 'POST',
    data
  })
}
//编辑
export const editPost = (data) => {
  return request({
    url: '/crm/system/post',
    method: 'PUT',
    data
  })
}
