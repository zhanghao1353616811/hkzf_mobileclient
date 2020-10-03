/**
 * 全局 axios
 */

//  导入axios
import axios from 'axios'
import { Toast } from 'antd-mobile'

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
    const {body, status, description} = response.data
    const data = {
        status,
        description,
        data: body
    }
    return data
  },
  function (error) {
    return Promise.reject(error)
  }
)

export { BASE_URL }
export default axios_instance