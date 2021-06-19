import { io } from 'socket.io-client'
import { Module } from 'vuex'
import { NewMessageObjectInterface } from '@/views/chats/ChatsInterfaces'
import { StateSocket } from '@/modules/store/StoreModule'
import { handleUsers } from '@/utils/socketUserHelper'

const module: Module<StateSocket, StateSocket> = {
  namespaced: true,
  state() {
    return {
      socket: io('http://localhost:3000', {
        autoConnect: false,
        path: '/socket-service/'
      }),
      users: []
    }
  },
  mutations: {
    connectToSocket(state) {
      state.socket.connect()
    },
    subscribeSocketEvents(state) {
      state.socket.on('connect', () => {
        console.log('Connected')
      })
      state.socket.on('receive', (message) => {
        console.log(message)
      })
      state.socket.on('users', (users) => {
        state.users = handleUsers(users, state.socket.id)
      })

      state.socket.on('user connected', (user) => {
        state.users.push(user)
      })

      // toHandleEveryEvent
      state.socket.onAny((event, ...args) => {
        console.warn(event, args)
      })
    },
    destroySocketConnection(state) {
      state.socket.off('connect_error')
    }
  },
  actions: {
    setAndSubscribeSocket({ state, commit, dispatch }): void {
      try {
        commit('subscribeSocketEvents')
        commit('connectToSocket')

        // handleError
        state.socket.on('connect_error', (err) => {
          if (err.message === 'invalid username') {
            // dispatch('auth/logoutAndGoToLoginPage', {}, { root: true })
          }
        })
      } catch (e) {
        console.warn(e)
      }
    },
    sendMessageSocket({ state }, message: NewMessageObjectInterface): void {
      state.socket.emit('sendMessage', message)
    },
    authToSocket({ state }, username) {
      state.socket.auth = { username }
    }
  },
  getters: {
    chatUsers: (state) => state.users
  }
}

export default module
