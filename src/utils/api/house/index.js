/**
 * 房源所有后端接口
 */

import axios from '../../axios'

// 获取房源查询条件
export function getHouseCondition(id) {
  return axios.get('/houses/condition', {
    params: {
      id,
    },
  })
}

// 获取房源列表数据
export function getHouseList(id, data, start = 1, end = 20) {
  return axios.get('/houses', {
    params: {
      id,
      ...data,
      start,
      end,
    },
  })
}

// 获取房源详情数据
export function getHouseDetail(id) {
  return axios.get(`/houses/${id}`, {})
}

// 房屋图像上传
export function uploadHouseImg(formData) {
  return axios.post('/houses/image', formData)
}
