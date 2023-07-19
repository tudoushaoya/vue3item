import request from '@/utils/request'

// 获取工作台数据
export function getWorkbenchData() {
  return request({
    url: '/home/workbench/info',
    method: 'GET'
  })
}
