import request from '@/utils/request'

// 楼宇列表查询
export const getBuildList = (params) => {
  return request({
    url: '/park/building',
    params
  })
}

// 楼宇详情查询
export const getBuildDetail = (id) => {
  return request({
    url: `/park/building/${id}`
  })
}

// 修改楼宇
export const updateBuild = (data) => {
  return request({
    url: `/park/building`,
    method: 'put',
    data
  })
}

// 新增楼宇
export const addBuild = (data) => {
  return request({
    url: `/park/building`,
    method: 'post',
    data
  })
}

// 删除楼宇
export const deleteBuild = (id) => {
  return request({
    url: `/park/building/${id}`,
    method: 'delete'
  })
}

