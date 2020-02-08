import _ from 'lodash'
import React, { Component } from 'react'
import { RouteComponentProps } from '@reach/router'
import { PageContainer, PageContent, PageHeader } from '../../layouts/PageLayout'
import { Search } from '../../core/crud/Search'
import { FormFieldType } from '../../core/crud/commons/form-utils'
import { Table } from '../../core/crud/Table'
import VideosThumbItem from '../../components/VideosThumbItem'
import { dateFormat } from '../../utils'
import { Store } from './store'
import { VideosEditModal } from './VideosEditModal'
import TopicTabs from '../../components/TopicTabs'

class Videos extends Component<RouteComponentProps> {

  store: Store

  componentWillMount() {
    this.store = new Store()
  }

  render() {
    const search = (
      <Search
        service={this.store.search}
        fields={[
          { label: '视频名', dataKey: 'title_like', type: FormFieldType.TextInput },
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
                title_like: this.store.search.data.title_like,
              }
              this.store.search.onSubmit()
          }}
        />
        <Table
          service={this.store.list}
          columns={[
            { title: '视频信息',
              render: (index, row) => (
                <VideosThumbItem videos={row} />
              )
            },
            { title: '所属专题',
              dataIndex: 'projects',
              render: projects => _.chain(projects).map('name').join(', ').value()
            },
            { title: '上传时间',
              dataIndex: 'created_at',
              render: (date) => dateFormat(date)
            }
          ]}
          onAdd={() => {this.store.edit.onAdd()}}
          onEdit={(item) => {this.store.edit.onEdit(item)}}
          onRemove={(item) => {this.store.edit.onRemove(item)}}
        />
      </>
    )

    const edit = (
      <VideosEditModal
        service={this.store.edit}
      />
    )

    return (
      <PageContainer>
        <PageHeader breadcrumb={['资源', '视频']} />
        <PageContent>
          { search }
          { list }
          { edit }
        </PageContent>
      </PageContainer>
    )
  }
}

export default Videos
