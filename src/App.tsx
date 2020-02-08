import * as React from 'react'
import { LocaleProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { AppRouter } from './Router'
import DevTools from 'mobx-react-devtools'

class App extends React.Component {
  public render() {
    return (
      <LocaleProvider locale={zhCN}>
        <div className="App">
          <AppRouter />
          { process.env.NODE_ENV === 'development' &&
          <DevTools />
          }
        </div>
      </LocaleProvider>
    )
  }
}

export default App
