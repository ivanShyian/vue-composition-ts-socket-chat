import { io } from 'socket.io-client'
import { Module } from 'vuex'
import { NewMessageObjectInterface } from '@/views/chats/ChatsInterfaces'
import { StateSocket } from '@/modules/store/StoreModule'

const module: Module<StateSocket, StateSocket> = {
  namespaced: true,
  state() {
    return {
      socket: io()
    }
  },
  mutations: {
    connectToSocket(state, url) {
      state.socket = io(url)
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
    setAndSubscribeSocket({ commit }, payload): void {
      try {
        commit('connectToSocket', payload)
        commit('subscribeSocketEvents')
      } catch (e) {
        console.warn(e)
      }
    },
    sendMessageSocket({ state }, message: NewMessageObjectInterface): void {
      state.socket.emit('sendMessage', message)
    },
    authToSocket({ state }, username) {
      state.socket.auth = username
    }
  }
}

export default module
