import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  render() {
    const { onOkPicker, onCancelPicker, data, cols } = this.props
    return (
      // <>空标签 => 代码占位 => 不会渲染到页面里边 => 性能优化
      <>
        {/* 选择器组件： */}
        <PickerView data={data} value={null} cols={cols} />

        {/* 底部按钮 */}
        <FilterFooter onOkPicker={onOkPicker} onCancelPicker={onCancelPicker} />
      </>
    )
  }
}
