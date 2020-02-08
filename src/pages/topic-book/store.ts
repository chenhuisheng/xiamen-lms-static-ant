import _ from 'lodash'
import { AbstractListService } from '../../core/crud/services/list.service'
import { AbstractSearchService } from '../../core/crud/services/search.service'
import { TopicService } from '../../core/services/toopic.service'
import { AbstractEditService } from '../../core/crud/services/edit.service'
import { Book } from '../../typing'

interface SearchFormData {
  topic_id: number
}
interface EditFormData {
  selected?: number[]
  books: Array<{ book_id: number }>
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

class List extends AbstractListService<Store> {
  getFetchURL() {
    return `projects/${this.context.search.data.topic_id}/books`
  }
  getSearchParams() {
    return {
      ...this.context.search.getValues()
    }
  }
}

class Edit extends AbstractEditService<Store, EditFormData, Book> {
  getFetchURL() {return ''}
  getSubmitURL() {
    return `projects/${this.context.search.data.topic_id}/books`
  }
  getSubmitData() {
    return {
      books: _.map(this.data.selected, book_id => {
        return { book_id }
      })
    }
  }
  getRemoveURL() {
    return `projects/${this.context.search.data.topic_id}/books/${this.params.id}`
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
}
