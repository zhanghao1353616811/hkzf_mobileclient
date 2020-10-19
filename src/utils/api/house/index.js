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
export function getHouseList(id,data) {
  return axios.get('/houses', {
    params: {
      id,
      ...data
    },
  })
}