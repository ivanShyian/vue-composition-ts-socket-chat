import { createStore, createLogger } from 'vuex'
import socket from './modules/socket.module'
import auth from './modules/auth.module'

export default createStore<any>({
  plugins: process.env.NODE_ENV === 'development' ? [createLogger()] : [],
  modules: {
    auth,
    socket
  }
})
