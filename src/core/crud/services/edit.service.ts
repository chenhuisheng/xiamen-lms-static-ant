import _ from 'lodash'
import { ListFetchOptions } from './typing'
import { observable, toJS } from 'mobx'
import { DELETE, GET, POST, PUT } from '../../../utils/ajax'
import { defaultErrorHandler } from '../../../utils/index'
import { message } from 'antd'
import { FormStateOptions } from '../typing'

const debug = require('debug')('debug:core:edit-service')

export abstract class AbstractEditService<TCT = any, T = any, P = T> {
  @observable visible = false
  @observable isEdit = false
  @observable data = {} as T
  @observable params = {} as P
  @observable loading = false
  @observable saving = false
  @observable isReadonly = false

  constructor(protected context: TCT) {
    debug('initial edit-service')
  }

  onAdd(params?: P) {
    debug('onAdd defaultFormData', this.getDefaultFormData(params))
    this.data = _.cloneDeep(this.getDefaultFormData(params))
    this.isEdit = false
    this.saving = false
    this.visible = true
  }

  getDefaultFormData(params?: P): T {
    return {} as T
  }

  async onEdit(params: P, options?: FormStateOptions) {
    if (this.loading) {
      debug('Block onEdit on loading')
      return
    }

    debug('onEdit params', params, options)
    this.params = params

    if (options && 'readonly' in options) {
      this.isReadonly = options.readonly
    } else {
      this.isReadonly = false
    }
    this.isEdit = true
    this.saving = false
    this.data = {} as T

    this.loading = true
    // this.visible = true
    try {
      let data = null
      if (this.getFetchURL()) {
        data = await this.fetchFormData()
      } else {
        data = toJS(params) as any
      }

      this.data = await this.parseFetchedFormData(data)
      debug('onEdit FormData', toJS(this.data))

      this.visible = true

    } catch (e) {
      defaultErrorHandler(e)
    } finally {
      this.loading = false
    }

  }

  async onEditSubmit() {
    this.loading = true

    const data = this.getSubmitData()
    const requestMethod = this.isEdit ? PUT : POST

    try {
      await requestMethod(this.getSubmitURL(), {
        data
      })
      this.visible =  false
      this.requestListReload()
      message.success('保存成功')

    } catch (e) {
      defaultErrorHandler(e)
    } finally {
      this.loading = false
    }
  }

  async fetchFormData(): Promise<T> {
    const res = await GET(this.getFetchURL() as string, {
      data: this.getFetchParams()
    })
    return res.data
  }

  getFetchParams() {
    return {} as any
  }

  parseFetchedFormData(data: T) {
    return data
  }

  getSubmitData() {
    return this.data
  }

  async onRemove(item: P) {
    this.loading = true
    this.params = item as any

    debug('onRemove params', this.params)

    try {
      await DELETE(this.getRemoveURL(), {
        data: this.getRemoveParams()
      })
      this.requestListReload({ fixIndex: true })
      message.success('删除成功')

    } catch (e) {
      defaultErrorHandler(e)
    } finally {
      this.loading = false
    }
  }
  getRemoveParams() {
    return {} as any
  }

  abstract getFetchURL(): string | boolean
  abstract getSubmitURL(): string
  abstract getRemoveURL(): string
  abstract requestListReload(option?: ListFetchOptions): void
}
