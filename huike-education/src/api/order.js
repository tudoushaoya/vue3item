import request from '@/utils/request'

//获取工单列表
export function getOrderList(params) {
  return request({
    url: '/crm/redeploy/list',
    method: 'get',
    params
  })
}

//获取工单详情
export function getOrderDetail(id) {
  return request({
    url: `/crm/redeploy/${id}`,
    method: 'get'
  })
}

//获取部门
export function getDepartments() {
  return request({
    url: '/crm/system/dept/page',
    method: 'get'
  })
}

//获取部门下的员工
export function getEmployees(deptId) {
  return request({
    url: `/crm/system/dept/getUser/${deptId}`,
    method: 'get'
  })
}

//分配、
export function assignOrder(params) {
  return request({
    url: 'crm/redeploy',
    method: 'put',
    params
  })
}
