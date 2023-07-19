import request from '@/utils/request'

// 获取角色列表
export function getRoleList() {
  return request({
    url: '/park/sys/role',
    method: 'GET'
  })
}

// 查询所有功能权限(树形)
export function getFunctionTree() {
  return request({
    url: '/park/sys/permision/all/tree',
    method: 'GET'
  })
}

// 查询当前角色详情-权限和分配人数
export function getRoleDetail(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: 'GET'
  })
}

// 角色关联的用户列表
export function getRoleUserList(id) {
  return request({
    url: `/park/sys/roleUser/${id}`,
    method: 'GET'
  })
}

// 删除角色
export function deleteRole(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: 'DELETE'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/park/sys/role',
    method: 'POST',
    data
  })
}

// 查询当前角色详情-权限和分配人数
export function updateRole(id) {
  return request({
    url: `/park/sys/role/${id}`,
    method: 'GET'
  })
}

// 修改角色
export function editRole(data) {
  return request({
    url: '/park/sys/role',
    method: 'PUT',
    data
  })
}
