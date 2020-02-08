import { observable, toJS } from 'mobx'
import { GET, defaultErrorHandler } from '../../../utils'
import { ListFetchOptions } from './typing'
import { PaginationResponseData } from '../typing'

const debug = require('debug')('debug:core:list-service')

export abstract class AbstractListService<TCT = any, T = any> {
  @observable items = [] as T[]
  @observable index = 1
  @observable size = 20
  @observable total = 0
  @observable loading = false

  constructor(protected context: TCT) {}

  async fetch(options: ListFetchOptions = {}) {
    if (options.reset) {
      this.index = 1
    }

    if (options.fixIndex && this.items.length === 1 && this.index > 1) {
      this.index = this.index - 1
    }

    this.items = []
    this.loading = true

    const url = this.getFetchURL()
    debug('fetch url', url)

    try {
      const res = await GET(url, {
        data: {
          pageIndex: this.index - 1,
          pageSize: this.size,
          ...this.getSearchParams()
        }
      })
      const resData = res.data as PaginationResponseData<T>
      this.items = this.parseFetchedItems(resData.items || resData)
      this.total = resData.totalCount

      debug('parseFetched', toJS(this.items))

    } catch (e) {
      defaultErrorHandler(e)
    } finally {
      this.loading = false
    }
  }

  async handlePageIndexChange(index: number) {
    this.index = index
    await this.fetch()
    window.scrollTo(0,0)
  }

  indexMethod(current: number) {
    return current + 1 + ((this.index - 1) * this.size)
  }

  getSearchParams(): any {
    return {}
  }

  parseFetchedItems(items: any[]): T[] {
    return items
  }

  abstract getFetchURL(): string

}
