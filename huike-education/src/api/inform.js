import request from '@/utils/request'

export function getInformList(params) {
  return request({
    url: '/crm/system/notice/page',
    method: 'get',
    params
  })
}
