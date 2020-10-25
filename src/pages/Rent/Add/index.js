/**
 * 发布房源
 */

import React, { Component } from 'react'

import {
  Flex,
  List,
  InputItem,
  Picker,
  ImagePicker,
  TextareaItem,
  Modal,
  NavBar,
  Icon,
  Toast,
} from 'antd-mobile'

import styles from './index.module.css'
import HousePackage from '../../../components/HousePackage'
import { uploadHouseImg } from '../../../utils/api/house'
import { getPubHouse } from '../../../utils/api/user'

const alert = Modal.alert

// 房屋类型
const roomTypeData = [
  { label: '一室', value: 'ROOM|d4a692e4-a177-37fd' },
  { label: '二室', value: 'ROOM|d1a00384-5801-d5cd' },
  { label: '三室', value: 'ROOM|20903ae0-c7bc-f2e2' },
  { label: '四室', value: 'ROOM|ce2a5daa-811d-2f49' },
  { label: '四室+', value: 'ROOM|2731c38c-5b19-ff7f' },
]

// 朝向：
const orientedData = [
  { label: '东', value: 'ORIEN|141b98bf-1ad0-11e3' },
  { label: '西', value: 'ORIEN|103fb3aa-e8b4-de0e' },
  { label: '南', value: 'ORIEN|61e99445-e95e-7f37' },
  { label: '北', value: 'ORIEN|caa6f80b-b764-c2df' },
  { label: '东南', value: 'ORIEN|dfb1b36b-e0d1-0977' },
  { label: '东北', value: 'ORIEN|67ac2205-7e0f-c057' },
  { label: '西南', value: 'ORIEN|2354e89e-3918-9cef' },
  { label: '西北', value: 'ORIEN|80795f1a-e32f-feb9' },
]

// 楼层
const floorData = [
  { label: '高楼层', value: 'FLOOR|1' },
  { label: '中楼层', value: 'FLOOR|2' },
  { label: '低楼层', value: 'FLOOR|3' },
]

export default class RentAdd extends Component {
  constructor(props) {
    super(props)
    let { location } = props,
      community = {
        name: '',
        id: '',
      }
    if (location.state) {
      community = location.state
    }
    this.state = {
      // 临时图片地址
      tempSlides: [],

      // 小区的名称和id
      community: community,
      // 价格
      price: '',
      // 面积
      size: '',
      // 房屋类型
      roomType: '',
      // 楼层
      floor: '',
      // 朝向：
      oriented: '',
      // 房屋标题
      title: '',
      // 房屋图片
      houseImg: '',
      // 房屋配套：
      supporting: '',
      // 房屋描述
      description: '',
    }
  }

  // 取消编辑，返回上一页
  onCancel = () => {
    alert('提示', '放弃发布房源?', [
      {
        text: '放弃',
        onPress: async () => this.props.history.go(-1),
      },
      {
        text: '继续编辑',
      },
    ])
  }

  // 统一处理表单输入相关组件
  handleVal = (name, value) => {
    this.setState({
      [name]: value,
    })
  }

  // 提交表单(房源)
  addHouse = async () => {
    // 获取用户输入的房源信息
    const {
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      supporting,
      description,
      community,
    } = this.state
    // 边界处理
    if (!price||!title) {
      return Toast.info('请输入房屋标题和租金', 2)
    }
    let pubData = {
      price,
      size,
      roomType,
      floor,
      oriented,
      title,
      supporting,
      description,
      community: community.id,
    }
    // 上传图片
    // 获取图片临时地址
    let { tempSlides } = this.state
    // 服务器返回的存储路径
    let houseImg = ''
    if (tempSlides.length) {
      // 已选图片 => 新建FormData对象
      let formData = new FormData()
      tempSlides.forEach((item) => formData.append('file', item.file))
      // 调用接口 => 传递 formData对象
      let { status, data, description } = await uploadHouseImg(formData)
      if (status === 200) {
        houseImg = data.join('|')
        // 加上房源图片
        pubData.houseImg = houseImg
      } else {
        Toast.fail(description, 2)
      }
    } else {
      return Toast.info('请上传房源图片')
    }
    // 发布房源
    const { status, description: desc } = await getPubHouse(pubData)
    if (status === 200) {
      Toast.success('发布房源成功')
      // 跳转 => 房源管理
      this.props.history.push('/rent')
    }
    if (status === 400) {
      alert('提示', '登录后才能发布房源，是否登录', [
        { text: '取消' },
        {
          text: '去登录',
          onPress: () => {
            // 传入回跳地址
            let path = this.props.location.pathname
            this.props.history.push('/login', { backUrl: path })
          },
        },
      ])
    }
    Toast.fail(desc, 2)
  }

  render() {
    const Item = List.Item
    const { history } = this.props
    const {
      community,
      price,
      size,
      roomType,
      floor,
      oriented,
      description,
      tempSlides,
      title,
    } = this.state

    return (
      <div className={styles.root}>
        <NavBar
          className={styles.navHeader}
          mode="dark"
          icon={<Icon type="left" />}
          onLeftClick={this.onCancel}
        >
          发布房源
        </NavBar>
        <List
          className={styles.header}
          renderHeader={() => '基本信息'}
          data-role="rent-list"
        >
          {/* 选择所在小区 */}
          <Item
            extra={community.name || '请选择小区名称'}
            arrow="horizontal"
            onClick={() => history.replace('/rent/search')}
          >
            小区名称
          </Item>
          <InputItem
            placeholder="请输入租金/月"
            extra="￥/月"
            type="number"
            value={price}
            onChange={(val) => {
              this.handleVal('price', val)
            }}
          >
            租&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金
          </InputItem>
          <InputItem
            placeholder="请输入建筑面积"
            extra="㎡"
            type="number"
            value={size}
            onChange={(val) => {
              this.handleVal('size', val)
            }}
          >
            建筑面积
          </InputItem>
          <Picker
            data={roomTypeData}
            value={[roomType]}
            cols={1}
            onChange={(val) => {
              this.handleVal('roomType', val[0])
            }}
          >
            <Item arrow="horizontal">
              户&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型
            </Item>
          </Picker>

          <Picker
            data={floorData}
            value={[floor]}
            cols={1}
            onChange={(val) => {
              this.handleVal('floor', val[0])
            }}
          >
            <Item arrow="horizontal">所在楼层</Item>
          </Picker>
          <Picker
            data={orientedData}
            value={[oriented]}
            cols={1}
            onChange={(val) => {
              this.handleVal('oriented', val[0])
            }}
          >
            <Item arrow="horizontal">
              朝&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;向
            </Item>
          </Picker>
        </List>

        <List
          className={styles.title}
          renderHeader={() => '房屋标题'}
          data-role="rent-list"
        >
          <InputItem
            value={title}
            placeholder="请输入标题（例如：整租 小区名 2室 5000元）"
            onChange={(val) => {
              this.handleVal('title', val)
            }}
          />
        </List>

        <List
          className={styles.pics}
          renderHeader={() => '房屋图像'}
          data-role="rent-list"
        >
          <ImagePicker
            files={tempSlides}
            multiple={true}
            className={styles.imgpicker}
            onChange={(files) => {
              this.setState({
                tempSlides: files,
              })
            }}
          />
        </List>

        <List
          className={styles.supporting}
          renderHeader={() => '房屋配置'}
          data-role="rent-list"
        >
          {/* 改成接口传的参数supporting形式 => 子传父 => 把数据join成|分割的字符串 */}
          <HousePackage
            select
            onSelect={(selectd) => {
              this.setState({
                supporting: selectd.join('|'),
              })
            }}
          />
        </List>

        <List
          className={styles.desc}
          renderHeader={() => '房屋描述'}
          data-role="rent-list"
        >
          <TextareaItem
            rows={5}
            placeholder="请输入房屋描述信息"
            autoHeight
            value={description}
            onChange={(val) => {
              this.handleVal('description', val)
            }}
          />
        </List>

        <Flex className={styles.bottom}>
          <Flex.Item className={styles.cancel} onClick={this.onCancel}>
            取消
          </Flex.Item>
          <Flex.Item className={styles.confirm} onClick={this.addHouse}>
            提交
          </Flex.Item>
        </Flex>
      </div>
    )
  }
}
