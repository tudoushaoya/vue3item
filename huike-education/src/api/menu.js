import request from '@/utils/request'

//获取菜单列表
export const getMenuList = (params) => {
  return request({
    url: '/crm/system/menu/page',
    params
  })
}

// 查询菜单
export const getMenu = () => {
  return request({
    url: `/crm/system/menu/list`
  })
}
