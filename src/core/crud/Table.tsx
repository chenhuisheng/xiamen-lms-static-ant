import _ from 'lodash'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { Divider, Popconfirm, Table as AntTable } from 'antd'
import { TableConfigProps } from './typing'
import { AbstractListService } from './services/list.service'
import { toJS } from 'mobx'

interface TableServiceProp {
  service: AbstractListService
}

@observer
export class Table extends Component<
  TableServiceProp & TableConfigProps
> {

  list = this.props.service

  componentDidMount() {
    this.list.fetch({ reset: true })
  }

  render() {
    const columns = this.getColumnProps()

    return (
      <>
        {/* { this.renderToolbar() } */}

        <div className="page-table-container">
          <AntTable
            dataSource={toJS(this.list.items)}
            columns={columns}
            rowKey={record => {
              return this.props.rowIndex ?
                this.props.rowIndex(record) :
                `${record.id}`
            }}
            pagination={{
              defaultCurrent: this.list.index,
              pageSize: this.list.size,
              total: this.list.total,
              showQuickJumper: true,
              hideOnSinglePage: true
            }}
            onChange={this.onPageIndexChange}
            loading={this.list.loading}
            size={this.props.size}
          />
        </div>
      </>
    )
  }

  // private renderToolbar() {
  //   const defaultToolbar =  (
  //     <Button
  //       type="primary"
  //       onClick={this.onAddClick}
  //     >新增</Button>
  //   )
  //   return (
  //     <div className="page-toolbar-container">
  //       {this.props.toolbarRender ?
  //         this.props.toolbarRender() :
  //         defaultToolbar
  //       }
  //     </div>
  //   )
  // }

  private getColumnProps() {
    const columns = [...this.props.columns]
    columns.unshift({
      title: '#',
      key: 'index',
      render: (text, row, index) => this.props.service.indexMethod(index),
      width: '6em'
    })

    if (_.isFunction(this.props.renderActions)) {
      columns.push(this.props.renderActions())
    }
    else if (
      !('renderActions' in this.props) ||
      ((_.isBoolean(this.props.renderActions) && this.props.renderActions))
    ) {
      columns.push({
        title: '操作',
        key: 'actions',
        width: 120,
        render: (text, row) => (
          <span>
            <a onClick={() =>
              this.props.onEdit(row)
            }>编辑</a>
            <Divider type="vertical" />
            <Popconfirm title="确认删除" onConfirm={() => this.props.onRemove(row)}>
              <a>删除</a>
            </Popconfirm>
          </span>
        )
      })
    }

    return columns
  }

  private onPageIndexChange = (pagination: any) => {
    this.list.handlePageIndexChange(pagination.current)
  }

  // private onAddClick = () => {
  //   if (this.props.onAdd) {
  //     this.props.onAdd()
  //   }
  // }
}
