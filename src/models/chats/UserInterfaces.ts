export interface UserInterface {
  nickname: string
  email: string
  id: string
  uid: string
  unfam?: boolean
  imgURL?: string
  status?: string
  lastOnline?: number
  chats?: any[]
  userDatabaseID?: string
}

export interface UserSocketInterface extends UserInterface {
  userID: string
  userDatabaseID: string
  username: string
}
