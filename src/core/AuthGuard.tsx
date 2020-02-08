import React, { Component } from 'react'
import { navigate, RouteComponentProps } from '@reach/router'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { UserService } from './services/user.service'
import { Spin } from 'antd'
import { PUBLIC_PATH } from '../config'

@observer
export class AuthGuard extends Component<RouteComponentProps> {

  @observable
  loading = true

  async componentDidMount() {
    try {
      await UserService.fetchUserInfo()
      this.loading = false

    } catch (e) {
      console.error(e)
      navigate(`${PUBLIC_PATH}/login${location.search}`)
    }
  }

  render() {
    if (this.loading) {
      return (
        <div className="app-loading-container">
          <Spin size="large" tip="正在加载" />
        </div>
      )
    }
    return this.props.children
  }
}
