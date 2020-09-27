/**
 * 城市所有后端接口
 */

import axios from '../../axios'

// 获取城市信息
 export function getCityInfo(name) {
    //  返回一个Promise对象
     return axios.get('/area/info', {
         params: {
             name
         }
     })

 }