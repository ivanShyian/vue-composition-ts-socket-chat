import {Module} from 'vuex'
import {axiosBase} from '@/axios/request'

interface StateSearchInterface {
  isSearching: boolean
  searchedChats: any[]
}
const module: Module<StateSearchInterface, StateSearchInterface> = {
  namespaced: true,
  state() {
    return {
      isSearching: false,
      searchedChats: []
    }
  },
  mutations: {
    setSearchedResults(state, payload) {
      state.searchedChats = payload
    },
    setChatSearchStatus(state, status) {
      state.isSearching = status
    }
  },
  actions: {
    async searchChats({commit}, query) {
      commit('setChatSearchStatus', true)
      try {
        const {data} = await axiosBase.post('user/search', {query})
        if (data.result) {
          commit('setSearchedResults', data.result)
        }
      } catch (e) {
        console.error(e.message || e)
      }
    }
  },
  getters: {
    inProcessOfSearch(state) {
      return state.isSearching
    },
    searchedResultsList(state) {
      return state.searchedChats
    }
  }
}

export default module
