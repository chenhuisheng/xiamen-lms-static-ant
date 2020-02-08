import _ from 'lodash'
import { AbstractSearchService } from '../../core/crud/services/search.service'
import { AbstractListService } from '../../core/crud/services/list.service'
import { ImageCardData } from '../../typing'
import { AbstractEditService } from '../../core/crud/services/edit.service'
import { observable } from 'mobx'
import { TopicService } from '../../core/services/toopic.service'


interface SearchFormData {
  type: string
  project_id: any
  title_like: any
}
class Search extends AbstractSearchService<Store, SearchFormData> {
  getDefaultFormData() {
    return {
      type: 'banner',
      project_id: TopicService.getDefaultValue() as number,
      title_like: null
    }
  }
  onSubmit() {
    this.context.list.fetch({ reset: true })
  }
}
class List extends AbstractListService<Store, ImageCardData> {
  getFetchURL() {
    return 'pictures'
  }
  getSearchParams() {
    const data = this.context.search.getValues()
    if(data.project_id === -1){
      data.project_id = null
    }
    return data
  }
}

export class Edit extends AbstractEditService<Store, ImageCardData> {

  @observable currentStep = 0

  getFetchURL() {return `pictures/${this.params.id}`}

  onAdd() {
    this.currentStep = 0
    super.onAdd.call(this, arguments)
  }
  getSubmitURL() {
    return this.isEdit ? `pictures/${this.params.id}` : 'pictures'
  }
  getSubmitData() {
    const data = this.data
    data.type = 'banner'
    data.project_ids = _.map(data.projects, p => {
      return p.id
    })

    return {
      ...data
    }
  }

  getRemoveURL() {return `pictures/${this.params.id}`}
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
