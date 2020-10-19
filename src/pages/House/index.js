import React from 'react'

// import { Flex } from 'antd-mobile'

import Filter from './components/Filter'
// 导入样式
import styles from './index.module.css'

import { getHouseList } from '../../utils/api/house'
import { getCurrentCity } from '../../utils'

export default class HouseList extends React.Component {

  componentDidMount() {
    this.getCurrCityId()
  }

  // 获取当前城市ID
  getCurrCityId = async () => {
    const { value } = await getCurrentCity()
    // 城市ID存到this
    this.cityId = value
  }

  // 接收子组件 => 筛选条件数据
  onFilter = (filterData) => {
    // 存储筛选条件数据
    this.filterData = filterData
    // 获取列表房源数据 => 刷新列表
    this.getHouseList()
  }
  
  // 获取房源列表数据
  getHouseList = async () => {
    const res = await getHouseList(this.cityId, this.filterData)
    console.log(res, 'res');
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
      </div>
    )
  }
}
