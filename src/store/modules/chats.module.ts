import {Module} from 'vuex'
import {handleUsers} from '@/utils/socketUserHelper'
import {NewMessageObjectInterface} from '@/modules/chats/ChatsInterfaces'

interface OneChatInterface {
  [key: string]: {
    nickname: string
    messages: [{
      [key: string]: any
    }]
  }
}

interface StateChats {
  chats: OneChatInterface | Record<string, any>
  hasNewMessage: boolean
}

const module: Module<StateChats, StateChats> = {
  namespaced: true,
  state() {
    return {
      chats: {},
      hasNewMessage: false
    }
  },
  mutations: {
    updateChats(state, payload) {
      const {users, userId}: {users: [], userId: string} = payload
      // state.chats
      const socketOnlineChats: any = handleUsers(users, userId)
      for (const chat in socketOnlineChats) {
        if (Object.prototype.hasOwnProperty.call(socketOnlineChats, chat) && chat in state.chats) {
          state.chats[chat] = {...state.chats[chat], ...socketOnlineChats[chat]}
        }
      }
    },
    addConnectedChat(state, payload) {
      const {user}: {user: any} = payload

      state.chats = {
        ...state.chats,
        ['user_' + user.userDatabaseID]: user
      }
    },
    setLastMessages(state, chats) {
      if (!chats) {
        return
      }
      chats.forEach((chat: any) => {
        const databaseID = chat.chatUser === 'self' ? 'userSelf' : chat.chatUser.id

        const message = {
          message: chat.message,
          time: chat.timestamp,
          nickname: 'some',
          databaseID: chat.databaseID || chat.chatUser.databaseID
        }

        if (databaseID in state.chats) {
          if ('messages' in state.chats[databaseID]) {
            state.chats[databaseID].messages.push(message)
          } else {
            state.chats[databaseID] = {
              ...state.chats[databaseID],
              messages: [message]
            }
          }
          return
        }

        state.chats = {
          ...state.chats,
          [databaseID]: {
            userDatabaseID: chat.databaseID || chat.chatUser.id,
            messages: [message],
            username: chat.chatUser.nickname ?? null
          }
        }
      })
      console.log(state.chats)
    },
    mutateChats(state, payload) {
      const {content, from, socketId, to, toDatabaseId}: {
        content: any
        from: string
        socketId: string
        to: string
        toDatabaseId: string
      } = payload

      // socketId is myUser id
      const fromSelf: boolean = socketId === from
      const userSelf: boolean = toDatabaseId === content.databaseID
      const receiver: string = userSelf
        ? 'userSelf'
        : fromSelf
          ? `user_${toDatabaseId}`
          : `user_${content.databaseID}`

      // if (user[u].nickname !== selectedChatNickname) {
      // await store.dispatch('chats/setStatusThatUserHasNewMessage', true)
      // }

      if (Object.keys(state.chats).indexOf(receiver) !== -1) {
        if ('messages' in state.chats[receiver]) {
          state.chats[receiver].messages.push({...content, fromSelf})
          return
        }
        state.chats[receiver] = {
          ...state.chats[receiver],
          messages: [{...content, fromSelf}]
        }
      }
    },
    changeNewMessageStatus(state, payload) {
      state.hasNewMessage = payload
    }
  },
  actions: {
    addChat({commit}, payload) {
      commit('addConnectedChat', payload)
    },
    loadChatsFromSocket({commit}, payload) {
      commit('updateChats', payload)
    },
    setStatusThatUserHasNewMessage({commit}, payload) {
      commit('changeNewMessageStatus', payload)
    },
    addNewMessage({commit}, message) {
      commit('mutateChats', message)
    },
    addLastMessages({commit}, payload) {
      commit('setLastMessages', payload)
    },
    sendMessageAndEmitSocket({commit, dispatch, rootGetters}, message: NewMessageObjectInterface) {
      const {content, toDatabaseId, fromSelf, to} = message as NewMessageObjectInterface

      dispatch('socket/sendMessageSocket', {content, fromSelf, to}, {root: true})

      commit('mutateChats', {
        content,
        socketId: rootGetters['socket/userSocketId'],
        from: rootGetters['socket/userSocketId'],
        toDatabaseId
      })
    }
  },
  getters: {
    currentChat: (state) => (id: string) => {
      const nickname = state.chats && Object.keys(state.chats).find((chat: any) => state.chats[chat].username === id)
      return nickname ? state.chats[nickname] : {}
    },
    allChats: (state) => {
      return state.chats
    },
    myUserData: (state) => {
      return state.chats && state.chats.userSelf
    }
  }
}

export default module