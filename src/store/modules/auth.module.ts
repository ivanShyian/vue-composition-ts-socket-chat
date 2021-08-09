import {Module} from 'vuex'
import {StatusType} from '@/models/store/AuthTypes'
import {UserInterface} from '@/models/chats/UserInterfaces'
import router from '@/router/index'
import Firebase from '@/utils/Firebase'
import {axiosBase} from '@/axios/request'

interface StateAuth {
  user: UserInterface | null,
  token: {
    expiredIn: string,
    token: string
  } | Record<string, never>,
  status: StatusType
}

const firebase = new Firebase()

const JWT_TOKEN = 'token'

const module: Module<StateAuth, StateAuth> = {
  namespaced: true,
  state() {
    return {
      user: null,
      token: localStorage.getItem(JWT_TOKEN) ? JSON.parse(localStorage.getItem(JWT_TOKEN) as string) : '',
      status: {
        success: false,
        error: false
      }
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
      if (user) {
        state.user = user
      }
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
    async login({commit}, payload): Promise<void> {
      try {
        const data = await firebase.login({
          email: payload.email,
          password: payload.password
        })
        if (!data) {
          return
        }
        if (!data.user || !data.token) {
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
    async register({dispatch, commit}, payload): Promise<void> {
      try {
        // We didnt required to check all data passed to this function, because of yup keep it
        const {data} = await axiosBase.post('/registration', ({
          email: payload.email,
          password: payload.password,
          nickname: payload.nickname,
          id: payload.id
        }))
        if (data.state) {
          await dispatch('login', {
            email: payload.email,
            password: payload.password
          })
        }
      } catch (e) {
        console.error(e.response?.data?.error?.message || e)
        commit('authStatusHandler', {
          error: true,
          success: false
        })
      }
    },
    async fetchUserData({commit, dispatch}): Promise<UserInterface | undefined> {
      try {
        const res: any = await firebase.observable()
        if (res && res.token) {
          const {token, ...data} = res
          commit('setUserData', data)
          commit('setToken', token)
          commit('authStatusHandler', {
            error: false,
            success: true
          })
        }
        commit('authStatusHandler', {
          error: false,
          success: false
        })
      } catch (e) {
        if (!e) {
          return dispatch('logoutAndGoToLoginPage')
        }
        console.error(e.response?.data?.error?.message || e)
        commit('authStatusHandler', {
          error: true,
          success: false
        })
      }
    },
    logoutAndGoToLoginPage({commit, dispatch}) {
      commit('logout')
      dispatch('chats/clearState', '', {root: true})
      dispatch('socket/clearState', '', {root: true})
      router.push('/login')
    }
  },
  getters: {
    isAuth: (state): boolean => !!Object.keys(state.token).length,
    authStatus: (state): StatusType => state.status,
    userData: (state): UserInterface | null => state.user
  }
}

export default module
