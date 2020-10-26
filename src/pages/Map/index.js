/**
 *  地图找房
 */

import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile'

// 导入地图样式
import styles from './index.module.css'

import { getCurrentCity } from '../../utils'

// 百度地图 API
const BMap = window.BMap

class Map extends Component {
  componentDidMount() {
    this.initMap()
  }

  // 初始化百度地图
  initMap = async () => {
    // 新建地图实例 显示到id是container到div下
    let map = new BMap.Map('container')
    // 获取当前定位城市的数据
    const { label, value } = await getCurrentCity()
    console.log(label, value)
    // 创建地址解析器实例
    let myGeo = new BMap.Geocoder()
    // 将地址解析结果显示在地图上 并调整地图视野
    myGeo.getPoint(
      null,
      (point) => {
        if (point) {
          // 地图初始化 同时设置中心点坐标(point)和地图展示级别(11)
          map.centerAndZoom(point, 11)
          // 平移缩放控件
          map.addControl(new BMap.NavigationControl())
          // 比例尺控件
          map.addControl(new BMap.ScaleControl())
          // 文本覆盖物
          let opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(0, 0), // 设置文本偏移量
          }
          let label = new BMap.Label(null, opts) // 创建文本标注对象
          // 设置文本覆盖物样式
          label.setStyle({
            border: 0,
          })
          // 使用setContent方法创建html覆盖物
          label.setContent(`<div 
          class="${styles.bubble}">
          <p class="${styles.bubbleName}">浦东新区</p>
          <p>388套</p>
          </div>`)
          // 给html覆盖物添加点击事件
          label.addEventListener('click',()=>{
            console.log(point);
          })
          // 添加覆盖物到地图中显示
          map.addOverlay(label)
        }
      },
      label
    )
  }

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
