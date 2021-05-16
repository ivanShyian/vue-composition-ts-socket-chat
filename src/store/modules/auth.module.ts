import { StateAuth } from '@/modules/StoreModule'
import { Module } from 'vuex'
import { axiosBase } from '@/axios/request'

const JWT_TOKEN = 'token'

const module: Module<StateAuth, StateAuth> = {
  namespaced: true,
  state() {
    return {
      user: null,
      token: JSON.parse(localStorage.getItem(JWT_TOKEN)!) ?? {}
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setToken(state, payload) {
      if (Object.keys(payload).length) {
        localStorage.setItem(JWT_TOKEN, JSON.stringify(payload))
      }
    }
  },
  actions: {
    async login({ commit, dispatch }, payload): Promise<void> {
      try {
        const res = await axiosBase.post('/login', {
          email: payload.email,
          password: payload.password
        })
        commit('setToken', res.data?.token)
        dispatch('getUserData', res.data?.token)
      } catch (e) {
        console.warn(e)
      }
    },
    async getUserData({ commit }, payload): Promise<void> {
      try {
        const res = await axiosBase.post('/user/get', payload)
        commit('setUser', res.data?.user)
      } catch (e) {
        console.warn(e)
      }
    }
  },
  getters: {
    isAuth: (state): boolean => !!Object.keys(state.token).length
  }
}

export default module
