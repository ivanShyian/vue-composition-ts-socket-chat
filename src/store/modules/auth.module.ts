import { StateAuth } from '@/modules/store/StoreModule'
import { Module } from 'vuex'
import { axiosBase } from '@/axios/request'
import { StatusType } from '@/modules/store/AuthTypes'

const JWT_TOKEN = 'token'

const module: Module<StateAuth, StateAuth> = {
  namespaced: true,
  state() {
    return {
      user: null,
      token: JSON.parse(localStorage.getItem(JWT_TOKEN)!) ?? {},
      status: {}
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setToken(state, payload) {
      if (Object.keys(payload).length) {
        localStorage.setItem(JWT_TOKEN, JSON.stringify(payload))
        state.token = payload
      }
    },
    authStatusHandler(state, payload) {
      state.status = payload
    }

  },
  actions: {
    async login({ commit, dispatch }, payload): Promise<void> {
      try {
        const { data } = await axiosBase.post('/login', {
          email: payload.email,
          password: payload.password
        })
        commit('setToken', data.token)
        commit('authStatusHandler', {
          error: false,
          success: true
        })
      } catch (e) {
        console.error(e.response?.data?.error?.message || e)
        commit('authStatusHandler', {
          error: true,
          success: false
        })
      }
    },
    async register({ dispatch, commit }, payload): Promise<void> {
      try {
        await axiosBase.post('/register', {
          email: payload.email,
          password: payload.password,
          nickname: payload.nickname
        })
        await dispatch('login', {
          email: payload.email,
          password: payload.password
        })
      } catch (e) {
        console.error(e.response?.data?.error?.message || e)
        commit('authStatusHandler', {
          error: true,
          success: false
        })
      }
    }
  },
  getters: {
    isAuth: (state): boolean => !!Object.keys(state.token).length,
    authStatus: (state): StatusType => state.status
  }
}

export default module
