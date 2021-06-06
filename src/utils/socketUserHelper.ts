export function handleUsers(users: [], socketID: string | (() => void)): any[] {
  return users.map((user: any) => {
    if (user.userID === socketID) {
      return { userSelf: user }
    }
    if (user.userID !== socketID) {
      return { ['user_' + user.userID]: user }
    }
  }).sort((a: any, b: any) => {
    if (a.userSelf) return -1
    if (b.userSelf) return 1
    if (a.username < b.username) return -1
    return a.username > b.username ? 1 : 0
  })
}
