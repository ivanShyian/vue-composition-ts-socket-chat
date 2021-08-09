import {io} from 'socket.io-client'
import {Module} from 'vuex'
import {NewMessageObjectInterface} from '@/models/chats/ChatsInterfaces'
import {StateSocket} from '@/models/store/StoreModule'

const module: Module<StateSocket, StateSocket> = {
  namespaced: true,
  state() {
    return {
      socket: io('http://localhost:3001', {
        autoConnect: false,
        path: '/socket-service/'
      })
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
      state.socket.on('disconnect', () => {
        // this.users.forEach((user) => {
        //   if (user.self) {
        //     user.connected = false;
        //   }
      })

      state.socket.on('session', ({sessionID, userID}) => {
        state.socket.auth = {sessionID}
        localStorage.setItem('socketSessionID', sessionID)
        state.socket.userId = userID
      })

      // state.socket.on('user disconnected', (user) => {
      //   state.users = state.users.filter(u => {
      //     if ('user_undefined' in u) {
      //       return
      //     }
      //     return u
      //   })
      // })

      // toHandleEveryEvent
      state.socket.onAny((event, ...args) => {
        console.warn(event, args)
      })
    },
    destroySocketConnection(state) {
      state.socket.off('connect_error')
    },
    clearSocketState(state) {
      state.socket.disconnect()
      localStorage.removeItem('socketSessionID')
    }
  },
  actions: {
    setAndSubscribeSocket({state, commit, dispatch}): void {
      try {
        commit('subscribeSocketEvents')

        // upd-
        state.socket.on('users', (users) => {
          dispatch('chats/loadChatsFromSocket', {
            users,
            userId: state.socket.userId
          }, {root: true})
        })

        state.socket.on('user connected', (user) => {
          dispatch('chats/addChat', {
            user
          }, {root: true})
        })

        state.socket.on('new-message', ({content, from, to}) => {
          dispatch('chats/addNewMessage', {
            content,
            from,
            socketId: state.socket.id,
            to
          }, {root: true})
        })
        // -upd

        // handleError
        state.socket.on('connect_error', (err) => {
          console.log(err)
          if (err.message === 'invalid username') {
            // dispatch('auth/logoutAndGoToLoginPage', '', { root: true })
          }
        })
        commit('connectToSocket')
      } catch (e) {
        console.warn(e)
      }
    },
    sendMessageSocket({state}, message: NewMessageObjectInterface): void {
      state.socket.emit('sendMessage', message)
    },
    authToSocket({state}, data) {
      if (!data.sessionID) {
        state.socket.auth = {
          nickname: data.nickname,
          userDatabaseID: data.id
        }
        return
      }
      state.socket.auth = {
        sessionID: data.sessionID,
        nickname: data.nickname,
        userDatabaseID: data.id
      }
    },
    clearState({commit}) {
      commit('clearSocketState')
    }
  },
  getters: {
    userSocketId: (state) => state.socket.userId
  }
}

export default module
