import React, { Component } from 'react'
import { Route } from 'react-router-dom'

// 导入二级路由组件
import Index from '../Index'
import House from '../House'
import Profile from '../Profile'
import tabItems from '../../utils/tabBar.config'

import { TabBar } from 'antd-mobile'
import './index.css'

class Home extends Component {
  // tab 状态数据
  state = {
    selectedTab: this.props.location.pathname, // 当前选中状态 默认选中的值
  }
  // 渲染全局菜单的方法
  renderTabItems = () => {
    return tabItems.map((item, index) => {
      return (
        <TabBar.Item
          title={item.title}
          key={item.title}
          //  默认的 icon
          icon={<i className={`iconfont ${item.icon}`} />}
          //  选中的 icon
          selectedIcon={<i className={`iconfont ${item.icon}`} />}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.props.history.push(item.path) // onPress 编程式导航
            this.setState({
              selectedTab: item.path,
            })
          }}
        ></TabBar.Item>
      )
    })
  }
  render() {
    return (
      <div className="home">
        {/* 二级路由配置 */}
        <Route exact path="/home" component={Index} />
        <Route path="/home/house" component={House} />
        <House path="/home/profile" component={Profile} />
        {/* 全局导航 */}
        <div className="barBox">
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#33A3F4"
            barTintColor="white"
          >
            {this.renderTabItems()}
          </TabBar>
        </div>
      </div>
    )
  }
}

export default Home
