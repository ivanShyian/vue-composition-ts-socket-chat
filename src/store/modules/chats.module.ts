import {Module} from 'vuex'
import {handleUsers} from '@/utils/socketUserHelper'
import {NewMessageObjectInterface} from '@/modules/chats/ChatsInterfaces'
import Firebase from '@/utils/Firebase'
import {axiosBase} from '@/axios/request'
import {AxiosResponse} from 'axios'

const firebase = new Firebase()

interface OneChatInterface {
  [key: string]: {
    nickname: string
    messages: [{
      [key: string]: any
    }]
  }
}

interface ChatListItemInterface {
  chatUser: string | {
    email: string
    id: string
    nickname?: string
  }
  message: string | null
  nickname: string
  time: number
}

interface ChatListResponse {
  lastMessages: ChatListItemInterface[] | null
  chatsCollection: {
    [key: string]: string
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
      const messages = payload.result
        ? Object.keys(payload.result).map((message: any) => (payload.result[message]))
        : []

      state.chats[userName] = {
        ...state.chats[userName],
        messages
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
        console.log({chat})
        const chatName = chat.chatUser === 'self' ? 'userSelf' : chat.chatUser.id
        const databaseID = chat.databaseID || chat.chatUser.id
        const message = {
          message: chat.message || '',
          time: chat.time || null,
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
            username: chat.chatUser.nickname ?? null
          }
        }
      })
    },
    mutateChats(state, payload) {
      const {content, from, socketId, to, toDatabaseId, lastMessage = false}: {
        content: any
        from: string
        socketId: string
        to: string
        toDatabaseId: string
        lastMessage: boolean
      } = payload

      // socketId is myUser id
      const fromSelf: boolean = socketId === from
      const userSelf: boolean = toDatabaseId === content.databaseID
      const receiver: string = userSelf
        ? 'userSelf'
        : fromSelf
          ? `user_${toDatabaseId}`
          : `user_${content.databaseID}`

      if (Object.keys(state.chats).indexOf(receiver) !== -1) {
        if ('messages' in state.chats[receiver]) {
          state.chats[receiver].messages.push({...content, fromSelf})
          if (lastMessage) {
            state.chats[receiver].lastMessage = content
          }
          return
        }
        state.chats[receiver] = {
          ...state.chats[receiver],
          messages: [{...content, fromSelf}]
        }
        if (lastMessage) {
          state.chats[receiver].lastMessage = content
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
    async fetchChatList({commit, rootGetters}): Promise<void> {
      const {uid, id} = rootGetters['auth/userData']
      try {
        const {data}: AxiosResponse<ChatListResponse> = await axiosBase.post('/chats/list', JSON.stringify({
          uid,
          id
        }))
        if (data.lastMessages) {
          commit('setLastMessages', data.lastMessages)
          commit('setExistedChatsList', data.chatsCollection)
        }
      } catch (e) {
        console.error(e.message | e)
      }
    },
    async sendMessageAndEmitSocket({commit, dispatch, rootGetters, getters}, message: NewMessageObjectInterface) {
      const {content, toDatabaseId, fromSelf, to} = message as NewMessageObjectInterface

      dispatch('socket/sendMessageSocket', {content, fromSelf, to}, {root: true})
      commit('mutateChats', {
        content,
        socketId: rootGetters['socket/userSocketId'],
        from: rootGetters['socket/userSocketId'],
        toDatabaseId,
        lastMessage: true
      })

      await firebase.sendMessage(content, getters.chatIdByUserDatabaseId(toDatabaseId))
    },
    async fetchMessagesByChat({dispatch, commit}, payload) {
      const result = await dispatch('auth/fetchChat', payload.chatId, {root: true})
      commit('addMessagesToExactChat', {databaseID: payload.databaseID, result})
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
