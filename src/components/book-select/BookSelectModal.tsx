import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Book } from '../../typing'
import { message, Modal, Table } from 'antd'
import { observer } from 'mobx-react'
import { List, Store } from './store'
import BookThumbItem from '../BookThumbItem'
import { dateFormat } from '../../utils'
import { observable, toJS } from 'mobx'
import { TableRowSelection } from 'antd/lib/table'
import { Search } from '../../core/crud/Search'
import { FormFieldType } from '../../core/crud/commons/form-utils'

interface BookSelectProps {
  visible: boolean
  defaultSelect: number[]
  onConfirm: (value: number[]) => void
  onCancel: () => void
  onClose: () => void
}

@observer
export class BookSelectModal extends Component<BookSelectProps> {

  store: Store

  @observable
  selectedRowKeys: number[] = []

  constructor(props: any) {
    super(props)
    console.log('BookSelectModal Initial')
    this.store = new Store()
  }

  componentDidMount() {
    this.store.list.fetch()
  }

  render() {
    const list  = this.store.list as List

    const rowSelection: TableRowSelection<Book> = {
      selectedRowKeys: this.selectedRowKeys,
      onChange: this.onSelectChange
    }

    return (
      <Modal
        className="book-select-modal"
        title="选择图书"
        visible={this.props.visible}
        width={760}
        onOk={this.onConfirm}
        onCancel={() => this.props.onCancel()}
        afterClose={() => this.props.onClose()}
      >
        <Search
          service={this.store.search}
          fields={[
            { label: '书名', dataKey: 'title_like', type: FormFieldType.TextInput },
            { label: '作者', dataKey: 'author_like`````', type: FormFieldType.TextInput }
          ]}
          columns = {[]}
          onAdd={() => {this.store.edit.onAdd()}}
          onEdit={(item) => {this.store.edit.onEdit(item)}}
          onRemove={(item) => {this.store.edit.onRemove(item)}}
        />

        {this.props.visible && (
          <div className="page-table-container">
            <Table
              dataSource={toJS(list.items)}
              rowSelection={rowSelection}
              columns={[
                { title: '#',
                  key: 'index',
                  render: (text, row, index) => this.store.list.indexMethod(index),
                  width: '5em'
                },
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
              rowKey={record => `${record.id}`}
              pagination={{
                defaultCurrent: list.index,
                pageSize: list.size,
                total: list.total,
                showQuickJumper: true,
                hideOnSinglePage: true
              }}
              onChange={this.onPageIndexChange}
              loading={list.loading}
            />
          </div>
        )}
      </Modal>
    )
  }

  onPageIndexChange = (pagination: any) => {
    this.store.list.handlePageIndexChange(pagination.current)
  }
  onSelectChange = (keys: number[]) => {
    console.log('onSelectChange', keys)
    this.selectedRowKeys = keys
  }

  onConfirm = () => {
    if (!this.selectedRowKeys.length) {
      message.warning('请选择图书')
      return
    }
    this.props.onConfirm(toJS(this.selectedRowKeys))
    this.props.onCancel()
  }
}

export const openBookSelectModal = (config: Partial<BookSelectProps>) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  const currentProps = {
    ...config,
    visible: true,
    onCancel,
    onClose
  } as BookSelectProps

  function onCancel() {
    render({
      ...currentProps,
      visible: false
    })
  }

  function onClose() {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
  }

  function render(props: any) {
    ReactDOM.render(<BookSelectModal {...props} />, div)
  }

  render(currentProps)
}
