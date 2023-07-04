import request from '@/utils/request'
// 工作台-基础信息查询
export const getWorkbenchBaseInfo = () => {
  return request({
    url: '/home/workbench/info'
  })
}

// 临期合同查询
export const getWorkbenchRentInfo = () => {
  return request({
    url: '/home/workbench/rentInfo'
  })
}
