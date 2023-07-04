import request from '@/utils/request'

export const login = (data) => {
  return request({
    url: '/park/login',
    method: 'POST',
    data
  })
}

// 获取用户下拉列表
export const getUserList = () => {
  return request({
    url: '/system/user/dropList'
  })
}

// 修改密码
export const updatePassword = (data) => {
  return request({
    url: '/park/profile/updatePwd',
    method: 'PUT',
    data
  })
}
