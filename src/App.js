import React from 'react'

// 导入路由的三个基础组件
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

// 导入路由对应组件
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './pages/Map'
import NotFound from './pages/NotFound'

import HouseDetail from './components/HouseDetail'
import Login from './components/Login'
import Registe from './components/Registe'
import Rent from '../src/pages/Rent'
import RentAdd from '../src/pages/Rent/Add'
import RentSearch from '../src/pages/Rent/Search'

function App() {
  return (
    <Router className="app">
      <Switch>
        {/* 重定向 */}
        {/* 第一种重定向写法： */}
        {/* <Redirect exact from="/" to="/home" /> */}
        {/* 第二种重定向写法 => 推荐使用 => 模糊匹配 exact => 精确匹配 */}
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        {/* 一级路由 */}
        {/* /home 下配置二级路由 => 默认首页、找房、我的 */}
        <Route path="/home" component={Home} />
        {/* 城市列表 */}
        <Route path="/cityList" component={CityList} />
        {/* 房源详情 */}
        <Route path="/detail/:id" component={HouseDetail} />
        {/* 登录 */}
        <Route path="/login" component={Login} />
        {/* 注册 */}
        <Route path="/registe" component={Registe} />
        {/* 发布房源和管理 */}
        {/* 管理房源列表 */}
        <Route path="/rent" exact component={Rent} />
        {/* 发布房源 */}
        <Route path="/rent/add" component={RentAdd} />
        {/* 搜索小区 */}
        <Route path="/rent/search" component={RentSearch} />
        {/* 地图找房 */}
        <Route path="/map" component={Map} />

        {/* 404页面  必须写在一级路由同级 不然总是显示404页面 */}
        <Route component={NotFound} />
      </Switch>
    </Router>
  )
}

/* 根文件 */
export default App
