import { GET } from '../../utils'
import { observable } from 'mobx'
import { CurrentAccount } from '../../typing'

class UserServiceClass {

  @observable
  user: CurrentAccount

  async fetchUserInfo() {
    try {
      const res = await GET('account/current', {})
      this.user = res.data

    } catch (e) {
      throw e
    }
  }

  async logout() {
    await GET('account/logout', {})
  }
}

export const UserService = new UserServiceClass()
