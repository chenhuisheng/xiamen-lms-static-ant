import { Component } from 'react'
import React from 'react'
import { Breadcrumb, Layout } from 'antd'

const Content = Layout.Content

export class PageContainer extends Component<
  { className?: string }
  > {
  render() {
    return (
      <Content className="app-main">
        { this.props.children }
      </Content>
    )
  }
}

export class PageHeader extends Component<
  { breadcrumb: string[] }
  > {
  render() {
    return (
      <div className="page-header">
        <Breadcrumb>
          {
            this.props.breadcrumb.map((n, index) => {
              return (
                <Breadcrumb.Item key={index}>
                  {n}
                </Breadcrumb.Item>
              )
            })
          }
        </Breadcrumb>
      </div>
    )
  }
}

export class PageContent extends Component {
  render() {
    return (
      <div className="page-content">
        { this.props.children }
      </div>
    )
  }
}
