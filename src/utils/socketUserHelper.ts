import {UserSocketInterface} from '@/modules/chats/ChatsModule'

interface ItemOfUserSocketInterface {
  [key: string]: UserSocketInterface
}

export function handleUsers(users: [], socketID: string, containedUsers?: any): ItemOfUserSocketInterface | Record<never, string> {
  if (users) {
    if (Object.keys(containedUsers).length) {
      return sortAndConvertArrayToObject(setWrapperToEveryUser(compareIncludedUsersWithNewUsers(containedUsers, users), socketID))
    }
    return sortAndConvertArrayToObject(setWrapperToEveryUser(users, socketID))
  }
  return {}
}

function compareIncludedUsersWithNewUsers(usersFromState: any[], usersFromPayload: any) {
  const arrayOfContainedUsers = Object.keys(usersFromState).map((u: any) => usersFromState[u])
  usersFromPayload.forEach((user: any) => {
    const includeFunctionResult = arrayIncludesElementByIndex(arrayOfContainedUsers, user)
    if (includeFunctionResult !== -1) {
      arrayOfContainedUsers[includeFunctionResult] = {...arrayOfContainedUsers[includeFunctionResult], ...user}
      return
    }
    arrayOfContainedUsers.push(user)
  })
  return arrayOfContainedUsers
}

function setWrapperToEveryUser(arrayOfUsers: any[], socketId: string) {
  return arrayOfUsers.map((user: UserSocketInterface, index) => {
    if (user.userID === socketId) {
      return {userSelf: user}
    }
    if (user.userID !== socketId) {
      return {['user_' + user.userDatabaseID]: user}
    }
  })
}

function sortAndConvertArrayToObject(array: any[]) {
  return array.sort((a: any, b: any) => {
    if (a.userSelf) return -1
    if (b.userSelf) return 1
    if (a.username < b.username) return -1
    return a.username > b.username ? 1 : 0
  }).reduce((acc: ItemOfUserSocketInterface | Record<never, string>, current: any) => {
    return {...acc, ...current}
  }, {})
}

function arrayIncludesElementByIndex(array: any[], element: any) {
  return array.findIndex((u: any) => u.userDatabaseID === element.userDatabaseID)
}
