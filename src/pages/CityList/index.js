/**
 * 城市列表
 */

import React, { Component } from 'react'
import { getCityList } from '../../utils/api/city'

class CityList extends Component {
  componentDidMount() {
    this.getCityListData()
  }
  // 处理数据 => 做列表渲染
  // 1、创建 formatCities 方法
  // 2、定义变量 =》
  // 按拼音首字母归类的城市数据 => cityList = {}
  // 所有城市首字母数据 => cityIndex = []
  // 3、遍历后台返回数据 => 利用对象的属性不能相同的特点
  // 4、通过Object.keys(cityList) => 获取所有城市首字母数组
  // 格式化城市列表数据
  formatCities = (data) => {
    // 城市归类的对象
    let cityList = {}, cityIndex = []
    data.forEach((item) => {
      // 数组排重 截取城市的拼音首字母
      const first = item.short.slice(0, 1)
      // 按首字母归类 => 判断对象中是否存在某个属性
      if (!(first in cityList)) {
        // 没有这个首字母的 key (城市)
        cityList[first] = [item]
      } else {
        // 对象里边已经包含这个首字母 新增 => 按拼音首字母归类城市
        cityList[first].push(item)
      }
    })
    // 取出所有的拼音首字母组成新的数组
    cityIndex = Object.keys(cityList).sort()
    return {
      cityIndex,
      cityList
    }
  }

  // 获取城市列表所需数据
  getCityListData = async () => {
    const res = await getCityList()
    const { cityIndex,cityList } = this.formatCities(res.data)
    console.log(cityList)
  }

  render() {
    return <div>CityList</div>
  }
}

export default CityList
