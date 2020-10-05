/**
 * 城市列表
 */

import React, { Component } from 'react'
import { getCityList, getHotCity } from '../../utils/api/city'
import { getCurrentCity, setLocalData, CURR_CITY } from '../../utils/index'

// 导入列表组件库
import { AutoSizer, List } from 'react-virtualized'
import { NavBar, Icon, Toast } from 'antd-mobile'
import './index.scss'

class CityList extends Component {
  state = {
    // 城市列表的索引数据
    cityIndex: [],
    // 城市归类的数据
    cityList: {},
    // 当前位置的索引 => 激活索引样式状态
    activeIndex: 0,
  }

  componentDidMount() {
    this.getCityListData()
    // 获取list组件的实例
    // 创建ref对象 => 组件上创建ref对象
    this.listRef = React.createRef()
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
  formatKey = (key, isIndex) => {
    switch (key) {
      case 'curr':
        return isIndex ? '当' : '当前城市'
      case 'hot':
        return isIndex ? '热' : '热门城市'
      // 其他的 key 转为大写
      default:
        return key.toUpperCase()
    }
  }

  // 选择和切换城市
  switchCity = (item) => {
    // 有数据的城市
    const hasData = ['北京', '上海', '广州', '深圳']
    if (hasData.includes(item.label)) {
      // 更新本地存储当前城市数据
      setLocalData(CURR_CITY, JSON.stringify(item))
      this.props.history.goBack()
    } else {
      // 提示无数据
      Toast.info('该城市暂无房源数据', 2)
    }
  }

  // 渲染列表行 (cityListItem)
  rowRenderer = ({ key, index, style }) => {
    const { cityIndex, cityList } = this.state
    // 获取归类的索引值 key
    const letter = cityIndex[index]
    // 根据 key 获取归类的城市
    const cityListItem = cityList[letter]
    return (
      <div key={key} style={style} className="city-item">
        {/* 标题 */}
        <div className="title">{this.formatKey(letter)}</div>
        {/* 可能是多个 => 归类的城市 */}
        {cityListItem.map((item) => (
          // 绑定事件传参数 => 函数套函数
          <div
            className="name"
            key={item.value}
            onClick={() => this.switchCity(item)}
          >
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
    const cityListItem = cityList[letter]
    // 根据每行归类的城市个数 => 动态计算行高 => title高度 + 城市高度*城市个数
    const cityListHeight = 36 + 50 * cityListItem.length
    return cityListHeight
  }

  // 渲染右侧索引
  renderCityIndex = () => {
    const { cityIndex, activeIndex } = this.state
    return cityIndex.map((item, index) => {
      return (
        <li key={item} className="city-index-item">
          <span
            className={activeIndex === index ? 'index-active' : ''}
            onClick={() => {
              this.listRef.current.scrollToRow(index)
            }}
          >
            {this.formatKey(item, true)}
          </span>
        </li>
      )
    })
  }

  // 滚动列表触发(每次重新渲染列表后都会触发)
  onRowsRendered = ({ startIndex }) => {
    // 获取当前滚动到的位置索引startIndex
    // 更新activeIndex
    if (this.state.activeIndex !== startIndex) {
      this.setState({
        activeIndex: startIndex,
      })
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
              ref={this.listRef}
              width={width}
              height={height}
              // 设置scrollToAlignment="start"属性 => 定位时始终将行与列表顶部对齐
              scrollToAlignment="start"
              onRowsRendered={this.onRowsRendered}
              rowCount={this.state.cityIndex.length}
              rowHeight={this.calcRowHeight}
              rowRenderer={this.rowRenderer}
            />
          )}
        </AutoSizer>
        {/* 右侧索引列表 */}
        <ul className="city-index">{this.renderCityIndex()}</ul>
      </div>
    )
  }
}

export default CityList
