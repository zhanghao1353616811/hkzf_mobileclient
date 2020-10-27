import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, NavBar, Toast, Modal } from 'antd-mobile'

import { Link } from 'react-router-dom'
import { withFormik } from 'formik'
import * as yup from 'yup'

import styles from './index.module.css'
import { registe } from '../../utils/api/user'

// 验证规则：
const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

// Modal对话框
const alert = Modal.alert

class Registe extends Component {
  // 设置状态数据
  state = {
    username: '',
    password: '',
  }

  // 处理表单
  handleForm = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    })
  }

  render() {
    const { values, errors, handleChange, handleSubmit } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">账号注册</NavBar>
        <WhiteSpace size="xl" />

        {/* 登录表单 */}
        <WingBlank>
          <form>
            <div className={styles.formItem}>
              <input
                value={values.username}
                onChange={handleChange}
                className={styles.input}
                name="username"
                placeholder="请输入账号"
              />
            </div>
            {/* 长度为5到8位，只能出现数字、字母、下划线 */}
            <div className={styles.error}>{errors.username}</div>
            <div className={styles.formItem}>
              <input
                value={values.password}
                onChange={handleChange}
                className={styles.input}
                name="password"
                type="password"
                placeholder="请输入密码"
              />
            </div>
            {/* 长度为5到12位，只能出现数字、字母、下划线 */}
            <div className={styles.error}>{errors.password}</div>
            <div className={styles.formSubmit}>
              <button
                onClick={handleSubmit}
                className={styles.submit}
                type="submit"
              >
                注 册
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">已有账号，可以去登陆啦</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

const RegisteForm = withFormik({
  // 1. 提供表单的状态数据；2. 当前表单的input的name属性值一一对应
  mapPropsToValues: () => ({ username: '', password: '' }),
  // 验证表单
  validationSchema: yup.object().shape({
    username: yup
      .string()
      .required('请输入用户名')
      .matches(REG_UNAME, '长度为5到8位，只能出现数字、字母、下划线'),
    password: yup
      .string()
      .required('请输入密码')
      .matches(REG_PWD, '长度为5到12位，只能出现数字、字母、下划线'),
  }),

  // 注册提交表单
  handleSubmit: async (values, { props }) => {
    // 1、获取表单值
    const { username, password } = values
    let fdata = { username, password }
    // 2、发送请求注册
    const { status } = await registe(fdata)
    if (status === 200) {
      alert('提示', '恭喜你注册成功, 是否去登录新账号', [
        { text: '取消' },
        {
          text: '确定',
          onPress: () => {
            props.history.push('/login')
          },
        },
      ])
    } else if (status === 400) {
      Toast.info('你注册的账号名已重复')
    }
  },
  displayName: 'BasicForm',
})(Registe)

export default RegisteForm
