import request from '@/utils/request'
// 获取销售图表数据
export function getSalesStatistics(params) {
  return request({
    url: '/crm/analyse/salesStatistics',
    method: 'get',
    params
  })
}
// 获取表格数据
export function getSalesStatisticsTable(params) {
  return request({
    url: '/crm/analyseData/sale',
    method: 'get',
    params
  })
}
