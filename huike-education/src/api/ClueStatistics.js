import request from '@/utils/request'
// 获取线索统计列表
export function getClueStatisticsList(params) {
  return request({
    url: '/crm/analyse/clueStatus',
    method: 'get',
    params
  })
}
// 获取线索统计表格数据
export function getClueStatisticsTable(params) {
  return request({
    url: '/crm/analyseData/clue',
    method: 'get',
    params
  })
}
