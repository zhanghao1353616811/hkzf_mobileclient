/**
 * 用户后端接口
 */

import axios from '../../axios'

// 登录接口
export function getUserLogin(data) {
    return axios.post('/user/login', data)
  }