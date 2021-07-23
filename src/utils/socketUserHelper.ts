import {UserSocketInterface} from '@/modules/chats/ChatsModule'

interface ItemOfUserSocketInterface {
  [key: string]: UserSocketInterface
}

export function handleUsers(users: [], socketID: string): ItemOfUserSocketInterface | Record<never, string> {
  if (users) {
    return users.map((user: UserSocketInterface) => {
      if (user.userID === socketID) {
        return {userSelf: user}
      }
      if (user.userID !== socketID) {
        return {['user_' + user.userDatabaseID]: user}
      }
    }).sort((a: any, b: any) => {
      if (a.userSelf) return -1
      if (b.userSelf) return 1
      if (a.username < b.username) return -1
      return a.username > b.username ? 1 : 0
    }).reduce((acc: ItemOfUserSocketInterface | Record<never, string>, current: any) => {
      return {...acc, ...current}
    }, {})
  }
  return {}
}
