import React from 'react'

// 导入列表组件库
import { AutoSizer, List, InfiniteLoader } from 'react-virtualized'
import { Toast } from 'antd-mobile'

// 导入样式
import styles from './index.module.css'
import Filter from './components/Filter'
import HouseItem from '../../components/HouseItem'
import Nothouse from '../../components/NoHouse'

import { getHouseList } from '../../utils/api/house'
import { getCurrentCity } from '../../utils'
import { BASE_URL } from '../../utils/axios'

export default class HouseList extends React.Component {
  state = {
    // 房源列表数据
    list: [],
    // 列表总条数
    count: 0,
  }

  componentDidMount() {
    this.getCurrCityId()
  }

  // 获取当前城市ID
  getCurrCityId = async () => {
    const { value } = await getCurrentCity()
    // 城市ID存到this
    this.cityId = value
    // 默认进入页面加载调用列表数据 => 先获得城市ID在调用数据
    this.getHouseList()
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
    const {
      status,
      data: { list, count },
    } = await getHouseList(this.cityId, this.filterData)
    if (status === 200) {
      if (count > 0) {
        Toast.success(`获取到${count}条房源信息`, 2)
      }
      this.setState({
        list,
        count,
      })
    }
  }

  // 渲染列表项方法
  renderHouseItem = ({ key, index, isScrolling, isVisible, style }) => {
    const { list } = this.state
    let currItem = list[index]
    // 数据正在获取中 => 处理暂时没有加载到数据情况
    if (!currItem) {
      // 由于下拉加载需要调用后台接口获取数据
      // 所以有一定的时间延迟 => 数据item可能为undefined 需要进行处理 显示预先加载的空内容(骨架屏)
      return (
        <div style={style} key={key}>
          <p className={styles.loading}></p>
        </div>
      )
    }
    // 处理图片地址
    currItem.src = BASE_URL + currItem.houseImg
    return (
      <HouseItem
        onClick={() => {
          this.props.history.push(`/detail/${currItem.houseCode}`)
        }}
        {...currItem}
        key={key}
        style={style}
      />
    )
  }

  // 判断列表中的每一行是否加载完成
  isRowLoaded = ({ index }) => {
    return !!this.state.list[index]
  }

  // 下拉加载更多时触发 => 加载下一页数据
  loadMoreRows = ({ startIndex, stopIndex }) => {
    return getHouseList(
      this.cityId,
      this.filterData,
      startIndex,
      stopIndex
    ).then((res) => {
      const {
        status,
        data: { list, count },
      } = res
      // 刷新视图
      status === 200 &&
        this.setState({
          list: [...this.state.list, ...list],
          count,
        })
    })
  }

  renderHouseList = () => {
    const { count } = this.state
    return count > 0 ? (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.loadMoreRows}
        // 远程数据总条数
        rowCount={count}
      >
        {({ onRowsRendered, registerChild }) => (
          <AutoSizer className={styles.houseHeight}>
            {({ height, width }) => (
              <List
                className={styles.houseList}
                height={height}
                onRowsRendered={onRowsRendered}
                ref={registerChild}
                rowCount={count}
                rowHeight={130}
                rowRenderer={this.renderHouseItem}
                width={width}
              />
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    ) : (
      <Nothouse>没有更多房源</Nothouse>
    )
  }

  render() {
    return (
      <div className={styles.root}>
        {/* 条件筛选栏 */}
        <Filter onFilter={this.onFilter} />
        {/* 房源列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}
