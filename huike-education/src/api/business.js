import request from '@/utils/request'

// 获取业务列表
export function getBusinessList(params) {
  return request({
    url: '/crm/niche/load',
    method: 'GET',
    params
  })
}

// 商机状态和归属回显
export function getBusinessStatus() {
  return request({
    url: '/crm/niche/home_echo',
    method: 'GET'
  })
}

// 新建商机
export function addBusiness(data) {
  return request({
    url: '/crm/niche/save',
    method: 'POST',
    data
  })
}

// 新建商机回显字典
export function getBusinessDict() {
  return request({
    url: '/crm/niche/user_dictionaries',
    method: 'GET'
  })
}

// 回显客户信息
export function getCustomerInfo(id) {
  return request({
    url: `/crm/niche_up/load/${id}`,
    method: 'GET'
  })
}

// 省市区回显
export function getAreaList() {
  return request({
    url: '/crm/common/region_echo',
    method: 'GET'
  })
}

// 部门和员工回显
export function getDeptAndUser() {
  return request({
    url: '/crm/common/dept_employee_echo',
    method: 'GET'
  })
}

// 分配商机
export function assignBusiness(data) {
  return request({
    url: '/crm/niche/allocation/',
    method: 'PUT',
    data
  })
}

// 获取商机部门和员工
export function getBusinessDeptAndUser() {
  return request({
    url: '/crm/system/dept/page',
    method: 'GET'
  })
}

// 查询部门下的员工
export function getDeptUserList(id) {
  return request({
    url: `/crm/system/dept/getUser/${id}`,
    method: 'GET'
  })
}

// 跟新跟进记录
export function updateFollowRecord(data) {
  return request({
    url: '/crm/niche_up/update',
    method: 'PUT',
    data
  })
}
