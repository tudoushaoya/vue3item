import request from '@/utils/request'
//登录
export function getLogin(data) {
  return request({
    url: '/crm/employee/login',
    method: 'post',
    data
  })
}

//获取验证码
export function getCode(data) {
  return request({
    url: 'crm/utils/codeImg',
    method: 'get',
    data,
    responseType: 'arraybuffer'
  })
}
