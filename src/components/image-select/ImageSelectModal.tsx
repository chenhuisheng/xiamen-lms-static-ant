import _ from 'lodash'
import React, { Component } from 'react'
import { message, Modal, Pagination } from 'antd'
import { observable, toJS } from 'mobx'
import { Store } from './store'
import { observer } from 'mobx-react'
import { ImageCardItem } from '../ImageCardItem'
import ReactDOM from 'react-dom'
import { ImageCardData } from '../../typing'

interface ImageSelectProps {
  visible: boolean
  defaultSelect: number[]
  onConfirm: (value: number[]) => void
  onCancel: () => void
  onClose: () => void
}

@observer
export class ImageSelectModal extends Component<ImageSelectProps> {

  store: Store

  @observable
  selectedRowKeys: number[] = []

  constructor(props: any) {
    super(props)
    this.store = new Store()
  }

  componentDidMount() {
    this.store.list.fetch()
  }

  render() {
    return (
      <Modal
        className="image-select-modal"
        title="选择图片"
        visible={this.props.visible}
        width={860}
        onOk={this.onConfirm}
        onCancel={() => this.props.onCancel()}
        afterClose={() => this.props.onClose()}
      >
        {this.props.visible && (
          <div className="page-table-container">

            <div className="image-card-list">
              {_.map(this.store.list.items, item => (
                <ImageCardItem
                  key={`${item.id}`}
                  data={item}
                  width={260}
                  checked={this.isItemChecked(item)}
                  onCheckChange={this.onCheckChange}
                />
              ))}
            </div>

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <Pagination
                defaultCurrent={this.store.list.index}
                pageSize={this.store.list.size}
                total={this.store.list.total}
                showQuickJumper={true}
                hideOnSinglePage={true}
                onChange={this.onPageIndexChange}
              />
            </div>
          </div>
        )}
      </Modal>
    )
  }

  onPageIndexChange = (page: number) => {
    this.store.list.handlePageIndexChange(page)
  }
  onSelectChange = (check: boolean, data: any) => {
    console.log('onSelectChange', check, data)
    // this.selectedRowKeys = keys
  }

  onConfirm = () => {
    if (!this.selectedRowKeys.length) {
      message.warning('请选择图片')
      return
    }
    this.props.onConfirm(toJS(this.selectedRowKeys))
    this.props.onCancel()
  }

  isItemChecked = (item: ImageCardData) => {
    return _.includes(this.selectedRowKeys, item.id)
  }
  onCheckChange = (item: ImageCardData) => {
    if (this.isItemChecked(item)) {
      this.selectedRowKeys = _.pull(this.selectedRowKeys, item.id)
    } else {
      this.selectedRowKeys.unshift(item.id)
    }
  }
}

export const openImageSelectModal = (config: Partial<ImageSelectProps>) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  const currentProps = {
    ...config,
    visible: true,
    onCancel,
    onClose
  } as ImageSelectProps

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
    ReactDOM.render(<ImageSelectModal {...props} />, div)
  }

  render(currentProps)
}
