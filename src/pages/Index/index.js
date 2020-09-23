/**
 * 默认首页
 */

import React, { Component } from 'react'
import { Carousel, Flex, img } from 'antd-mobile'
import { BASE_URL } from '../../utils/axios'
import { getSwiper } from '../../utils/api/home'
import navs from '../../utils/navs_config'
// 导入首页样式
import './index.css'

class Index extends Component {
  state = {
    // 轮播图的数据
    swiper: [],
    // 处理调用后端接口后 不自动播放的问题
    autoplay: false,
    // 设置了轮播图的高度 默认占位
    imgHeight: 212,
  }
  componentDidMount() {
    this.getSwiper()
  }
  // 获取轮播图数据
  getSwiper = async () => {
    const res = await getSwiper()
    const { data, status } = res
    if (status === 200) {
      // setState() 中数据异步
      this.setState(
        {
          swiper: data,
        },
        () => {
          this.setState({ autoplay: true })
        }
      )
    }
  }

  // 渲染轮播图
  renderSwiper = () => {
    return this.state.swiper.map((val) => (
      <a
        key={val}
        href="http://www.itheima.com"
        style={{
          display: 'inline-block',
          width: '100%',
          background: 'gray',
          height: this.state.imgHeight,
        }}
      >
        <img
          src={`${BASE_URL}${val.imgSrc}`}
          alt=""
          style={{ width: '100%', verticalAlign: 'top' }}
          // 1、onLoad事件 => 加载完毕触发
          // 2、resize事件 => window窗口尺寸变化时触发
          // 3、通过resize和onLoad的设置完成了图片的动态高度 => 图片适配
          // 4、 imgHeight 默认高度176 => 目的是图片加载完之前 占位 => 防止布局错乱
          onLoad={() => {
            // 根据窗口做自适应
            window.dispatchEvent(new Event('resize'))
            this.setState({ imgHeight: 'auto' })
          }}
        />
      </a>
    ))
  }

  // 渲染栏目导航
  renderNavs = () => {
    return navs.map((item) => {
      return (
        <Flex.Item
          onClick={() => this.props.history.push(item.path)}
          key={item.id}
        >
          <img src={item.img} alt="" />
          <p>{item.title}</p>
        </Flex.Item>
      )
    })
  }

  render() {
    return (
      <div>
        <Carousel
          // 自动播放
          autoplay={this.state.autoplay}
          // 循环播放
          infinite
        >
          {/* 列表渲染 */}
          {this.renderSwiper()}
        </Carousel>
        <Flex className="nav">{this.renderNavs()}</Flex>
      </div>
    )
  }
}

export default Index
