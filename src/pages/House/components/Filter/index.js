import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
// import FilterMore from '../FilterMore'

import styles from './index.module.css'

import { getHouseCondition } from '../../../../utils/api/house'
import { getCurrentCity } from '../../../../utils/index'

// 标题高亮状态(默认false)
const titleSelectedStatus = {
  area: false,
  mode: false,
  price: false,
  more: false,
}

export default class Filter extends Component {
  // 设置高亮显示的状态
  state = {
    titleSelectedStatus: { ...titleSelectedStatus },
    // 打开当前type状态
    openType: '',
  }

  componentDidMount() {
    this.getToHouseCondition()
  }

  // 过滤器title点击时触发的方法 (父组件)
  onTitleClick = (type) => {
    this.setState({
      titleSelectedStatus: {
        ...titleSelectedStatus,
        // ES6对象的特性 key 名可以是变量 ->{[key]:值}
        [type]: true,
      },
      openType: type,
    })
  }

  // 是否显示前三个title的过滤器
  isShowPicker = () => {
    const { openType } = this.state
    return openType === 'area' || openType === 'mode' || openType === 'price'
  }

  // 确定(关闭遮罩层)的时候关闭 picker
  onOkPicker = () => {
    this.setState({
      openType: '',
    })
  }

  // 取消的时候关闭 picker
  onCancelPicker = () => {
    this.setState({
      openType: '',
    })
  }

  // 获取过滤条件数据
  getToHouseCondition = async () => {
    // 获取当前城市ID (value值就是城市的ID)
    const { value } = await getCurrentCity()
    const { status, data } = await getHouseCondition(value)
    if (status === 200) {
      // 存储到state上 刷新时会刷新当前页面数据 => 我们需要点击时才加载数据 => 储存到this上(轻量的state)
      this.filterData = data
    }
  }

  // 处理Picker组件的数据
  renderFilterPicker = () => {
    if (this.isShowPicker()) {
      const { openType } = this.state
      // 处理后端拿到的筛选条件数据
      const { area, subway, rentType, price } = this.filterData
      let data = [],
      // 控制PickerView的列数
      cols = 1
      switch (openType) {
        case 'area':
          cols = 3
          // 获取当前选中的数据
          data = [area, subway]
          break
        case 'mode':
          data = rentType
          break
        case 'price':
          data = price
          break
        default:
          break
      }
      return (
        <FilterPicker
          data={data}
          cols={cols}
          onOkPicker={this.onOkPicker}
          onCancelPicker={this.onCancelPicker}
        />
      )
    } else {
      return null
    }
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.isShowPicker() ? (
          <div className={styles.mask} onClick={this.onOkPicker} />
        ) : null}

        <div className={styles.content}>
          {/* 标题栏 */}
          {/* 父组件传值控制状态 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            onTitleClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.renderFilterPicker()}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
