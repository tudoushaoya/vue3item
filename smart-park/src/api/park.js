import request from '@/utils/request'

// 楼宇列表查询
export const getBuildList = (params) => {
  return request({
    url: '/park/building',
    method: 'GET',
    params
  })
}

// 楼宇详情查询
export const getBuildDetail = (id) => {
  return request({
    url: `/park/building/${id}`,
    method: 'GET'
  })
}

// 修改楼宇
export const updateBuild = (data) => {
  return request({
    url: `/park/building`,
    method: 'PUT',
    data
  })
}

// 新增楼宇
export const addBuild = (data) => {
  return request({
    url: `/park/building`,
    method: 'POST',
    data
  })
}

// 删除楼宇
export const deleteBuild = (id) => {
  return request({
    url: `/park/building/${id}`,
    method: 'DELETE'
  })
}

// 企业列表查询
export const getEnterpriseList = (params) => {
  return request({
    url: '/park/enterprise',
    method: 'GET',
    params
  })
}
