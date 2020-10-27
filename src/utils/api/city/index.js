/**
 * 城市所有后端接口
 */

import axios from '../../axios'

// 获取当前城市详细信息
export function getCityInfo(name) {
  return axios.get('/area/info', {
    params: {
      name,
    },
  })
}

// 获取城市列表数据
export function getCityList(level = 1) {
  return axios.get('/area/city', {
    params: {
      level,
    },
  })
}

// 获取热门城市数据
export function getHotCity() {
  return axios.get('/area/hot')
}

// 小区关键词查询
export function getCimmnotuyByKey(id, name) {
  return axios.get('/area/community', {
    params: {
      id,
      name,
    },
  })
}

// 根据传入不同的ID (城市ID => 区ID => 镇ID => 小区) 获取不同的地图房源数据
export function getHouseMap(id) {
  return axios.get('/area/map', {
    params: {
      id,
    },
  })
}
