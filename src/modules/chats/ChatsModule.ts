export interface UserInterface {
  nickname: string
  email: string
  id: string
  uid: string
  imgURL?: string
  status?: string
  lastOnline?: number
  chats?: any[]
}

export interface UserSocketInterface {
  userID: string
  username: string
  userDatabaseID?: string
}
