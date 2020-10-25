/**
 * 全局 axios
 */
import axios from 'axios' //  导入axios
import { Toast } from 'antd-mobile'
import { getToken } from '../utils/index'

// 后端接口基础路径
const BASE_URL = 'http://api-haoke-dev.itheima.net'

// 创建全局axios实例
const axios_instance = axios.create({
  baseURL: BASE_URL,
})

// 请求拦截器
axios_instance.interceptors.request.use(
  function (config) {
    Toast.loading('加载中...', 0) // 加0秒 => 代表永久打开loading状态
    const { url, headers } = config
    // url.startsWith => 判断url地址是不是以 '/user' 开头
    if (url.startsWith('/user') && url !== '/user/login') {
      // 统一设置headers的token
      headers.authorization = getToken()
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios_instance.interceptors.response.use(
  function (response) {
    Toast.hide() // 请求成功后关闭loading
    //  返回所需求的数据格式
    const { body, status, description } = response.data
    // token过期强制跳转 我也不知道 react 怎么在js中跳转
    if (status === 400) {
      window.location.href='/login'
    }
    const data = {
      status,
      description,
      data: body,
    }
    return data
  },
  function (error) {
    console.log(error, 'error')
    return Promise.reject(error)
  }
)

export { BASE_URL }
export default axios_instance
