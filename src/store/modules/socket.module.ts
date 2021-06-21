import { io } from 'socket.io-client'
import { Module } from 'vuex'
import { NewMessageObjectInterface } from '@/modules/chats/ChatsInterfaces'
import { StateSocket } from '@/modules/store/StoreModule'
import { handleUsers } from '@/utils/socketUserHelper'
import { newMessageHelper } from '@/utils/socketNewMessageHelper'

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
        // state.users.forEach((user) => {
        //   console.log(user)
        // })
      })

      state.socket.on('session', ({ sessionID, userID }) => {
        state.socket.auth = { sessionID }
        localStorage.setItem('sessionID', sessionID)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        state.socket.userId = userID
      })

      state.socket.on('users', (users) => {
        state.users = handleUsers(users, state.socket.id)
      })

      state.socket.on('user connected', (user) => {
        state.users.push({ ['user_' + user.uid]: user })
        console.log(state.users)
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
    setAndSubscribeSocket({ state, commit, dispatch, rootGetters }): void {
      try {
        commit('subscribeSocketEvents')

        // handleError
        state.socket.on('connect_error', (err) => {
          console.log(err)
          if (err.message === 'invalid username') {
            // dispatch('auth/logoutAndGoToLoginPage', '', { root: true })
          }
        })

        state.socket.on('new-message', ({ content, from }) => {
          for (let i = 0; i < state.users.length; i++) {
            const user = state.users[i]
            newMessageHelper({
              user,
              socketID: state.socket.id,
              content,
              from,
              selectedChatId: rootGetters['chats/selectedChat']
            })
          }
        })

        commit('connectToSocket')
      } catch (e) {
        console.warn(e)
      }
    },
    sendMessageSocket({ state }, message: NewMessageObjectInterface): void {
      state.socket.emit('sendMessage', message)
    },
    authToSocket({ state }, data) {
      if (!data.sessionID.length) {
        state.socket.auth = { username: data.nickname }
        return
      }
      state.socket.auth = { sessionID: data.sessionID, username: data.nickname }
    }
  },
  getters: {
    chatUsers: (state) => state.users
  }
}

export default module
