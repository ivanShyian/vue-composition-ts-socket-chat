import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import { UserInterface } from '@/modules/chats/ChatsModule'
import { StatusType } from '@/modules/store/AuthTypes'

export type StateSocket = {
  socket: Socket<DefaultEventsMap> | {
    [key: string]: () => void
  } | Record<string, never>,
  users: Array<{ [key:string]: string }>
}

export type StateAuth = {
  user: UserInterface | null,
  token: {
    expiredIn: string,
    token: string
  } | Record<string, never>,
  status: StatusType
}
