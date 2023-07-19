import request from '@/utils/request'

// 获取合同列表
export function getContractListApi(params) {
  return request({
    url: '/crm/contract/findList',
    method: 'GET',
    params
  })
}

// 查询学科
export function getSubjectListApi() {
  return request({
    url: '/crm/course/type',
    method: 'GET'
  })
}

// 跟据学科查课程
export function getCourseListApi(id) {
  return request({
    url: `/crm/course/course?courseId=${id}`,
    method: 'GET'
  })
}

// 上传合同
export function uploadContractApi(data) {
  return request({
    url: '/crm/contract/upload',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 上传信息
export function uploadInfoApi(data) {
  return request({
    url: '/crm/contract/newly',
    method: 'POST',
    data
  })
}

// 获取合同详情
export function getContractDetailApi(id) {
  return request({
    url: `/crm/contract/findById/${id}`,
    method: 'GET'
  })
}

// 获取所有课程
export function getAllCourseApi() {
  return request({
    url: '/crm/course/all',
    method: 'GET'
  })
}
