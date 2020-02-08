import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import './index.less'

import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

ReactDOM.render(
  <App />,
  document.getElementById('root') as HTMLElement
)

