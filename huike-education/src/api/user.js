import request from '@/utils/request'
// 获取列表

export const getList = (params) => {
  return request({
    url: 'crm/system/user/page',
    params
  })
}

// 添加用户
export const addUser = (data) => {
  return request({
    url: 'crm/system/user',
    method: 'post',
    data
  })
}
// 回显用户
export const editUserId = (id) => {
  return request({
    url: `crm/system/user/${id}`
  })
}

// 删除用户
export const deleteUser = (id) => {
  return request({
    url: `crm/system/user/${id}`,
    method: 'delete'
  })
}
// 编辑用户
export const editUser = (data) => {
  return request({
    url: `crm/system/user`,
    method: 'put',
    data
  })
}

// 重置密码
export const resetPassword = (data) => {
  return request({
    url: `crm/system/user/id`,
    method: 'put',
    data
  })
}

// 上传excel文件
export const uploadExcel = (data) => {
  return request({
    url: `/crm/system/user/upload`,
    method: 'post',
    data,
    responseType: 'blob' // 二进制文件流
  })
}

//  部门
export const getDept = () => {
  return request({
    url: `/crm/system/dept/page`
  })
}
