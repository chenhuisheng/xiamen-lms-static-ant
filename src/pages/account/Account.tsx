import React, { Component } from 'react'
import { CRUDStore } from '../../core/crud/crud.store'
import { Table } from '../../core/crud/Table'
import { EditModal } from '../../core/crud/Edit'
import { FormFieldType } from '../../core/crud/commons/form-utils'
import { PageContainer, PageContent, PageHeader } from '../../layouts/PageLayout'
import { RouteComponentProps } from '@reach/router'
import { observer } from 'mobx-react'
import { Divider, Input, Modal, Popconfirm } from 'antd'
import { POST } from '../../utils'

@observer
class Account extends Component<RouteComponentProps> {

  store: CRUDStore

  componentWillMount() {
    this.store = new CRUDStore({
      fetchUrl: 'account',
      searchDefaultFormData: () => {
        return {}
      },
      editFetchURL: () => '',
      editSubmitURL: () => {
        return this.store.edit.isEdit ? `account/${this.store.edit.params.id}` : `account`
      },
      removeUrl: () => `account/${this.store.edit.params.id}`,
      editDefaultFormData: () => {
        return {}
      }
    })
  }

  render() {
    const list = (
      <Table
        service={this.store.list}
        columns={[
          { title: '用户名',
            dataIndex: 'name'
          },
          { title: '手机号',
            dataIndex: 'phone'
          },
          {
            width: 80
          }
        ]}
        renderActions={() => {
          return {
            title: '操作',
            key: 'actions',
            width: 200,
            render: (text, row) => (
              <span>
                <a onClick={() =>
                  this.store.edit.onEdit(row)
                }>编辑</a>
                <Divider type="vertical" />
                <Popconfirm title="确认删除" onConfirm={() => this.store.edit.onRemove(row)}>
                  <a>删除</a>
                </Popconfirm>
                <Divider type="vertical" />
                <a onClick={() => this.resetPassword(row)}>重置密码</a>
              </span>
            )
          }
        }}
        onAdd={() => this.store.edit.onAdd()}
        onEdit={(row, options) => this.store.edit.onEdit(row, options)}
        onRemove={(row) => this.store.edit.onRemove(row)}
      />
    )

    const fields = [
      { label: '用户名', type: FormFieldType.TextInput, dataKey: 'name', required: true },
      { label: '手机号', type: FormFieldType.TextInput, dataKey: 'phone', required: true },
      ...(() => {
        if (!this.store.edit.isEdit) {
          return [{
            label: '密码',
            type: FormFieldType.TextInput,
            dataKey: 'password',
            render: () => {
              return (
                <Input placeholder="留空则默认为123456" />
              )
            }
          }]
        } else {
          return []
        }
      })()
    ]
    const edit = (
      <EditModal
        service={this.store.edit}
        fields={fields}
      />
    )

    return (
      <PageContainer>
        <PageHeader breadcrumb={['账号管理']} />
        <PageContent>
          { list }
          { edit }
        </PageContent>
      </PageContainer>
    )
  }

  resetPassword = (item: any) => {
    Modal.confirm({
      title: '确定重置密码为 123456',
      onOk: async () => {
        await POST('account/password_reset', {
          data: { admin_id: item.id }
        })
        Modal.success({
          title: '密码重置成功',
          content: `用户【${item.name}】的登录密码已重置为: 123456, 请尽快修改`
        })
      }
    })
  }
}

export default Account
