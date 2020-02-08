import { AbstractListService } from './services/list.service'
import { AbstractSearchService } from './services/search.service'
import { AbstractEditService } from './services/edit.service'
import { ListFetchOptions } from './services/typing'

export interface CRUDStoreOptions {
  // list
  fetchUrl: string
  // search
  searchDefaultFormData: () => any
  // edit
  editFetchURL: () => string
  parseFetchedFormData?: (data: any) => any
  editSubmitURL: () => string
  removeUrl: () => string
  editDefaultFormData: () => any
}

export class CRUDStore<LT = any, ST = any, ET = any> {
  list: AbstractListService
  search: AbstractSearchService
  edit: AbstractEditService

  constructor(options: CRUDStoreOptions) {
    const context = this

    class ListService extends AbstractListService<CRUDStore, LT> {
      getFetchURL() {
        return options.fetchUrl
      }
      getSearchParams() {
        return {
          ...context.search.getValues()
        }
      }
    }

    class SearchService extends AbstractSearchService<CRUDStore, ST> {
      getDefaultFormData() {
        return options.searchDefaultFormData()
      }
      onSubmit() {
        context.list.fetch({ reset: true })
      }
    }

    class EditService extends AbstractEditService<CRUDStore, ET, LT> {
      getFetchURL() {
        return options.editFetchURL()
      }
      parseFetchedFormData(data: ET) {
        if (options.parseFetchedFormData) {
          return options.parseFetchedFormData(data)
        }
        return data
      }
      getDefaultFormData() {
        return options.editDefaultFormData()
      }
      getSubmitURL() {
        return options.editSubmitURL()
      }
      getRemoveURL() {
        return options.removeUrl()
      }
      requestListReload(option: ListFetchOptions) {
        context.list.fetch(option)
      }
    }

    this.list = new ListService(context)
    this.search = new SearchService(context)
    this.edit = new EditService(context)
  }
}
