import { StateAuth } from '@/modules/StoreModule'
import { Module } from 'vuex'

const module: Module<StateAuth, StateAuth> = {
  namespaced: true,
  state() {
    return {
      user: null,
      isAuth: false
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    }
  },
  actions: {},
  getters: {
    isAuth: (state): boolean => state.isAuth
  }
}

export default module
