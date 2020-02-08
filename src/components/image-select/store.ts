import { AbstractListService } from '../../core/crud/services/list.service'
import { ImageCardData } from '../../typing'

export class List extends AbstractListService<Store, ImageCardData> {
  getFetchURL() {
    return `pictures`
  }
}

export class Store {
  list: List

  constructor() {
    this.list = new List(this)
  }

}
