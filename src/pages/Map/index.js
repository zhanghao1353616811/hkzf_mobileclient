/**
 *  地图找房
 */

import React, { Component } from 'react'
import { NavBar, Icon } from 'antd-mobile'

// 导入地图样式
import styles from './index.module.css'
import HouseItem from '../../components/HouseItem'

import { getCurrentCity } from '../../utils'
import { BASE_URL } from '../../utils/axios'
import { getHouseMap } from '../../utils/api/city'
import { getHouseList } from '../../utils/api/house'

// 百度地图 API
const BMap = window.BMap

class Map extends Component {
  // 定义状态数据
  state = {
    // 小区的房源列表
    list: [],
    // 是否显示房源列表
    isShowList: false,
  }

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
    // 地图移动时 判断列表是否显示  => 关闭 => 给地图实例map添加movestart事件(movestart: 地图移动开始时触发此事件)
    this.map.addEventListener('movestart', () => {
      const { isShowList } = this.state
      if (isShowList) {
        this.setState({
          isShowList: false,
        })
      }
    })
  }

  // 根据区域渲染覆盖物
  renderOverlays = async (value) => {
    // 调用接口创建覆盖物 => (第一层:区)
    const { status, data } = await getHouseMap(value)
    // 处理当前覆盖物的形状和下一层的显示缩放级别
    const { type, nextLevel } = this.getTypeAndZoom()
    if (status === 200) {
      // 创建所有区的覆盖物
      data.forEach((item) => {
        // 根据覆盖物类型type和房源数据item创建覆盖物
        this.createOverlays(type, nextLevel, item)
      })
    }
  }

  // 计算要绘制的覆盖物类型和下一个缩放级别
  // 行政区: 11 => 范围：>= 10 <12
  // 镇 : 13 => 范围：>= 12 <14
  // 小区: 15 =>范围：>= 14 <16
  // 获取地图当前缩放级别 => 得到当前地图覆盖物的形状和下一级的缩放值
  getTypeAndZoom = () => {
    let type, nextLevel
    // map.getZoom() => 返回地图当前缩放级别 => 项目中默认缩放级别为：11
    const currZoom = this.map.getZoom()
    if (currZoom >= 10 && currZoom < 12) {
      // 行政区
      type = 'circle'
      nextLevel = 13
    } else if (currZoom >= 12 && currZoom < 14) {
      // 镇
      type = 'circle'
      nextLevel = 15
    } else if (currZoom >= 14 && currZoom < 16) {
      // 小区
      type = 'rect'
    }
    return {
      type,
      nextLevel,
    }
  }

  // 根据type创建不同形状的覆盖物 => 根据当前覆盖物的类型 => 决定调用哪个方法创建覆盖物
  createOverlays = (type, nextLevel, item) => {
    const {
      coord: { latitude, longitude },
    } = item
    // 转换地理位置坐标
    const point = new BMap.Point(longitude, latitude)
    if (type === 'circle') {
      // 区和镇(前两层)
      this.createCircle(nextLevel, item, point)
    } else {
      // 小区
      this.createRect(item, point)
    }
  }

  // 处理区和镇的情况(前两层) => 创建圆形覆盖物
  createCircle = (nextLevel, item, point) => {
    const { count, label: areaName, value } = item
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
    // 给html覆盖物添加点击事件 => click 左键单击地图时触发此事件
    label.addEventListener('click', () => {
      // 设置显示下一区域的位置和缩放级别 (区下边村)
      this.map.centerAndZoom(point, nextLevel)
      // 处理下一层的地图覆盖物
      this.renderOverlays(value)
      // 清除上一层的覆盖物
      setTimeout(() => {
        // clearOverlays()不可以放在主线程中 => 放到队列中
        // 原因 => 百度地图绑定touchend => 先执行了click事件把元素删除了 => 在执行touchend就找不到元素了
        this.map.clearOverlays()
      })
    })
    // 添加覆盖物到地图中显示
    this.map.addOverlay(label)
  }

  // 第三层(处理小区情况)
  createRect = (item, point) => {
    const { count, label: areaName, value } = item
    // 绘制文本覆盖物
    let opts = {
      position: point, // 指定文本标注所在的地理位置
      offset: new BMap.Size(-50, -28), // 设置文本偏移量
    }
    let label = new BMap.Label(null, opts) // 创建文本标注对象
    // 设置文本覆盖物样式
    label.setStyle({
      // 去除默认样式
      border: 'none',
    })
    // 使用setContent方法创建html覆盖物
    label.setContent(`<div class="${styles.rect}">
    <span class="${styles.housename}">${areaName}</span>
    <span class="${styles.housenum}">${count}</span>
    <i class="${styles.arrow}"></i>
  </div>`)
    // 给html覆盖物添加点击事件
    label.addEventListener('click', (e) => {
      // 获取小区下的房源列表
      this.getHouseList(value)
      this.moveToCenter(e)
    })
    // 添加覆盖物到地图中显示
    this.map.addOverlay(label)
  }

  // 根据小区ID获取房源列表
  getHouseList = async (value) => {
    const {
      status,
      data: { list },
    } = await getHouseList(value)
    if (status === 200) {
      this.setState({
        list,
        isShowList: true,
      })
    }
  }

  // 根据当前点击的小区位置 做位移
  moveToCenter = (e) => {
    // 获取当前视图点击到位置信息
    const { clientX, clientY } = e.changedTouches[0]
    // 获取中心点坐标位置 => 位移差值 = 中心点 - 当前小区位置点
    const x = window.innerWidth / 2 - clientX,
      y = (window.innerHeight - 330) / 2 - clientY
    // map.panBy() 将地图在水平位置上移动x像素 垂直位置上移动y像素
    // 如果指定的像素大于可视区域范围或者在配置中指定没有动画效果 => 则不执行滑动效果
    this.map.panBy(x, y)
  }

  // 渲染小区下房屋列表
  renderHouseList = () => {
    return (
      <div
        className={[
          styles.houseList,
          this.state.isShowList ? styles.show : '',
        ].join(' ')}
      >
        <div className={styles.titleWrap}>
          <h1 className={styles.listTitle}>房屋列表</h1>
          <a className={styles.titleMore} href="/home/house">
            更多房源
          </a>
        </div>

        <div className={styles.houseItems}>
          {/* 房屋结构 */}
          {this.state.list.map((item) => (
            <HouseItem
              onClick={() =>
                this.props.history.push(`/detail/${item.houseCode}`)
              }
              key={item.houseCode}
              src={BASE_URL + item.houseImg}
              title={item.title}
              desc={item.desc}
              tags={item.tags}
              price={item.price}
            />
          ))}
        </div>
      </div>
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
        {/* 小区下的列表 */}
        {this.renderHouseList()}
      </div>
    )
  }
}

export default Map
