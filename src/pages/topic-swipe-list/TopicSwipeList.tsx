import _ from 'lodash'
import React, { Component } from 'react'
import { PageContainer, PageContent, PageHeader } from '../../layouts/PageLayout'
import { observable } from 'mobx'
import { TopicService } from '../../core/services/toopic.service'
import { Store } from './store'
import { Button, message, Spin } from 'antd'
import TopicTabs from '../../components/TopicTabs'
import { RouteComponentProps } from '@reach/router'
import { observer } from 'mobx-react'
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContextProvider } from 'react-dnd'
import DragImageCardItem from './DragImageCardItem'
import { openImageSelectModal } from '../../components/image-select/ImageSelectModal'

@observer
class TopicSwipeList extends Component<RouteComponentProps> {

  store: Store

  @observable loading = true
  @observable isSorting = false

  async componentWillMount() {
    await TopicService.initialize()

    this.store = new Store()
    this.store.list.fetch()
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
              this.isSorting = false
              this.store.search.data = { topic_id }
              this.store.search.onSubmit()
            }}
          />

          <div className="page-toolbar-container">
            <div style={{ flex: 'auto' }}>
              <Button
                type={'primary'}
                onClick={this.onAddClick}
              >添加轮播图片</Button>
            </div>
            {
              !this.isSorting ? (
                <Button onClick={this.onSortClick}>图片排序</Button>
              ) : (
                <div>
                  <Button type={'primary'} onClick={this.onSortConfirmClick}>保存排序</Button>
                  <Button onClick={this.onSortCancelClick}>取消</Button>
                </div>
              )
            }
          </div>

          <DragDropContextProvider backend={HTML5Backend}>
            <div className="swipe-image-list">
              {_.map(this.store.list.items, item => (
                <DragImageCardItem
                  canDragging={this.isSorting}
                  store={this.store}
                  key={`${item.id}`}
                  data={item}
                  removeBtnVisible={!this.isSorting}
                  onRemoveClick={() => this.store.edit.onRemove(item)}
                />
              ))}
            </div>
          </DragDropContextProvider>
        </>
      )
    }

    return (
      <PageContainer>
        <PageHeader breadcrumb={['专题', '轮播图片']} />
        <PageContent>
          {content}
        </PageContent>
      </PageContainer>
    )
  }

  onAddClick = () => {
    openImageSelectModal({
      onConfirm: (keys: number[]) => {
        this.store.edit.data.picture_ids = keys
        this.store.edit.onEditSubmit()
      }
    })
  }

  onSortClick = () => {
    this.isSorting = true
  }
  onSortConfirmClick = async () => {
    await this.store.saveImageCardSort()
    this.isSorting = false
    message.success('保存成功')
  }
  onSortCancelClick = () => {
    this.isSorting = false
    this.store.list.fetch()
  }
}

export default TopicSwipeList
