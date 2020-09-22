import React, { Component } from 'react'
import { Carousel } from 'antd-mobile'
import axios from 'axios'

class Index extends Component {
  state = {
    // 轮播图的数据
    swiper: ['1', '2', '3'],
    // 设置了轮播图的高度
    imgHeight: 176,
  }
  componentDidMount() {
    this.getSwiper()
  }
  getSwiper = async () => {
      const res = await axios.get('http://api-haoke-dev.itheima.net/home/swiper')
      const { body, status } = res.data
      if (status === 200) {
          this.setState({
              swiper: body
          })
      }
  }
  render() {
    return (
      <div>
        <Carousel
          // 自动播放
          autoplay={true}
          // 循环播放
          infinite
        >
          {/* 列表渲染 */}
          {this.state.swiper.map(val => (
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
                src={`http://api-haoke-dev.itheima.net${val.imgSrc}`}
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
          ))}
        </Carousel>
      </div>
    )
  }
}

export default Index
