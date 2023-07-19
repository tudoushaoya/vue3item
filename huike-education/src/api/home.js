import request from '@/utils/request'

//基础数据
export function getBaseData(params) {
  return request({
    url: '/crm/homePage/basicData',
    method: 'get',
    params
  })
}

//今日简报
export function getTodayBriefing() {
  return request({
    url: '/crm/homePage/todayBulletin',
    method: 'get'
  })
}

//代办事项
export function getTodoList() {
  return request({
    url: '/crm/homePage/matter',
    method: 'get'
  })
}

//销售漏斗
export function getSalesFunnel(params) {
  return request({
    url: '/crm/homePage/salesFunnel',
    method: 'get',
    params
  })
}

//线索转化龙湖池
export function getClueConversion(params) {
  return request({
    url: 'crm/homePage/ranking/clue',
    method: 'get',
    params
  })
}

//商机转化龙湖池
export function getBusinessConversion(params) {
  return request({
    url: '/crm/homePage/ranking/niche',
    method: 'get',
    params
  })
}
