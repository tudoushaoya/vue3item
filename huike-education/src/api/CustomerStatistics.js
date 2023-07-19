import request from '@/utils/request'
// 获取客户统计图表
export function getCustomerStatistics(params) {
  return request({
    url: '/crm/analyse/customerStatistics',
    method: 'get',
    params
  })
}
// 获取学科统计图表
export function getSubjectStatistics(params) {
  return request({
    url: '/crm/analyse/customerSubject',
    method: 'get',
    params
  })
}
// 获取表格数据
export function getTableData(params) {
  return request({
    url: '/crm/analyseData/customer',
    method: 'get',
    params
  })
}
// 获取渠道来源下拉框数据
export function getChannelList(dictType) {
  return request({
    url: `/crm/system/dictData/${dictType}`,
    method: 'get'
  })
}
