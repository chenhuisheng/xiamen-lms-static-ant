import _ from 'lodash'
import { AbstractSearchService } from '../../core/crud/services/search.service'
import { TopicService } from '../../core/services/toopic.service'
import { AbstractListService } from '../../core/crud/services/list.service'
import { AbstractEditService } from '../../core/crud/services/edit.service'
import { ImageCardData } from '../../typing'
import { move, POST } from '../../utils'

interface SearchFormData {
  topic_id: number
}
export interface MoveItemProps {
  id: number
  index: number
}
interface EditFormData {
  picture_ids: number[]
}

class Search extends AbstractSearchService<Store, SearchFormData> {
  getDefaultFormData() {
    return {
      topic_id: TopicService.getDefaultValue() as number
    }
  }
  onSubmit() {
    this.context.list.fetch()
  }
}

class List extends AbstractListService<Store, ImageCardData> {
  getFetchURL() {
    return `projects/${this.context.search.data.topic_id}/loop_picture`
  }
  getSearchParams() {
    return {
      ...this.context.search.getValues()
    }
  }
  parseFetchedItems(items: ImageCardData[]) {
    return _.map(items, (item, index) => {
      return {
        ...item,
        title: `${item.id}`,
        index
      }
    })
  }
}

class Edit extends AbstractEditService<Store, EditFormData, ImageCardData> {
  getFetchURL() {return ''}
  getRemoveURL() {
    return `projects/${this.context.search.data.topic_id}/loop_picture/${this.context.edit.params.id}`
  }
  getSubmitURL() {
    return `projects/${this.context.search.data.topic_id}/loop_picture`
  }
  requestListReload(options: any) {
    this.context.list.fetch(options)
  }
}

export class Store {
  search: Search
  list: List
  edit: Edit

  constructor() {
    this.search = new Search(this)
    this.list = new List(this)
    this.edit = new Edit(this)
  }

  moveImageCard(from: MoveItemProps, to: MoveItemProps) {
    const currentItems: ImageCardData[] = move(this.list.items, from.index, to.index)
    _.forEach(currentItems, (item, index) => {
      item.index = index
    })
    this.list.items = currentItems
  }

  async saveImageCardSort() {
    await POST(`projects/${this.search.data.topic_id}/loop_picture/set_order`, {
      data: {
        sorted_ids: _.map(this.list.items, 'id')
      }
    })
  }
}
