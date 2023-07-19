import request from '@/utils/request'
// 获取渠道统计图表
export function getChannelStatistics(params) {
  return request({
    url: '/crm/analyse/channelStatus',
    method: 'get',
    params
  })
}
// 获取渠道统计列表
export function getChannelStatisticsList(params) {
  return request({
    url: '/crm/analyseData/channel',
    method: 'get',
    params
  })
}
