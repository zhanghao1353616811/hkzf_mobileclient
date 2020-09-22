/**
 * 首页所有后端接口
 */

 import axios from '../../axios'

//  获取轮播图数据
 export function getSwiper() {
    //  返回一个Promise对象
     return axios.get('/home/swiper')
 }