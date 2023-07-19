import request from '@/utils/request'

// 默认线索列表
export function getClueListApi(params) {
  return request({
    url: '/crm/v1/clue/load',
    method: 'GET',
    params
  })
}

// 归属人列表
export function getOwnerListApi() {
  return request({
    url: '/crm/v1/clue/belong_persons',
    method: 'GET'
  })
}

// 批量分配的部门列表
export function getDeptListApi() {
  return request({
    url: '/crm/v1/clue/allocate_dept',
    method: 'GET'
  })
}

// 批量分配的人员列表
export function getPersonListApi(id) {
  return request({
    url: `/crm/v1/clue/dept_employee/${id}`,
    method: 'GET'
  })
}

// 批量分配
export function distributeApi(data) {
  return request({
    url: '/crm/v1/clue/batch_allocation',
    method: 'PUT',
    data
  })
}

// 添加线索
export function addClueApi(data) {
  return request({
    url: '/crm/v1/clue/save',
    method: 'POST',
    data
  })
}

// 下载excel模板
export function downloadExcelApi() {
  return request({
    url: '/crm/v1/clue/clue_excel',
    method: 'GET',
    responseType: 'blob'
  })
}

// 批量添加线索(excel)
export function addClueExcelApi(data) {
  return request({
    url: '/crm/v1/clue/clue_upload',
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 验证excel数据
export function checkExcelApi() {
  return request({
    url: '/crm/v1/clue/verify_result',
    method: 'POST'
  })
}

// 删除上传的excel-------弃用
// export function deleteExcelApi() {
//   return request({
//     url: '/crm/v1/clue/remove_data',
//     method: 'DELETE'
//   })
// }

// 获取验证结果
export function getCheckResultApi() {
  return request({
    url: '/crm/v1/clue/upload_result',
    method: 'GET',
    responseType: 'blob'
  })
}

// 确认保存到数据库
export function saveExcelApi() {
  return request({
    url: '/crm/v1/clue/batch_save',
    method: 'POST'
  })
}

// 根据线索id查询线索详情
export function getClueDetailApi(id) {
  return request({
    url: `/crm/v1/clue/${id}`,
    method: 'GET'
  })
}

// 线索详情页添加跟进
export function addFollowApi(data) {
  return request({
    url: '/crm/v1/clue/follow',
    method: 'POST',
    data
  })
}

// 转伪线索
export function changeClueApi(data) {
  return request({
    url: '/crm/v1/clue/pseudo',
    method: 'POST',
    data
  })
}

// 转商机
export function changeBusinessApi(id) {
  return request({
    url: `/crm/v1/clue/client_save/${id}`,
    method: 'POST'
  })
}

// 获取学科
export function getSubjectApi() {
  return request({
    url: '/crm/v1/clue/dict_subject',
    method: 'GET'
  })
}

// 线索池分页查询
export function getCluePoolListApi(params) {
  return request({
    url: '/crm/v1/clue/abandon_clue',
    method: 'GET',
    params
  })
}

// 线索池捞取 --------------todo
export function getCluePoolApi(ids) {
  return request({
    url: `/crm/v1/clue/again_clue?ids=${ids}`,
    method: 'PUT'
  })
}
