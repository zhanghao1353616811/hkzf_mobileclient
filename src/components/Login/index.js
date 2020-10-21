import React, { Component } from 'react'
import { Flex, WingBlank, WhiteSpace, NavBar, Toast } from 'antd-mobile'

import { Link } from 'react-router-dom'
import { withFormik } from 'formik'

import styles from './index.module.css'
import { getUserLogin } from '../../utils/api/user'
import { setLocalData, TOKEN } from '../../utils'

// 验证规则：
// const REG_UNAME = /^[a-zA-Z_\d]{5,8}$/
// const REG_PWD = /^[a-zA-Z_\d]{5,12}$/

class Login extends Component {
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

  // 登录提交表单
  // subForm = async (e) => {
  //   e.preventDefault()
  //   // 1、获取表单值
  //   const { username, password } = this.state
  //   let FormData = { username, password }
  //   // 2、发送请求登录
  //   const { status, data, description } = await getUserLogin(FormData)
  //   if (status === 200) {
  //     let token = data.token
  //     Toast.success(description, 2)
  //     // 存储token到本地
  //     setLocalData(token)
  //     this.props.history.push('/home/profile')
  //   } else {
  //     Toast.fail(description, 2)
  //   }
  // }

  render() {
    // console.log(this.props);
    const {
      values,
      touched,
      errors,
      handleChange,
      handleBlur,
      handleSubmit,
    } = this.props
    return (
      <div className={styles.root}>
        {/* 顶部导航 */}
        <NavBar mode="light">账号登录</NavBar>
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
            {/* <div className={styles.error}>账号为必填项</div> */}
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
            {/* <div className={styles.error}>账号为必填项</div> */}
            <div className={styles.formSubmit}>
              <button
                onClick={handleSubmit}
                className={styles.submit}
                type="submit"
              >
                登 录
              </button>
            </div>
          </form>
          <Flex className={styles.backHome}>
            <Flex.Item>
              <Link to="/registe">还没有账号，去注册~</Link>
            </Flex.Item>
          </Flex>
        </WingBlank>
      </div>
    )
  }
}

const LoginForm = withFormik({
  mapPropsToValues: () => ({ username: '', password: '' }),

  // Custom sync validation
  // validate: (values) => {
  //   const errors = {}

  //   if (!values.name) {
  //     errors.name = 'Required'
  //   }

  //   return errors
  // },

  // 登录提交表单
  handleSubmit: async (values, { props }) => {
    // 1、获取表单值
    const {username,password} = values
    let FormData = { username, password }
    // 2、发送请求登录
    const { status, data, description } = await getUserLogin(FormData)
    if (status === 200) {
      let token = data.token
      Toast.success(description, 2)
      // 存储token到本地
      setLocalData(TOKEN,token)
      props.history.push('/home/profile')
    } else {
      Toast.fail(description, 2)
    }

    // setTimeout(() => {
    //   alert(JSON.stringify(values, null, 2))
    //   setSubmitting(false)
    // }, 1000)
  },

  displayName: 'BasicForm',
})(Login)

export default LoginForm
