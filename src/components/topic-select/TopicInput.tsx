import _ from 'lodash'
import React, { Component } from 'react'
import { Icon, Modal, Tag } from 'antd'
import { Topic } from '../../typing'
import { toJS } from 'mobx'
import { TopicSelect, TopicSelectProps } from './TopicSelect'
import ReactDOM from 'react-dom'

export class TopicInput extends Component<{
  value?: Topic[]
  onChange?: (selected: Topic[]) => void
}> {
  render() {
    return (
      <div className="topic-selector">
        {_.map(this.props.value, item => (
          <Tag
            key={`${item.id}`}
            closable={true}
            onClose={() => this.onClose(item)}
          >{item.title}</Tag>
        ))}

        <Tag
          onClick={this.openDialog}
          style={{ background: '#fff', borderStyle: 'dashed' }}
        >
          <Icon type="plus" /> 添加
        </Tag>
      </div>
    )
  }

  onClose = (data: Topic) => {
    const items = _.reject(this.props.value, item => {
      return item.id === data.id
    })
    if (this.props.onChange) {
      this.props.onChange(toJS(items))
    }
  }

  openDialog = () => {
    openTopicSelectModal({
      defaultValue: _.map(this.props.value,'id'),
      onConfirm: (items: Topic[]) => {
        if (this.props.onChange) {
          this.props.onChange(items)
        }
      }
    })
  }
}

interface TopicSelectModalProps extends TopicSelectProps {
  visible: boolean
  onConfirm: (items: Topic[]) => void
  onCancel: () => void
  onClose: () => void
}

class TopicSelectModal extends Component<TopicSelectModalProps> {

  selected: Topic[] = []

  render() {
    return (
      <Modal
        className="book-select-modal"
        title="选择专题"
        visible={this.props.visible}
        width={760}
        onOk={this.onConfirm}
        onCancel={() => this.props.onCancel()}
        afterClose={() => this.props.onClose()}
      >
        <TopicSelect
          defaultValue={this.props.defaultValue}
          onChange={this.onChange}
        />
      </Modal>
    )
  }

  onChange = (keys: number[], items: Topic[]) => {
    this.selected = items
  }
  onConfirm = () => {
    this.props.onConfirm(this.selected)
    this.props.onCancel()
  }
}

export const openTopicSelectModal = (config: Partial<TopicSelectModalProps>) => {
  const div = document.createElement('div')
  document.body.appendChild(div)

  const currentProps = {
    ...config,
    visible: true,
    onCancel,
    onClose
  } as TopicSelectModalProps

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
    ReactDOM.render(<TopicSelectModal {...props} />, div)
  }

  render(currentProps)
}
