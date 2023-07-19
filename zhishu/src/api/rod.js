import request from '@/utils/request'

// 获取列表信息
export const getList = (params) => {
  return request({
    url: '/pole/info/list',
    params
  })
}

// 删除接口
export const itemDel = (ids) => {
  console.log(ids)
  return request({
    url: `/pole/info/${ids}`,
    method: 'Delete'
  })
}

// 新增接口
export const itemAdd = (data) => {
  return request({
    url: '/pole/info',
    method: 'post',
    data
  })
}

// 编辑接口
export const itemEdit = (data) => {
  return request({
    url: '/pole/info',
    method: 'put',
    data
  })
}