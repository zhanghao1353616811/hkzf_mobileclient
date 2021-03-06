/**
 * 用户后端接口
 */

import axios from '../../axios'

// 用户登录接口
export function login(data) {
  return axios.post('/user/login', data)
}

// 用户注册接口
export function registe(data) {
  return axios.post('/user/registered', data)
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

// 查看已发布房源列表
export const getUserHouses = () => {
  return axios.get('/user/houses')
}

// 发布房源
export const getPubHouse = (data) => {
  return axios.post('/user/houses',data)
}
