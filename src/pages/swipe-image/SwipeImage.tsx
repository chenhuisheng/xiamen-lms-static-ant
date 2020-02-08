import React, { Component } from 'react'
import { PageContainer, PageContent, PageHeader } from '../../layouts/PageLayout'
import { RouteComponentProps } from '@reach/router'
import _ from 'lodash'
import { ImageCardItem } from '../../components/ImageCardItem'
import { observer } from 'mobx-react'
import { Pagination } from 'antd'
import { Store } from './store'
import { SwipeImageEditModal } from './SwipeImageEditModal'
import TopicTabs from '../../components/TopicTabs'
import { FormFieldType } from '../../core/crud/commons/form-utils'
import { Search } from '../../core/crud/Search'
import { AbstractListService } from '../../core/crud/services/list.service'
import { TableConfigProps } from '../../core/crud/typing'

interface TableServiceProp {
  service: AbstractListService
}

@observer
export class List extends Component<
  TableServiceProp & TableConfigProps
> {
  list = this.props.service
  componentWillMount() {
    this.list.fetch({ reset: true })
  }
  render(){
    const list = (
      <>
        <div className="image-card-list">
          {_.map(this.list.items, item => (
            <ImageCardItem
              key={`${item.id}`}
              data={item}
              editBtnVisible={true}
              removeBtnVisible={true}
              onEditClick={() => this.props.onEdit(item)}
              onRemoveClick={() => this.props.onRemove(item)}
            />
          ))}
        </div>

        <div style={{ textAlign: 'right' }}>
          <Pagination
            current={this.list.index}
            pageSize={this.list.size}
            total={this.list.total}
            showQuickJumper={true}
            hideOnSinglePage={true}
            onChange={index => this.list.handlePageIndexChange(index)}
          />
        </div>
      </>
    )
  return list
  }
}

class SwipeImage extends Component<RouteComponentProps> {

  store: Store

  componentWillMount() {
    this.store = new Store()
  }

  render() {
    const search = (
      <Search
        service={this.store.search}
        fields={[
          { label: '标题', dataKey: 'title_like', type: FormFieldType.TextInput }
        ]}
        columns = {[]}
        onAdd={() => {this.store.edit.onAdd()}}
        onEdit={(item) => {this.store.edit.onEdit(item)}}
        onRemove={(item) => {this.store.edit.onRemove(item)}}
      />
    )
    const list = (
      <>
        <TopicTabs
          defaultValue={this.store.search.data.project_id}
          onChange={project_id => {
              this.store.search.data = {
                project_id,
                type: 'banner',
                title_like: this.store.search.data.title_like
              }
              this.store.search.onSubmit()
          }}
        />
        <List
          service={this.store.list}
          columns={[]}
          onAdd={() => {this.store.edit.onAdd()}}
          onEdit={(item) => {this.store.edit.onEdit(item)}}
          onRemove={(item) => {this.store.edit.onRemove(item)}}
        />
      </>
    )
    const edit = (
      <SwipeImageEditModal
        service={this.store.edit}
      />
    )

    return (
      <PageContainer>
        <PageHeader breadcrumb={['资源库', '轮播']} />
        <PageContent>
          { search }
          { list }
          { edit }

        </PageContent>
      </PageContainer>
    )
  }
}

export default SwipeImage
