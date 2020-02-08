import _ from 'lodash'
import { AbstractSearchService } from '../../core/crud/services/search.service'
import { AbstractListService } from '../../core/crud/services/list.service'
import { AbstractEditService } from '../../core/crud/services/edit.service'
import { Book } from '../../typing'
import { observable } from 'mobx'
import { TopicService } from '../../core/services/toopic.service'

interface SearchFormData {
  book_type: string
  project_id: any
  title_like: any
  source_like: any
}

class Search extends AbstractSearchService<Store, SearchFormData> {
  getDefaultFormData() {
    return {
      book_type: 'magazine',
      project_id: TopicService.getDefaultValue() as number,
      title_like: null,
      source_like: null
    }
  }
  onSubmit() {
    this.context.list.fetch({ reset: true })
  }
}

class List extends AbstractListService<Store, Book> {
  getFetchURL() {
    return 'books'
  }
  getSearchParams() {
    const data = this.context.search.getValues()
    if(data.project_id === -1){
      data.project_id = null
    }
    return data
  }
}

export class Edit extends AbstractEditService<Store, Book> {

  @observable currentStep = 0

  getFetchURL() {return `books/${this.params.id}`}
  parseFetchedFormData(data: any) {
    return {
      ...data,
      author: _.chain(data.author).split('/').join(', ')
    }
  }

  onAdd() {
    this.currentStep = 0
    super.onAdd.call(this, arguments)
  }
  getSubmitURL() {
    return this.isEdit ? `books/${this.params.id}` : 'books'
  }
  getSubmitData() {
    const data = this.data
    data.book_type = 'magazine'
    data.project_ids = _.map(data.projects, p => {
      return p.id
    })


    return {
      ...data,
      author: _.chain(data.author).split(/,|，/).map(_.trim).join('/').value()
    }
  }

  getRemoveURL() {return `books/${this.params.id}`}
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
