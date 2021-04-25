import { io, Socket } from 'socket.io-client'
import { DefaultEventsMap } from 'socket.io-client/build/typed-events'
import { Module } from 'vuex'
import { NewMessageObjectInterface } from '@/views/chats/ChatsInterfaces'

type State = {
  socket: Socket<DefaultEventsMap>
}

const module: Module<State, State> = {
  namespaced: true,
  state() {
    return {
      socket: io()
    }
  },
  mutations: {
    connectToSocket(state) {
      state.socket = io('http://localhost:3000')
    },
    subscribeSocketEvents(state) {
      state.socket.on('connect', () => {
        console.log('Connected')
      })
      state.socket.on('receive', (message) => {
        console.log(message)
      })
    }
  },
  actions: {
    setAndSubscribeSocket({ commit }): void {
      try {
        commit('connectToSocket')
        commit('subscribeSocketEvents')
      } catch (e) {
        console.warn(e)
      }
    },
    sendMessageSocket({ state }, message: NewMessageObjectInterface): void {
      console.log({ message })
      state.socket.emit('sendMessage', message)
    }
  }
}

export default module
