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
  hasNewMessage: boolean,
  chatList: {
    [key: string]: string
  }
}

const module: Module<StateChats, StateChats> = {
  namespaced: true,
  state() {
    return {
      chats: {},
      chatList: {},
      hasNewMessage: false
    }
  },
  mutations: {
    updateChats(state, payload) {
      const {users, userId}: {users: [], userId: string} = payload
      state.chats = handleUsers(users, userId, state.chats, state.chatList)
    },
    addMessagesToExactChat(state, payload) {
      const userName = payload.databaseID === state.chats.userSelf.userDatabaseID ? 'userSelf' : 'user_' + payload.databaseID
      state.chats[userName] = {
        ...state.chats[userName],
        messages: payload.result
      }
    },
    addConnectedChat(state, payload) {
      const {user}: {user: any} = payload
      const chatName = 'user_' + user.userDatabaseID

      if (chatName in state.chats) {
        state.chats[chatName] = {...state.chats[chatName], ...user}
      } else {
        state.chats = {...state.chats, [chatName]: user}
      }
    },
    setLastMessages(state, chats) {
      if (!chats) {
        return
      }
      chats.forEach((chat: any) => {
        const chatName = chat.chatUser === 'self' ? 'userSelf' : chat.chatUser.id
        const databaseID = chat.databaseID || chat.chatUser.id
        const message = {
          message: chat.message || '',
          time: chat.timestamp || null,
          nickname: 'some',
          databaseID
        }

        if (chatName in state.chats) {
          state.chats[chatName].lastMessage = message
          return
        }

        state.chats = {
          ...state.chats,
          [chatName]: {
            userDatabaseID: databaseID,
            lastMessage: message,
            username: chat.chatUser.nickname || null
          }
        }
      })
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
    setExistedChatsList(state, payload) {
      if (Object.keys(state.chatList).length) {
        state.chatList = {...state.chatList, ...payload}
        return
      }
      state.chatList = payload
    },
    changeNewMessageStatus(state, payload) {
      state.hasNewMessage = payload
    },
    clearChatsState(state) {
      state.chats = {}
      state.chatList = {}
      state.hasNewMessage = false
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
    },
    async fetchMessagesByChat({dispatch, commit}, payload) {
      const result = await dispatch('auth/fetchChat', payload.chatId, {root: true})
      commit('addMessagesToExactChat', {databaseID: payload.databaseID, result})
      console.log({result})
    },
    addExistedChatsList({commit}, payload) {
      commit('setExistedChatsList', payload)
    },
    clearState({commit}) {
      commit('clearChatsState')
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
    },
    chatIdByUserDatabaseId: (state) => (id: string) => {
      return state.chatList[id]
    }
  }
}

export default module
