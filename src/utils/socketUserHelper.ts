import {UserSocketInterface} from '@/models/chats/UserInterfaces'

interface ItemOfUserSocketInterface {
  [key: string]: UserSocketInterface
}

export function handleUsers(
  users: any[],
  socketID: string,
  containedUsers: any,
  chatList: {[key:string]: string}
): ItemOfUserSocketInterface | Record<never, string> {
  if (users) {
    if (Object.keys(containedUsers).length) {
      return sortAndConvertArrayToObject(
        setWrapperToEveryUser(
          compareIncludedUsersWithNewUsers(
            containedUsers, users, chatList), socketID
        )
      )
    }
    return sortAndConvertArrayToObject(setWrapperToEveryUser(users, socketID))
  }
  return containedUsers
}

function compareIncludedUsersWithNewUsers(usersFromState: any[], usersFromPayload: any, chatList: {[key: string]: string}) {
  const arrayOfContainedUsers = Object.keys(usersFromState).map((u: any) => usersFromState[u])
  usersFromPayload.forEach((user: any) => {
    if (Object.keys(chatList).length && !Object.keys(chatList).includes(user.userDatabaseID)) {
      return
    }
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
    if (a.nickname < b.nickname) return -1
    return a.nickname > b.nickname ? 1 : 0
  }).reduce((acc: ItemOfUserSocketInterface | Record<never, string>, current: any) => {
    return {...acc, ...current}
  }, {})
}

function arrayIncludesElementByIndex(array: any[], element: any) {
  return array.findIndex((u: any) => u.userDatabaseID === element.userDatabaseID)
}
