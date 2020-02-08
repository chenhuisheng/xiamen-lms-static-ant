import { Icon, Menu } from 'antd'
import React from 'react'
import { ClickParam } from 'antd/lib/menu'
import { WindowLocation } from '@reach/router'
import { PUBLIC_PATH } from '../config'

export const AppMenu = (props: {
  location: WindowLocation
  onClick: (params: ClickParam) => void
}) => {
  const { location, onClick } = props
  const key = location.pathname.replace(`${PUBLIC_PATH}/`, '')

  return (
    <Menu
      className="app-nav-menu"
      theme="dark"
      mode="inline"
      defaultOpenKeys={['topic-group', 'resource-group']}
      defaultSelectedKeys={[key || 'dashboard']}
      onClick={onClick}
    >
      <Menu.Item key="dashboard">
        <Icon type="dashboard" /> 首页
      </Menu.Item>

      <Menu.Item key="topic">
        <Icon type="star" /> 专题管理
      </Menu.Item>

      <Menu.Item key="statistics">
        <Icon type="line-chart" /> 图书阅读统计
      </Menu.Item>

      {/* <Menu.SubMenu
        key="topic-group"
        title={<span><Icon type="star" /> 专题管理</span>}
      > */}
        {/* <Menu.Item key="topic">专题管理</Menu.Item> */}
        {/* <Menu.Item key="topic-book">专题图书</Menu.Item>
        <Menu.Item key="topic-swipe-list">轮播图片</Menu.Item> */}
      {/* </Menu.SubMenu> */}

      <Menu.SubMenu
        key="resource-group"
        title={<span><Icon type="book" /> 资源管理</span>}
      >
        <Menu.Item key="book">图书</Menu.Item>
        <Menu.Item key="magazine">报纸</Menu.Item>
        <Menu.Item key="paper">期刊</Menu.Item>
        <Menu.Item key="videos">视频</Menu.Item>
        <Menu.Item key="swipe-image">轮播</Menu.Item>
        <Menu.Item key="image">图片</Menu.Item>
      </Menu.SubMenu>

      <Menu.Item key="account">
        <Icon type="user" /> 账号管理
      </Menu.Item>
    </Menu>
  )
}
