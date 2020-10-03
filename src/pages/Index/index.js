/**
 * 默认首页
 */

import React, { Component } from 'react'
import { Carousel, Flex, Grid, WingBlank, SearchBar } from 'antd-mobile'
import { BASE_URL } from '../../utils/axios'
import { getSwiper, getGroup, getNew } from '../../utils/api/home'
// import { getCityInfo } from '../../utils/api/city'
import navs from '../../utils/navs_config'
import { getCurrentCity } from '../../utils/index'
// 导入首页样式
import './index.scss'

class Index extends Component {
  state = {
    // 轮播图数据
    swiper: [],
    // 顶部搜索关键词
    keyword: '',
    // 当前城市数据
    currentCity: {
      label: '',
      value: '',
    },
    // 租房小组数据
    grid: [],
    // 资讯列表数据
    news: [],
    // 处理调用后端接口后 不自动播放的问题
    autoplay: false,
    // 设置了轮播图的高度 默认占位
    imgHeight: 212,
  }

  componentDidMount() {
    this.getAllData()
    this.getCurrCity()
  }

  // 使用 Promise.all => 统一处理首页所有接口调用
  // 使用 Promise.all方法 传入一个包含多个Promise对象的数组 返回resolve结果数据
  // 只有传入的三个方法都请求到数据才返回结果 => 返回的结果是根据传入的顺序而进行排序
  getAllData = async () => {
    const res = await Promise.all([getSwiper(), getGroup(), getNew()])
    if (res[0].status === 200) {
      // setState() 中数据异步
      this.setState(
        {
          swiper: res[0].data,
          grid: res[1].data,
          news: res[2].data,
        },
        () => {
          // 有数据之后在设置自动播放
          this.setState({ autoplay: true })
        }
      )
    }
  }

  // 获取当前城市
  getCurrCity = async () => {
    const res = await getCurrentCity()
    console.log(res);
    this.setState({
      currentCity: res,
    })
  }

  // 渲染轮播图
  renderSwiper = () => {
    return this.state.swiper.map((val) => (
      <a
        key={val}
        href="https://github.com/zhanghao1353616811/hkzf_mobileclient"
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

  // 渲染顶部导航
  renderTopNav = () => {
    const { push } = this.props.history
    return (
      <Flex justify="around" className="topNav">
        <div className="searchBox">
          <div className="city" onClick={() => push('/cityList')}>
            {this.state.currentCity.label}
            <i className="iconfont icon-arrow" />
          </div>
          <SearchBar
            value={this.state.keyword}
            onChange={(v) => this.setState({ keyword: v })}
            placeholder="请输入小区或地址"
          />
        </div>
        <div className="map" onClick={() => push('/map')}>
          <i key="0" className="iconfont icon-map" />
        </div>
      </Flex>
    )
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

  // 渲染最新资讯
  renderNews() {
    return this.state.news.map((item) => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img className="img" src={`${BASE_URL}${item.imgSrc}`} alt="" />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }

  render() {
    return (
      <div>
        {/* 顶部导航 */}
        {this.renderTopNav()}
        {/* 轮播图 */}
        <Carousel
          // 自动播放
          autoplay={this.state.autoplay}
          // 循环播放
          infinite
        >
          {/* 列表渲染 */}
          {this.renderSwiper()}
        </Carousel>
        {/* 栏目导航 */}
        <Flex className="nav">{this.renderNavs()}</Flex>
        {/* 租房小组 */}
        <div className="group">
          {/* title */}
          <Flex className="group-title" justify="between">
            <h3>租房小组</h3>
            <span>更多</span>
          </Flex>
          {/* 宫格布局 */}
          <Grid
            data={this.state.grid}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(item) => (
              // item结构
              <Flex className="grid-item" justify="between">
                <div className="desc">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <img src={`${BASE_URL}${item.imgSrc}`} alt="" />
              </Flex>
            )}
          />
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <h3 className="group-title">最新资讯</h3>
          <WingBlank size="md">{this.renderNews()}</WingBlank>
        </div>
      </div>
    )
  }
}

export default Index
