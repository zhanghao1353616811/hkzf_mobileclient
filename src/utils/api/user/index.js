/**
 * 用户后端接口
 */

import axios from '../../axios'

// 用户登录接口
export function login(data) {
  return axios.post('/user/login', data)
}

// 获取用户信息
export function getUserInfo() {
  return axios.get('/user')
}

// 用户登出接口
export function logout() {
  return axios.post('/user/logout')
}

// 房屋是否收藏接口
export function isFavorites(id) {
  return axios.get(`/user/favorites/${id}`)
}

// 添加收藏
export function addFavorites(id) {
  return axios.post(`/user/favorites/${id}`)
}

// 取消收藏
export function delFavorites(id) {
  return axios.delete(`/user/favorites/${id}`)
}

// 获取已发布房源
export const getUserHouses = () => {
  return axios.get('/user/houses')
}