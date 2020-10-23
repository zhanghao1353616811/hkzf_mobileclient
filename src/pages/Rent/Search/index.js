/**
 * 发布房源 => 选择小区
 */

import React, { Component } from 'react'

import { SearchBar } from 'antd-mobile'

import styles from './index.module.css'
import { getCurrentCity } from '../../../utils'
import { getCimmnotuyByKey } from '../../../utils/api/city'

export default class Search extends Component {
  state = {
    // 搜索框的值
    searchTxt: '',
    // 搜索结果列表
    tipsList: [],
  }

  async componentDidMount() {
    // 获取城市ID
    const { value } = await getCurrentCity()
    this.cityId = value
  }

  // 渲染搜索结果列表
  renderTips = () => {
    const { tipsList } = this.state

    return tipsList.map((item) => (
      <li key={item.community} className={styles.tip}>
        {item.communityName}
      </li>
    ))
  }

  // 处理搜索
  handlerSearch = (value) => {
    // 去空格
    let searchVal = value.trim()
    // 空的时候 => 重置状态数据
    if (searchVal.length === 0) {
      return this.setState({
        searchTxt: '',
        tipsList: [],
      })
    }
    this.setState(
      {
        searchTxt: searchVal,
      },
      async () => {
        const { searchTxt } = this.state
        // 调用接口查询小区
        const { status, data } = await getCimmnotuyByKey(this.cityId, searchTxt)
        if (status === 200) {
          this.setState({
            tipsList: data,
          })
        }
      }
    )
  }

  render() {
    const { history } = this.props
    const { searchTxt } = this.state

    return (
      <div className={styles.root}>
        {/* 搜索框 */}
        <SearchBar
          placeholder="请输入小区或地址"
          value={searchTxt}
          showCancelButton={true}
          onChange={this.handlerSearch}
          onCancel={() => history.replace('/rent/add')}
        />

        {/* 搜索提示列表 */}
        <ul className={styles.tips}>{this.renderTips()}</ul>
      </div>
    )
  }
}
