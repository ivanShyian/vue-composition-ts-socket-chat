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

export interface OneMessageInterface {
  databaseID: string
  message: string
  nickname: string,
    time: number
}

export interface OneChatInterface {
  [key: string]: {
    lastMessage: null | OneMessageInterface
    messages?: [{
      [key: string]: OneMessageInterface[]
    }]
    nickname: string
  }
}

export interface ChatListResponse {
  lastMessages: OneMessageInterface[] | null
  chatsCollection: {
    [key: string]: string
  }
}
