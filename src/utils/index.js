/**
 * 定义: 公共方法(复用)
 */

import { getCityInfo } from './api/city'

// 复用
const CURR_CITY = 'hkzf_city', TOKEN = 'hkzf_token'

// 本地存储
export const getLocalData = (key) => {
  return localStorage.getItem(key)
}
export const setLocalData = (key, val) => {
  return localStorage.setItem(key, val)
}
export const removeLocalData = (key) => {
  return localStorage.removeItem(key)
}

// Promise本身是同步的, 但它的 then 方法和 catch 方法是异步的
// async-await是异步的
// 同步代码不会等异步回调 return就会执行过去 你就获取不到数据

// 定位当前城市
// 1、如果没有本都数据 => 利用百度地图 API获取当前城市 => 发送请求获取城市详细信息 => 并保存本地数据 => Promise返回城市数据
// 2、如果有本地数据 => 直接 Promise.resolve (数据)返回
export function getCurrentCity() {
  const currentCity = JSON.parse(getLocalData(CURR_CITY))
  if (!currentCity) {
    return new Promise((resolve, reject) => {
      // 定位当前城市 (IP定位)
      let myCity = new window.BMapGL.LocalCity()
      // 获取定位信息 => 怎么获取? => 回调函数 => 获取定位数据
      // async -await 异步
      myCity.get(async (result) => {
        // 百度地图返回的城市名字
        const cityName = result.name
        // 调用后端接口获取当前城市详细信息
        const { status, data } = await getCityInfo(cityName)
        if (status === 200) {
          // 存储到本地? => 获取的数据怎么给外边用? => 通过resolve传递数据 => 第一次存储到本地 => 字符串
          setLocalData(CURR_CITY, JSON.stringify(data))
          resolve(data)
        } else {
          reject('error')
        }
      })
    })
  } else {
    return Promise.resolve(currentCity)
  }
}

export { CURR_CITY, TOKEN }
