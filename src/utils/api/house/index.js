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
