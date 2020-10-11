import React, { Component } from 'react'

import FilterFooter from '../../../../components/FilterFooter'

import styles from './index.module.css'

export default class FilterMore extends Component {
  state = {
    // 定义选中条件的状态数据
    selectedVal: this.props.value,
  }

  // 1. 创建选中的状态数据=>[]
  // 2. 添加点击事件处理选中数据=>indexOf判断是否存在
  // 3. 不存在 添加
  // 4. 存在，删除（splice）
  // 处理选中的条件数据
  handlerSel = (currVal) => {
    const { selectedVal } = this.state
    // 拷贝新的数据
    const newSelected = [...selectedVal]
    const currValIndex = selectedVal.indexOf(currVal)
    // 根据当前选中的数据返回的索引做判断
    if (currValIndex >= 0) {
      // 已经选择就取消
      newSelected.splice(currValIndex, 1)
    } else {
      // 没选择就添加
      newSelected.push(currVal)
    }
    this.setState({
      selectedVal: newSelected,
    })
  }

  // 渲染标签
  renderFilters(data) {
    // 高亮类名： styles.tagActive
    const { selectedVal } = this.state
    return data.map((item) => (
      <span
        onClick={() => {
          this.handlerSel(item.value)
        }}
        key={item.value}
        className={[
          styles.tag,
          selectedVal.includes(item.value) ? styles.tagActive : '',
        ].join(' ')}
      >
        {item.label}
      </span>
    ))
  }

  render() {
    const {
      data: { roomType, oriented, floor, characteristic },
      onOkPicker,
      onCancelPicker,
    } = this.props
    return (
      <div className={styles.root}>
        {/* 遮罩层 */}
        <div className={styles.mask} onClick={onOkPicker} />

        {/* 条件内容 */}
        <div className={styles.tags}>
          <dl className={styles.dl}>
            <dt className={styles.dt}>户型</dt>
            <dd className={styles.dd}>{this.renderFilters(roomType)}</dd>

            <dt className={styles.dt}>朝向</dt>
            <dd className={styles.dd}>{this.renderFilters(oriented)}</dd>

            <dt className={styles.dt}>楼层</dt>
            <dd className={styles.dd}>{this.renderFilters(floor)}</dd>

            <dt className={styles.dt}>房屋亮点</dt>
            <dd className={styles.dd}>{this.renderFilters(characteristic)}</dd>
          </dl>
        </div>

        {/* 底部按钮 */}
        <FilterFooter
          className={styles.footer}
          onOkPicker={() => {
            onOkPicker(this.state.selectedVal)
          }}
          onCancelPicker={onCancelPicker}
        />
      </div>
    )
  }
}
