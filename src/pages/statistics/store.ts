import _ from 'lodash'
import { AbstractSearchService } from '../../core/crud/services/search.service'
import { AbstractListService } from '../../core/crud/services/list.service'
import { Statistics } from '../../typing'

interface SearchFormData {
  date_begin: any
  date_end: any
}
class Search extends AbstractSearchService<Store, SearchFormData> {
  getDefaultFormData() {
    return {
      date_begin: '',
      date_end: ''
    }
  }
  onSubmit() {
    this.context.list.fetch({ reset: true })
  }
}
class List extends AbstractListService<Store, Statistics> {
  getFetchURL() {
    return 'data_statistic'
  }
  getSearchParams() {
    return this.context.search.getValues()
  }
}


export class Store {
  search: Search
  list: List

  constructor() {
    this.search = new Search(this)
    this.list = new List(this)
  }
}
