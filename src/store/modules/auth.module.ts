import {Module} from 'vuex'
import {StatusType} from '@/models/store/AuthTypes'
import {UserInterface} from '@/models/chats/UserInterfaces'
import router from '@/router/index'
import Firebase, {FirebaseUser} from '@/utils/Firebase'
import {axiosBase} from '@/axios/request'
import {AxiosResponse} from 'axios'

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
        const data: undefined | {
          user?: FirebaseUser
          token?: string
          error?: string
        } = await firebase.login({
          email: payload.email,
          password: payload.password
        })

        if (!data) {
          return
        }

        if (data.error) {
          throw new Error(data.error)
        }

        if (!data.user || !data.token) {
          return
        }

        commit('setUserData', data.user)
        commit('setToken', data.token)
        commit('authStatusHandler', {
          error: {
            status: false,
            message: ''
          },
          success: true
        })
      } catch (e) {
        commit('authStatusHandler', {
          error: {
            status: true,
            message: e.message
          },
          success: false
        })
        console.error(e.message)
      }
    },
    async register({dispatch, commit}, payload): Promise<void> {
      try {
        // We didnt required to check all data passed to this function, because of yup keep it before
        const {data} = await axiosBase.post('/registration', ({
          email: payload.email,
          password: payload.password,
          nickname: payload.nickname,
          id: payload.id
        }))
        if (!data.state) {
          throw new Error(data || 'Something went wrong')
        }
        if (data.state) {
          await dispatch('login', {
            email: payload.email,
            password: payload.password
          })
        }
        commit('authStatusHandler', {
          error: {
            status: false,
            message: ''
          },
          success: false
        })
      } catch (e) {
        commit('authStatusHandler', {
          error: {
            status: true,
            message: e.message
          },
          success: false
        })
        console.error(e.message)
      }
    },
    async checkNicknameBeforeRegister(_, nickname): Promise<{approved: boolean, message?: string}> {
      const {data}: AxiosResponse<{
        approved: boolean,
        message?: string
      }> = await axiosBase.post('/registration/check-credentials', {nickname})
      return data
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
          error: {
            status: false,
            message: ''
          },
          success: true
        })
      } catch (e) {
        if (!e) {
          return dispatch('logoutAndGoToLoginPage')
        }
        console.error(e.response?.data?.error?.message || e)
        commit('authStatusHandler', {
          error: {
            status: true,
            message: e
          },
          success: false
        })
      }
    },
    logoutAndGoToLoginPage({commit, dispatch}, relocateToLoginPage = true) {
      commit('logout')
      dispatch('chats/clearState', '', {root: true})
      dispatch('socket/clearState', '', {root: true})
      dispatch('search/clearState', '', {root: true})
      firebase.logout()
      if (relocateToLoginPage) {
        return router.push('/login')
      }
    }
  },
  getters: {
    isAuth(state): boolean {
      return !!Object.keys(state.token).length
    },
    authStatus(state): StatusType {
      return state.status
    },
    userData(state): UserInterface | null {
      return state.user
    }
  }
}

export default module
