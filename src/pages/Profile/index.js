import React, { Component } from 'react'

import { Link } from 'react-router-dom'
import { Grid, Button, Toast, Modal } from 'antd-mobile'
import styles from './index.module.css'

import { BASE_URL } from '../../utils/axios'
import { isAuth, getToken, removeToken } from '../../utils'
import { getUserInfo, logout } from '../../utils/api/user'

// 菜单数据
const menus = [
  { id: 1, name: '我的收藏', iconfont: 'icon-coll', to: '/favorate' },
  { id: 2, name: '我的出租', iconfont: 'icon-ind', to: '/rent' },
  { id: 3, name: '看房记录', iconfont: 'icon-record' },
  {
    id: 4,
    name: '成为房主',
    iconfont: 'icon-identity',
  },
  { id: 5, name: '个人资料', iconfont: 'icon-myinfo' },
  { id: 6, name: '联系我们', iconfont: 'icon-cust' },
]

// 默认头像
const DEFAULT_AVATAR = BASE_URL + '/img/profile/avatar.png'
const alert = Modal.alert

export default class Profile extends Component {
  state = {
    // 是否登陆
    isLogin: isAuth(),
    // 用户信息
    userInfo: {},
  }

  componentDidMount() {
    this.getUserInfo()
  }

  // 获取用户信息
  getUserInfo = async () => {
    const { isLogin } = this.state
    if (isLogin) {
      const { status, data, description } = await getUserInfo(getToken())
      if (status === 200) {
        // 处理图片路径
        data.avatar = BASE_URL + data.avatar
        this.setState({
          userInfo: data,
        })
      } else {
        Toast.info(description, 2)
      }
    }
  }

  // 退出登录
  logout = () => {
    alert('提示', '是否确定退出', [
      { text: '取消' },
      {
        text: '确定',
        onPress: async () => {
          // 处理退出登录功能
          const { status, description } = await logout(getToken())
          if (status === 200) {
            // 删除token
            removeToken()
            // 重置状态
            this.setState({
              isLogin: false,
              userInfo: {}
            })
          } else {
            Toast.fail(description, 2)
          }
        },
      },
    ])
  }

  // 渲染用户信息
  renderUser = () => {
    const { history } = this.props
    const { isLogin } = this.state

    return isLogin ? (
      <>
        {/* 登录后展示： */}
        <div className={styles.auth}>
          <span onClick={this.logout}>退出</span>
        </div>
        <div className={styles.edit} onClick={() => history.push('/rent/add')}>
          发布房源
          <span className={styles.arrow}>
            <i className="iconfont icon-arrow" />
          </span>
        </div>
      </>
    ) : (
      <div className={styles.edit}>
        {/* 未登录展示： */}
        <Button
          type="primary"
          size="small"
          inline
          onClick={() => history.push('/login')}
        >
          去登录
        </Button>
      </div>
    )
  }

  render() {
    const {
      userInfo: { nickname, avatar },
      isLogin,
    } = this.state
    
    return (
      <div className={styles.root}>
        {/* 个人信息 */}
        <div className={styles.title}>
          <img
            className={styles.bg}
            src={BASE_URL + '/img/profile/bg.png'}
            alt="背景图"
          />
          <div className={styles.info}>
            <div className={styles.myIcon}>
              <img
                className={styles.avatar}
                src={isLogin ? avatar : DEFAULT_AVATAR}
                alt="icon"
              />
            </div>
            <div className={styles.user}>
              <div className={styles.name}>{nickname||'游客'}</div>
              {this.renderUser()}
            </div>
          </div>
        </div>

        {/* 九宫格菜单 */}
        <Grid
          data={menus}
          columnNum={3}
          hasLine={false}
          renderItem={(item) =>
            item.to ? (
              <Link to={item.to}>
                <div className={styles.menuItem}>
                  <i className={`iconfont ${item.iconfont}`} />
                  <span>{item.name}</span>
                </div>
              </Link>
            ) : (
              <div className={styles.menuItem}>
                <i className={`iconfont ${item.iconfont}`} />
                <span>{item.name}</span>
              </div>
            )
          }
        />

        {/* 加入我们 */}
        <div className={styles.ad}>
          <img src={BASE_URL + '/img/profile/join.png'} alt="" />
        </div>
      </div>
    )
  }
}
