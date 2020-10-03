/**
 * 城市所有后端接口
 */

import axios from '../../axios'

// 获取当前城市详细信息
export function getCityInfo(name) {
  return axios.get('/area/info', {
    params: {
      name
    }
  })
}

// 获取城市列表数据
export function getCityList(level=1) {
  return axios.get('/area/city', {
    params: {
      level
    },
  })
}

// 获取热门城市数据
export function getHotCity() {
    return axios.get('/area/hot')
  }
