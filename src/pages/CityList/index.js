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

class CityList extends Component {
  state = {
    // 城市列表的索引数据
    cityIndex: [],
    // 城市归类的数据
    cityList: {},
  }

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
    let cityIndex = [],
      cityList = {}
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
        // 响应式
        this.setState({
          cityIndex,
          cityList,
        })
      }
    }
  }
  
  // 格式化 key
  formatKey = (key) => {
    switch (key) {
      case 'curr':
        return '当前城市'
      case 'hot':
        return '热门城市'
      // 其他的 key 转为大写
      default:
        return key.toUpperCase()
    }
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    const { cityIndex, cityList } = this.state
    // 获取归类的索引值 key
    const letter = cityIndex[index]
    // 根据 key 获取归类的城市
    const cityListData = cityList[letter]
    return (
      <div key={key} style={style} className="city-item">
        {/* 标题 */}
        <div className="title">{this.formatKey(letter)}</div>
        {/* 可能是多个 => 归类的城市 */}
        {cityListData.map((item) => (
          <div className="name" key={item.value}>
            {item.label}
          </div>
        ))}
      </div>
    )
  }

  // 计算行高
  calcRowHeight = ({ index }) => {
    const { cityIndex, cityList } = this.state
    // 获取归类的索引值 key
    const letter = cityIndex[index]
    // 根据 key 获取归类的城市
    const cityListData = cityList[letter]
    // 根据每行归类的城市个数 => 动态计算行高 => title高度 + 城市高度*城市个数
    const cityListHeight = 36 + 50*cityListData.length 
    return cityListHeight
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
              width={width}
              height={height}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
      </div>
    )
  }
}

export default CityList
