import React, { Component } from 'react'
import { navigate, RouteComponentProps, Location } from '@reach/router'
import { Dropdown, Icon, Layout, Menu } from 'antd'
import { UserService } from '../core/services/user.service'
import { observer } from 'mobx-react'
import { PUBLIC_PATH } from '../config'
import { ClickParam } from 'antd/lib/menu'
import { AppMenu } from './AppMenu'
import logo from '../styles/images/logo.png'
import ChangePassword from '../pages/account/ChangePassword'
import { observable } from 'mobx'

export class DefaultLayout extends Component<RouteComponentProps> {
  componentDidUpdate(prevProps: any) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }
  render() {
    return (
      <Layout className="app-default-layout">
        <AppSider />
        <Layout>
          <AppHeader />
          <Layout className="app-route-container">
            { this.props.children }
          </Layout>
        </Layout>
      </Layout>
    )
  }
}

@observer
class AppHeader extends Component {

  @observable CPVisible = false

  render() {
    const { user } = UserService

    const userMenu = (
      <Dropdown
        className="user"
        overlay={
          <Menu>
            <Menu.Item onClick={this.onChangePasswordClick}>
              <Icon type="lock" /> 修改密码
            </Menu.Item>
            <Menu.Item onClick={this.onLogoutClick}>
              <Icon type="logout" /> 退出登录
            </Menu.Item>
          </Menu>
        }
      >
        <a className="ant-dropdown-link">
          {user.name} <Icon type="down" />
        </a>
      </Dropdown>
    )

    return (
      <Layout.Header className="app-header">
        <div className="title">

        </div>
        <div className="actions">
          {userMenu}
        </div>

        <ChangePassword
          visible={this.CPVisible}
          onClose={() => {this.CPVisible = false}}
        />
      </Layout.Header>
    )
  }

  onChangePasswordClick = () => {
    this.CPVisible = true
  }
  onLogoutClick = async () => {
    await UserService.logout()
    navigate(`${PUBLIC_PATH}/login`)
  }
}

class AppSider extends Component {
  render() {
    return (
      <Layout.Sider
        className="app-sider"
        width={240}
      >
        <div className="antd-pro-components-sider-menu-logo">
          <img src={logo} alt="" />
        </div>

        <Location>
          {({ location }) => (
            <AppMenu
              location={location}
              onClick={this.onClick}
            />
          )}
        </Location>
      </Layout.Sider>
    )
  }

  onClick = (params: ClickParam) => {
    navigate(`${PUBLIC_PATH}/${params.key}`)
  }
}
