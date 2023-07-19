import request from '@/utils/request'
// 获取员工简单列表
export function getEmployeeSimple(params) {
  return request({
    url: 'park/sys/user',
    method: 'get',
    params
  })
}
// 删除员工
export function delEmployee(id) {
  return request({
    url: `park/sys/user/${id}`,
    method: 'delete'
  })
}
// 重置密码
export function resetPassword(data) {
  return request({
    url: 'park/sys/user/resetPwd',
    method: 'put',
    data
  })
}
// 获取角色列表
export function getRoleList() {
  return request({
    url: 'park/sys/role',
    method: 'get'
  })
}
// 添加员工
export function addEmployee(data) {
  return request({
    url: 'park/sys/user',
    method: 'post',
    data
  })
}
// 编辑员工
export function updateEmployee(data) {
  return request({
    url: 'park/sys/user',
    method: 'put',
    data
  })
}
