import React, { Component } from 'react'
import { RouteComponentProps } from '@reach/router'
import { CRUDStore } from '../../core/crud/crud.store'
import { FormFieldType } from '../../core/crud/commons/form-utils'
import { Table } from '../../core/crud/Table'
import { EditModal } from '../../core/crud/Edit'
import { PageContainer, PageContent, PageHeader } from '../../layouts/PageLayout'
import { Button } from 'antd'

class Topic extends Component<RouteComponentProps> {

  store: CRUDStore

  componentWillMount() {
    this.store = new CRUDStore({
      fetchUrl: 'projects',
      removeUrl: () => `projects/${ this.store.edit.params.id }`,
      editFetchURL: () => '',
      editSubmitURL: () => {
        return this.store.edit.isEdit ?
          `projects/${ this.store.edit.params.id }` :
          'projects'
      },
      searchDefaultFormData: () => {
        return {}
      },
      editDefaultFormData: () => {
        return {}
      }
    })
  }

  render() {
    const list = (
      <>
        <div className="page-toolbar-container">
          <div style={{ flex: 'auto' }}>
            <Button
              type={'primary'}
              onClick={() => this.store.edit.onAdd()}
            >添加专题</Button>
          </div>
        </div>
        <Table
          service={this.store.list}
          columns={[
            { title: '专题名称',
              dataIndex: 'title'
            },
            { title: '专题介绍',
              dataIndex: 'summary'
            },
            { title: '图书数量',
              dataIndex: 'book_count',
              align: 'right'
            },
            { title: '轮播图片数',
              dataIndex: 'picture_count',
              align: 'right'
            },
            {
              width: 80
            }
          ]}
          renderActions={() => {
            return {
              title: '操作',
              key: 'actions',
              width: 80,
              render: (text, row) => (
                <span>
                  <a onClick={() =>
                    this.store.edit.onEdit(row)
                  }>编辑</a>
                </span>
              )
            }
          }}
          onAdd={() => this.store.edit.onAdd()}
          onEdit={(row, options) => this.store.edit.onEdit(row, options)}
          onRemove={(row) => this.store.edit.onRemove(row)}
        />
      </>
    )
    const edit = (
      <EditModal
        service={this.store.edit}
        fields={[
          { label: '专题名称', type: FormFieldType.TextInput, dataKey: 'title', required: true },
          { label: '专题描述', type: FormFieldType.TextArea, dataKey: 'summary' },
        ]}
      />
    )

    return (
      <PageContainer>
        <PageHeader breadcrumb={['专题管理']} />
        <PageContent>
          { list }
          { edit }
        </PageContent>
      </PageContainer>
    )
  }
}

export default Topic
