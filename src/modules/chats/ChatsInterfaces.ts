export interface NewMessageObjectInterface {
  content: {
    id?: string | string[]
    uid?: string | string[]
    databaseID?: string
    time: number
    message: string
    nickname: string
  };
  to: string | string[]
  fromSelf?: boolean
  toDatabaseId?: string
}
