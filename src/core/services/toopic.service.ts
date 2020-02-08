import _ from 'lodash'
import { GET } from '../../utils'
import { Topic } from '../../typing'

class TopicServiceClass {

  items: Topic[] = []

  async initialize() {
    if (!this.items.length) {
      const res = await GET('projects', {})
      this.items = res.data
    }
  }

  async getAll() {
    this.items = []
    await this.initialize()
    const whole = [{id: -1, title: '全部', summary:''}]
    const not_class = [{id: 0, title: '未分类', summary:''}]
    this.items = _.concat(whole, this.items)
    this.items = _.concat(this.items, not_class)
    return _.cloneDeep(this.items)
  }

  getDefaultValue() {
    if (!this.items.length) {
      console.error('TopicService Empty')
    }
    return _.chain(this.items).first().get('id').value()
  }
}

export const TopicService = new TopicServiceClass()
