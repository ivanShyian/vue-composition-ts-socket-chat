import { createStore } from 'vuex'
import socket from './modules/socket.module'

export default createStore({
  modules: {
    socket
  }
})
