import _ from 'lodash'
import { AbstractSearchService } from '../../core/crud/services/search.service'
import { AbstractListService } from '../../core/crud/services/list.service'
import { AbstractEditService } from '../../core/crud/services/edit.service'
import { Book } from '../../typing'
import { observable } from 'mobx'

class Search extends AbstractSearchService<Store> {
  getDefaultFormData() {
    return {}
  }
  onSubmit() {
    this.context.list.fetch({ reset: true })
  }
}

export class List extends AbstractListService<Store> {
  getFetchURL() {
    return 'books'
  }
  getSearchParams() {
    return this.context.search.getValues()
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
    data.book_type = 'book'
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
