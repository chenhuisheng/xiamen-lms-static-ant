import _ from 'lodash'
import React, { Component } from 'react'
import { observer } from 'mobx-react'
import { computed, observable, toJS } from 'mobx'
import { Topic } from '../../typing'
import { CRUDStore } from '../../core/crud/crud.store'
import { Spin, Tag } from 'antd'
import '../../pages/topic/style.less'

export interface TopicSelectProps {
  defaultValue: number[]
  onChange: (keys: number[], items: Topic[]) => void
  showHeader?: boolean
}

@observer
export class TopicSelect extends Component<TopicSelectProps> {
  store: CRUDStore

  @observable items: Topic[] = []
  @observable item: Topic
  @observable selectedKeys: number[] = this.props.defaultValue || []

  @computed
  get selectedItems(): Topic[] {
    return _.map(this.selectedKeys, key => {
      return _.find(this.store.list.items, item => {
        return item.id === key
      })
    })
  }

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
    this.store.list.fetch()
  }

  render() {
    if (this.store.list.loading) {
      return (
        <div className="loading-container"><Spin /></div>
      )
    }

    return (
      <div className="topic-select">
        {this.props.showHeader && (
          <div className="header">请点击选择此图书所属的专题</div>
        )}

        {!!this.selectedItems.length && (
          <div className="topic-select__selected">
            <div className="title">已选中:</div>
            <div className="tag-list">
              {_.map(this.selectedItems, item => (
                <Tag
                  key={`${item.id}`}
                  closable={true}
                  onClose={() => this.onChange(false, item)}
                >
                  {item.title}
                </Tag>
              ))}
            </div>
          </div>
        )}

        <div className="topic-select__topic-list">
          <div className="tag-list">
            {_.map(this.store.list.items as Topic[], item => (
              <Tag.CheckableTag
                key={`${item.id}`}
                checked={this.isChecked(item.id)}
                onChange={checked => this.onChange(checked, item)}
              >
                {item.title}
              </Tag.CheckableTag>
            ))}
          </div>
        </div>
      </div>
    )
  }

  isChecked = (id: number) => {
    return _.includes(this.selectedKeys, id)
  }

  onChange = (checked: boolean, item: Topic) => {
    if (checked) {
      this.selectedKeys.push(item.id)
    } else {
      this.selectedKeys = _.pull(this.selectedKeys, item.id)
      this.item = item
    }
    this.props.onChange(toJS(this.selectedKeys), toJS(this.selectedItems))
  }
}
