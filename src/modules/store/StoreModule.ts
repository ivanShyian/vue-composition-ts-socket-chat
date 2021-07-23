import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import { UserInterface } from '@/modules/chats/ChatsModule'
import { StatusType } from '@/modules/store/AuthTypes'

interface ISocket extends Socket {
  userId?: string
}

//@TODO Change this any1
export interface StateSocket {
  socket: ISocket | {
    [key: string]: () => void
  } | Record<string, never>
}
