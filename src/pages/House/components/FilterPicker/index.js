import React, { Component } from 'react'
import { PickerView } from 'antd-mobile'

import FilterFooter from '../../../../components/FilterFooter'

export default class FilterPicker extends Component {
  // 当前picker选中的值
  state = {
    // 给状态数据设置默认选中值
    value: this.props.value
  }

  // 修改选中值
  setValue = (value) =>{
    this.setState({
      value
    })
  }
  
  render() {
    const { onOkPicker, onCancelPicker, data, cols } = this.props
    return (
      // <>空标签 => 代码占位 => 不会渲染到页面里边 => 性能优化
      <>
        {/* 选择器组件： */}
        <PickerView data={data} cols={cols} value={this.state.value} onChange={this.setValue} />

        {/* 底部按钮 */}
        <FilterFooter onOkPicker={()=>{onOkPicker(this.state.value)}} onCancelPicker={onCancelPicker} />
      </>
    )
  }
}
