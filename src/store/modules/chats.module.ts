import {Module} from 'vuex'
import {handleUsers} from '@/utils/socketUserHelper'
import {
  ChatListResponse,
  NewMessageObjectInterface,
  OneChatInterface
} from '@/models/chats/ChatsInterfaces'
import {axiosBase} from '@/axios/request'
import {AxiosResponse} from 'axios'

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
      const databaseId = payload.databaseID === state.chats.userSelf.userDatabaseID ? 'userSelf' : 'user_' + payload.databaseID
      const messages = payload.data
        ? Object.keys(payload.data).map((message: any) => (payload.data[message]))
        : []

      state.chats[databaseId] = {
        ...state.chats[databaseId],
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
    setLastMessages(state, payload) {
      if (!payload && Object.keys(payload).length) {
        return
      }

      const {nickname, data: chats} = payload

      chats.forEach((chat: any) => {
        const chatName = chat.chatUser === 'self' ? 'userSelf' : `user_${chat.chatUser.id}`
        const databaseID = chat.databaseID || chat.chatUser.id
        const message = {
          message: chat.message || '',
          time: chat.time || null,
          nickname: chat.nickname || nickname,
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
            nickname: chat.chatUser.nickname || nickname
          }
        }
      })
    },
    mutateChats(state, payload) {
      const {content, from, socketId, toDatabaseId, lastMessage = false}: {
        content: any
        from: string
        socketId: string
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
      const {uid, id, nickname} = rootGetters['auth/userData']
      try {
        const {data}: AxiosResponse<ChatListResponse> = await axiosBase.post('/messages/all', JSON.stringify({
          uid,
          id
        }))
        if (data.lastMessages) {
          commit('setLastMessages', {data: data.lastMessages, nickname})
          commit('setExistedChatsList', data.chatsCollection)
        }
      } catch (e) {
        console.error(e.message | e)
      }
    },
    async sendMessageAndEmitSocket({commit, dispatch, rootGetters, getters}, message: NewMessageObjectInterface): Promise<void> {
      const {content, toDatabaseId, fromSelf, to} = message as NewMessageObjectInterface

      dispatch('socket/sendMessageSocket', {content, fromSelf, to}, {root: true})
      commit('mutateChats', {
        content,
        socketId: rootGetters['socket/userSocketId'],
        from: rootGetters['socket/userSocketId'],
        toDatabaseId,
        lastMessage: true
      })

      try {
        const id = getters.chatIdByUserDatabaseId(toDatabaseId)
        const {data} = await axiosBase.post('messages/send', JSON.stringify({
          content,
          id
        }))
        if (!data.state) {
          throw new Error('Message wasn\'t saved to database')
        }
      } catch (e) {
        console.warn(e)
      }
    },
    async fetchMessagesByChat({commit}, payload) {
      try {
        const {data} = await axiosBase.get(`messages/get/${payload.chatId}`)
        console.log(data)
        if (!data) {
          throw new Error('Internal error')
        }
        if (data) {
          commit('addMessagesToExactChat', {databaseID: payload.databaseID, data})
        }
      } catch (e) {
        console.error(e.message || e)
      }
    },
    clearState({commit}) {
      commit('clearChatsState')
    }
  },
  getters: {
    currentChat: (state) => (nickname: string) => {
      const databaseId = state.chats && Object.keys(state.chats)
        .find((chat: any) => state.chats[chat].nickname === nickname)
      return databaseId ? state.chats[databaseId] : {}
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
