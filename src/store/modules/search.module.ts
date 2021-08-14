import {Module} from 'vuex'
import {axiosBase} from '@/axios/request'

interface StateSearchInterface {
  isSearching: boolean
  searchedChats: any
}
const module: Module<StateSearchInterface, StateSearchInterface> = {
  namespaced: true,
  state() {
    return {
      isSearching: false,
      searchedChats: {}
    }
  },
  mutations: {
    setSearchedResults(state, searchResult) {
      if (searchResult?.length) {
        searchResult.forEach((res: any) => {
          state.searchedChats = {
            ...state.searchedChats,
            ['user_' + res.userDatabaseID]: res
          }
        })
      } else {
        state.searchedChats = {}
      }
    },
    setChatSearchStatus(state, status) {
      state.isSearching = status
    },
    mutateSearchedResults(state, payload) {
      state.searchedChats = payload && Object.keys(payload).length ? {['user_' + payload.userDatabaseID]: payload} : {}
    }
  },
  actions: {
    async searchChats({commit}, payload) {
      commit('setChatSearchStatus', true)
      const {value, type, me}: {value: string, type: string, me: {[key: string]: any}} = payload
      try {
        const {data} = await axiosBase.post(`user/search${type === 'all' ? '/all' : ''}`, JSON.stringify({
          query: value,
          me: {uid: me.uid, id: me.id}
        }))
        if (data.result) {
          commit('setSearchedResults', data.result)
        }
      } catch (e) {
        console.error(e.message || e)
      }
    },
    changeCurrentSearchedResults({getters, commit, dispatch}, payload) {
      const {data, specificValue = false}: {data: any, specificValue: boolean} = payload
      commit('mutateSearchedResults', specificValue ? data : getters.userByNickname(data))
    }
  },
  getters: {
    inProcessOfSearch(state) {
      return state.isSearching
    },
    searchedResultsList(state) {
      return state.searchedChats
    },
    userByNickname: (state) => (nickname: string) => {
      if (state.searchedChats && Object.keys(state.searchedChats).length) {
        for (const user in state.searchedChats) {
          if (Object.prototype.hasOwnProperty.call(state.searchedChats, user)) {
            if (state.searchedChats[user].nickname === nickname) {
              return state.searchedChats[user]
            }
          }
        }
      }
      return null
    },
    clearState(state) {
      state.isSearching = false
      state.searchedChats = {}
    }
  }
}

export default module
