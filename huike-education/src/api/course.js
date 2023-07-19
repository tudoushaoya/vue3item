import request from '@/utils/request'

// 获取课程列表
export function getCourseList(params) {
  return request({
    url: '/crm/course/list',
    method: 'GET',
    params
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: '/crm/course',
    method: 'POST',
    data
  })
}

// 删除课程
export function deleteCourse(params) {
  return request({
    url: `/crm/course`,
    method: 'DELETE',
    params
  })
}

// 查询单个课程
export function getCourse(id) {
  return request({
    url: `/crm/course/${id}`,
    method: 'GET'
  })
}

// 更新课程
export function updateCourse(data) {
  return request({
    url: `/crm/course`,
    method: 'PUT',
    data
  })
}
