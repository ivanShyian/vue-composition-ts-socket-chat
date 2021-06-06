import { StateAuth } from '@/modules/store/StoreModule'
import { Module } from 'vuex'
import { StatusType } from '@/modules/store/AuthTypes'
import { UserInterface } from '@/modules/chats/ChatsModule'
import router from '@/router/index'
import Firebase from '@/utils/Firebase'

const JWT_TOKEN = 'token'
const firebase = new Firebase()

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
    setToken(state, token) {
      if (Object.keys(token).length) {
        localStorage.setItem(JWT_TOKEN, JSON.stringify(token))
        state.token = token
      }
    },
    setUserData(state, user) {
      state.user = user
    },
    authStatusHandler(state, payload) {
      state.status = payload
    },
    logout(state) {
      state.token = {}
      state.user = null
      state.status = {}

      localStorage.removeItem(JWT_TOKEN)
    }
  },
  actions: {
    async login({ commit }, payload): Promise<void> {
      try {
        const data = await firebase.login({
          email: payload.email,
          password: payload.password
        })
        console.log({ data })
        if (!(data?.user && data?.token)) {
          return
        }
        commit('setUserData', data.user)
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
        await firebase.register({
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
    },
    async logoutAndGoToLoginPage({ commit }) {
      commit('logout')
      await router.push('/login')
    },
    async getUserData({ commit, dispatch }, token) {
      try {
        // const { data } = await axiosBase.post('/user/get', token)
        // console.log({ data })
        // commit('setUserData', data)
        const res = await firebase.getUser()
        if (!res) {
          return dispatch('logoutAndGoToLoginPage')
        }
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
    authStatus: (state): StatusType => state.status,
    userData: (state): UserInterface | null => state.user
  }
}

export default module
