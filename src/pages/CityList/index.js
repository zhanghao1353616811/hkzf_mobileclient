/**
 * 城市列表
 */

import React, { Component } from 'react'
import { getCityList, getHotCity } from '../../utils/api/city'
import { getCurrentCity } from '../../utils/index'
// 导入列表组件库
import { AutoSizer, List } from 'react-virtualized'
import { NavBar, Icon } from 'antd-mobile'
import './index.scss'

const list = Array.from(new Array(100)).map((item, index) => index)

class CityList extends Component {
  componentDidMount() {
    this.getCityListData()
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    return (
      <div key={key} style={style}>
        {/* 渲染数据 */}
        {list[index]}
      </div>
    )
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
    let cityList = {},
      cityIndex = []
    data.forEach((item) => {
      // 数组排重 截取城市的拼音首字母
      const first = item.short.slice(0, 1)
      // 按首字母归类 => 判断对象中是否存在某个属性
      if (!cityList[first]) {
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
      cityList,
    }
  }

  // 获取城市列表数据
  getCityListData = async () => {
    const { status, data } = await getCityList()
    if (status === 200) {
      const { cityIndex, cityList } = this.formatCities(data)
      // 获取热门城市 => 加到处理完的数据里面
      // 结构 => 变量 : 别名
      const { status: hotStatus, data: hot } = await getHotCity()
      if (hotStatus === 200) {
        // 加入热门城市数据
        cityIndex.unshift('hot')
        // 加入热门城市 key
        cityList['hot'] = hot
        // 加入当前城市数据
        const res = await getCurrentCity()
        cityList['curr'] = [res]
        // 加入当前城市 key
        cityIndex.unshift('curr')
      }
      console.log(cityList)
    }
  }

  render() {
    return (
      <div className="cityList">
        {/* 导航返回 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          城市选择
        </NavBar>
        {/* 城市列表 */}
        <AutoSizer>
          {({ height, width }) => (
            // children子组件
            <List
              height={height}
              rowCount={list.length}
              rowHeight={20}
              rowRenderer={this.rowRenderer}
              width={width}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}

export default CityList
