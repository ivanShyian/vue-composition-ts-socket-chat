import { Module } from 'vuex'
import { StateChats } from '@/modules/store/StoreModule'

const module: Module<StateChats, StateChats> = {
  namespaced: true,
  state() {
    return {
      chats: {},
      hasNewMessage: false,
      selectedChatId: ''
    }
  },
  mutations: {
    setSelectedUserSocketID(state, payload) {
      state.selectedChatId = payload
    },
    mutateChats(state, payload) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, fromSelf } = payload
      const sender = content.uid
      if (Object.keys(state.chats).indexOf(sender) !== -1) {
        // state.chats[chatID].messages.push(content)
        state.chats[sender].messages.push(content)
        return
      }
      // state.chats = { ...state.chats, [chatID]: ... }
      state.chats = { ...state.chats, [content.uid]: { messages: [content] } }
    },
    changeNewMessageStatus(state, payload) {
      state.hasNewMessage = payload
    }
  },
  actions: {
    setStatusThatUserHasNewMessage({ commit }, payload) {
      commit('changeNewMessageStatus', payload)
    },
    addNewMessage({ commit }, content) {
      // console.log(content)
      commit('mutateChats', content)
    }
  },
  getters: {
    selectedChat: (state): string => state.selectedChatId
  }
}

export default module
