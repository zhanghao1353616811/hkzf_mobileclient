import React from 'react'
import ReactDOM from 'react-dom'

// 引入字体图标的样式
import './assets/fonts/iconfont.css'
// 引入全局样式
import './index.css'

import App from './App'

import * as serviceWorker from './serviceWorker'
serviceWorker.unregister()

ReactDOM.render(
  <App />,
  document.getElementById('root')
)

