/**
 *  地图找房
 */

import React, { Component } from 'react'

class Map extends Component {
  componentDidMount() {
    this.initMap()
}

  // 初始化百度地图
  initMap = () => {
    // 1、新建地图实例 显示到id是container到div下
    let map = new window.BMapGL.Map('container')
    // 2、设置中心点坐标(默认天安门)
    let point = new window.BMapGL.Point(116.404, 39.915)
    // 3、地图初始化 同时设置地图展示级别
    map.centerAndZoom(point, 15)
  }

  render() {
    return (
      <div className="mapBox">
          {/* 创建地图容器元素 => 百度地图显示位置 */}
        <div id="container"></div>
      </div>
    )
  }
}

export default Map
