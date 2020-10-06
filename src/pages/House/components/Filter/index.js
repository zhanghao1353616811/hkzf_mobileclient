import React, { Component } from 'react'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
// import FilterMore from '../FilterMore'

import styles from './index.module.css'

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

  // 确定的时候关闭 picker
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

  render() {
    return (
      <div className={styles.root}>
        {/* 前三个菜单的遮罩层 */}
        {this.isShowPicker() ? <div className={styles.mask} onClick={this.onOkPicker} /> : ''}

        <div className={styles.content}>
          {/* 标题栏 */}
          {/* 父组件传值控制状态 */}
          <FilterTitle
            titleSelectedStatus={this.state.titleSelectedStatus}
            onTitleClick={this.onTitleClick}
          />

          {/* 前三个菜单对应的内容： */}
          {this.isShowPicker() ? <FilterPicker onOkPicker={this.onOkPicker} onCancelPicker={this.onCancelPicker} /> : ''}

          {/* 最后一个菜单对应的内容： */}
          {/* <FilterMore /> */}
        </div>
      </div>
    )
  }
}
