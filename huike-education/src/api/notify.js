import request from '@/utils/request'

export const getList = (params) => {
  return request({
    url: '/crm/system/notice/page',
    params
  })
}

// 查看详情
export const getDetailId = (noticeId) => {
  return request({
    url: `/crm/system/notice/${noticeId}`
  })
}
