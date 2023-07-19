import request from '@/utils/request'

// 获取企业列表
export function getEnterpriseList(params) {
  return request({
    url: '/park/enterprise',
    method: 'get',
    params
  })
}

//获取企业展开行列表
export function getEnterpriseExpandList(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'get'
  })
}

//添加合同
export function addContract(data) {
  return request({
    url: '/park/enterprise/rent',
    method: 'post',
    data
  })
}

//获取可租赁楼宇
export function getBuildings() {
  return request({
    url: '/park/rent/building',
    method: 'get'
  })
}

//删除企业
export function deleteEnterprise(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'delete'
  })
}

//上传接口
export function uploadContractFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    data
  })
}

//获取行业
export function getIndustry() {
  return request({
    url: '/park/industry',
    method: 'get'
  })
}

//增加企业
export function addEnterprise(data) {
  return request({
    url: '/park/enterprise',
    method: 'post',
    data
  })
}

//查看企业
export function getEnterprise(id) {
  return request({
    url: `/park/enterprise/${id}`,
    method: 'get'
  })
}

//编辑企业
export function editEnterprise(data) {
  return request({
    url: '/park/enterprise',
    method: 'put',
    data
  })
}

//下载合同
export function downloadContract(id) {
  return request({
    url: `/download/${id}`,
    method: 'get',
    responseType: 'blob'
  })
}

//退租
export function quitRent(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'put'
  })
}

//删除合同
export function deleteContract(id) {
  return request({
    url: `/park/enterprise/rent/${id}`,
    method: 'delete'
  })
}
