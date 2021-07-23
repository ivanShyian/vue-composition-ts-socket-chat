import { io } from 'socket.io-client'
import { handleUsers } from '@/utils/socketUserHelper'
import {newMessageHelper} from "@/utils/socketNewMessageHelper";

class SocketService {
  private __socketInstance: any
  private __socketUsers: any

  constructor() {
    if (this.__socketInstance) {
      return this.socket
    }

    this.initSocket()
    this.subscribeSocketEvents()
  }

  private initSocket() {
    this.__socketInstance = io('http://localhost:3000', {
      autoConnect: false,
      path: '/socket-service/'
    })
  }

  private subscribeSocketEvents() {
    this.socket.on('connect', () => {
      // state.users.forEach((user) => {
      //   console.log(user)
      // })
    })
    this.socket.on('disconnect', () => {
      // this.users.forEach((user) => {
      //   if (user.self) {
      //     user.connected = false;
      //   }
    })

    this.socket.on('session', ({ sessionID, userID }: {
      sessionID: any
      userID: any
    }) => {
      this.socket.auth = { sessionID, userID }
      localStorage.setItem('socketUserData', JSON.stringify({
        sessionID,
        userID
      }))
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state.socket.userId = userID
    })

    this.socket.on('users', (users: any) => {
      this.users = handleUsers(users, state.socket.id)
    })

    this.socket.on('user connected', (user: any) => {
      this.users = [...this.users, { ['user_' + user.uid]: user }]
    })

    this.socket.on('user disconnected', (user: any) => {
      this.users = this.users.filter((u: any) => {
        if ('user_undefined' in u) {
          return
        }
        return u
      })
    })

    // handleError
    this.socket.on('connect_error', (err) => {
      console.log(err)
      if (err.message === 'invalid username') {
        // dispatch('auth/logoutAndGoToLoginPage', '', { root: true })
      }
    })

    this.socket.on('new-message', ({ content, from }: {
      content: any
      from: any
    }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i]
        newMessageHelper({
          user,
          socketID: this.socket.id,
          content,
          from,
          selectedChatId: rootGetters['chats/selectedChat']
        })
      }
    })
    // toHandleEveryEvent
    this.socket.onAny((event: any, ...args: any) => {
      console.warn(event, args)
    })
  }

  public get socket() {
    return this.__socketInstance
  }

  public get users() {
    return this.__socketUsers
  }

  public set users(value) {
    this.__socketUsers = value
  }

  public connect() {
    this.socket.connect()
  }

  public destroySocketConnection() {
    this.socket.off('connect_error')
  }
}
