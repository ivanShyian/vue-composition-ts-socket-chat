import { Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'

export type State = {
  socket: null | Socket<DefaultEventsMap>
}

export const state: State = {
  socket: null
}
