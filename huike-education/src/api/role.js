import request from '@/utils/request'
//角色分页列表
export function getRoleList(params) {
  return request({
    url: '/crm/system/role/page',
    method: 'get',
    params
  })
}
