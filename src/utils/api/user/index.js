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
