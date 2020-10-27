/**
 *  地图找房
 */

import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile'

// 导入地图样式
import styles from './index.module.css'

import { getCurrentCity } from '../../utils'
import { getHouseMap } from '../../utils/api/city'

// 百度地图 API
const BMap = window.BMap

class Map extends Component {
  componentDidMount() {
    this.initMap()
  }

  // 三个zoom级别
  // 1. 行政区的范围：>=10 && <12
  // 2. 镇的范围：\>=12 && <14
  // 3. 小区的范围：\>=14 && <16

  // 初始化百度地图
  initMap = async () => {
    // 新建地图实例 显示到id是container到div下
    this.map = new BMap.Map('container')
    // 获取当前定位城市的数据
    const { label, value } = await getCurrentCity()
    // 创建地址解析器实例
    let myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上 并调整地图视野
    myGeo.getPoint(
      null,
      async (point) => {
        if (point) {
          // 地图初始化 同时设置中心点坐标(point)和地图展示级别(第一层区的级别: 11)
          this.map.centerAndZoom(point, 11)
          // 平移缩放控件
          this.map.addControl(new BMap.NavigationControl())
          // 比例尺控件
          this.map.addControl(new BMap.ScaleControl())
          this.renderOverlays(value)
        }
      },
      label
    )
  }

  // 根据区域渲染覆盖物
  renderOverlays = async (value) => {
    // 调用接口创建覆盖物 => (第一层:区)
    const { status, data } = await getHouseMap(value)
    // 获取当前覆盖物的形状和下一层的显示缩放界别
    if (status === 200) {
      // 创建所有区的覆盖物
      data.forEach((item) => {
        const {
          coord: { latitude, longitude },
          count,
          label: areaName,
          value,
        } = item
        // 转换地理位置坐标
        const point = new BMap.Point(longitude, latitude)
        // 绘制文本覆盖物
        let opts = {
          position: point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(0, 0), // 设置文本偏移量
        }
        let label = new BMap.Label(null, opts) // 创建文本标注对象
        // 设置文本覆盖物样式
        label.setStyle({
          // 去除默认样式
          border: 'none',
        })
        // 使用setContent方法创建html覆盖物
        label.setContent(`<div 
    class="${styles.bubble}">
    <p class="${styles.bubbleName}">${areaName}</p>
    <p>${count}套</p>
    </div>`)
        // 给html覆盖物添加点击事件
        label.addEventListener('click', () => {
          // 设置显示下一区域的位置和缩放级别 (区下边村)
          this.map.centerAndZoom(point, 13)
          // 清除上一层的覆盖物
          setTimeout(() => {
            // clearOverlays()不可以放在主线程中 => 放到队列中
            // 原因 => 百度地图绑定touchend => 先执行了click事件把元素删除了 => 在执行touchend就找不到元素了
            this.map.clearOverlays()
          })
        })
        // 添加覆盖物到地图中显示
        this.map.addOverlay(label)
      })
    }
  }

  // 获取地图当前缩放级别 => 得到当前地图覆盖物的形状和下一级的缩放值

  render() {
    return (
      <div className="mapBox">
        {/* 导航返回 */}
        <NavBar
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={() => this.props.history.goBack()}
        >
          地图找房
        </NavBar>
        {/* 创建地图容器元素 => 百度地图显示位置 */}
        <div id="container"></div>
      </div>
    )
  }
}

export default Map
