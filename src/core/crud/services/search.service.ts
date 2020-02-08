import { observable, toJS } from 'mobx'
const debug = require('debug')('debug:core:search-service')

export abstract class AbstractSearchService<TCT = any, S = any> {
  @observable
  data = {} as S

  constructor(
    protected context: TCT
  ) {
    this.data = this.getDefaultFormData()
    debug('getDefaultFormData', toJS(this.data))
  }

  getValues() {
    return toJS(this.data)
  }

  abstract onSubmit(): void

  abstract getDefaultFormData(): S
}
