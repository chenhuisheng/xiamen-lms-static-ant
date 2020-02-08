import _ from 'lodash'
import React, { Component } from 'react'
import { Tabs } from 'antd'
import { observable } from 'mobx'
import { observer } from 'mobx-react'
import { Topic } from '../typing'
import { TopicService } from '../core/services/toopic.service'

@observer
class TopicTabs extends Component<{
  defaultValue: number
  onChange: (id: number) => void
}> {

  @observable
  data: Topic[] = []

  async componentDidMount() {
    this.data = await TopicService.getAll()
  }

  render() {
    return (
      <div className="topic-tabs-container">
        <Tabs
          defaultActiveKey={`${this.props.defaultValue}`}
          onChange={key => {
            this.props.onChange(+key)
          }}
        >
          {_.map(this.data, item => (
            <Tabs.TabPane
              key={`${item.id}`}
              tab={item.title}
            >
            </Tabs.TabPane>
          ))}
        </Tabs>
      </div>
    )
  }
}

export default TopicTabs
