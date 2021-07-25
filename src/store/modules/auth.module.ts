import {Module} from 'vuex'
import {StatusType} from '@/modules/store/AuthTypes'
import {UserInterface} from '@/modules/chats/ChatsModule'
import router from '@/router/index'
import Firebase from '@/utils/Firebase'

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
      const {nickname, other} = user
      state.user = {...other, username: nickname}
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
    async register({dispatch, commit}, payload): Promise<void> {
      try {
        await firebase.register({
          email: payload.email,
          password: payload.password,
          nickname: payload.nickname,
          id: payload.id
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
    async getUserData({commit, dispatch}): Promise<UserInterface | undefined> {
      try {
        // @@TODO Temporary
        const res: any = await firebase.observable()
        if (res && res.token) {
          const {token, lastMessages, ...data} = res
          commit('setUserData', data)
          commit('setToken', token)
          dispatch('chats/addLastMessages', lastMessages, {root: true})
          dispatch('chats/addExistedChatsList', firebase.chatsCollection, {root: true})
          commit('authStatusHandler', {
            error: false,
            success: true
          })
          return data
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
    async fetchChat(context, chatId) {
      return await firebase.getAllLastMessagesOrExactChatMessages('messages', chatId)
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
