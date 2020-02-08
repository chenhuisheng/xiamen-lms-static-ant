import React, { Component } from 'react'
import { RouteComponentProps } from '@reach/router'
import { PageContainer, PageContent, PageHeader } from '../../layouts/PageLayout'
import { Store } from './store'
import { observer } from 'mobx-react'
import { Button, Popconfirm, Spin } from 'antd'
import { TopicService } from '../../core/services/toopic.service'
import { observable } from 'mobx'
import TopicTabs from '../../components/TopicTabs'
import { Table } from '../../core/crud/Table'
import { dateFormat } from '../../utils'
import BookThumbItem from '../../components/BookThumbItem'
import { openBookSelectModal } from '../../components/book-select/BookSelectModal'

@observer
class TopicBook extends Component<RouteComponentProps> {

  store: Store

  @observable loading = true

  async componentWillMount() {
    await TopicService.initialize()

    this.store = new Store()
    this.loading = false
  }

  render() {
    let content = null

    if (this.loading) {
      content = (
        <div className="loading-container">
          <Spin />
        </div>
      )
    }
    else if (!TopicService.getDefaultValue()) {
      content = (
        <div className="page-empty-container">
          <div className="title">您还未创建专题哦</div>
          <div className="desc">请先至【专题管理】中创建专题，如“历史记忆”，再选择专题下要展示的图书</div>
        </div>
      )
    }
    else {
      content = (
        <>
          <TopicTabs
            defaultValue={this.store.search.data.topic_id}
            onChange={topic_id => {
              this.store.search.data = { topic_id }
              this.store.search.onSubmit()
            }}
          />
          <Table
            service={this.store.list}
            columns={[
              { title: '图书信息',
                render: (index, row) => {
                  return (<BookThumbItem book={row} />)
                }
              },
              { title: '上传时间',
                dataIndex: 'created_at',
                render: (val) => {
                  return <span>{dateFormat(val, 'YYYY-MM-DD HH:mm')}</span>
                }
              }
            ]}
            onAdd={() => {}}
            onEdit={() => {}}
            onRemove={item => this.store.edit.onRemove(item)}
            toolbarRender={() => (
              <Button
                type="primary"
                onClick={this.onAddClick}
              >新增</Button>
            )}
            renderActions={() => {
              return {
                title: '操作',
                render: (index, row) => (
                  <Popconfirm title="确认移除" onConfirm={() => this.store.edit.onRemove(row)}>
                    <a>移除</a>
                  </Popconfirm>
                )
              }
            }}
          />
        </>
      )
    }

    return (
      <PageContainer>
        <PageHeader breadcrumb={['专题', '专题图书']} />
        <PageContent>
          {content}
        </PageContent>
      </PageContainer>
    )
  }

  onAddClick = () => {
    openBookSelectModal({
      onConfirm: (keys) => {
        this.store.edit.data.selected = keys
        this.store.edit.onEditSubmit()
      }
    })
  }
}

export default TopicBook
