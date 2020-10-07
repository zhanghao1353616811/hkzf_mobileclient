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

// 选中数据维护(测试)
const selectedValues = {
  area: ['area', 'null'],
  mode: ['null'],
  price: ['null'],
  more: [],
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
    // 实例存储选中的条件数据
    this.selectedValues = { ...selectedValues }
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

  // 处理高亮(已经选择条件的筛选器title)
  handlerSel = () => {
    // 创建新的标题选中状态对象
    const newTitleSelStatus = {}
    Object.keys(this.selectedValues).forEach((item) => {
      // 获取当前过滤器选中值currFilterData =>数组
      const currFilterData = this.selectedValues[item]
      if (
        (item === 'area' && currFilterData[1] !== 'null') ||
        currFilterData[0] === 'subway'
      ) {
        newTitleSelStatus.area = true
      } else if (item === 'mode' && currFilterData[0] !== 'null') {
        newTitleSelStatus.mode = true
      } else if (item === 'price' && currFilterData[0] !== 'null') {
        newTitleSelStatus.price = true
      } else {
        newTitleSelStatus[item] = false
      }
    })
    return newTitleSelStatus
  }

  // 确定(关闭遮罩层)的时候关闭 picker
  onOkPicker = (filter) => {
    // 当前选中的type
    const { openType } = this.state
    // 确定的时候根据openType存储当前选中的值
    this.selectedValues[openType] = filter
    // 处理选中后的高亮显示
    const newSelStaus = this.handlerSel()
    this.setState({
      openType: '',
      // 根据是否选中设置要高亮的title
      titleSelectedStatus: newSelStaus,
    })
  }

  // 取消的时候关闭 picker
  onCancelPicker = () => {
    this.setState({
      openType: '',
      titleSelectedStatus: this.handlerSel(),
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
      // 获取picker选中的值
      const selVal = this.selectedValues[openType]
      return (
        <FilterPicker
          data={data}
          value={selVal}
          cols={cols}
          // 给组件添加 key={openType} => (key发生变化 => 会销毁组件 => 重新渲染)
          key={openType}
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
