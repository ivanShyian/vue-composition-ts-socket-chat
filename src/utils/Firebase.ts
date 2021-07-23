import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../firebase-config'
import {randomId} from '@/utils/randomIdGenerator'
import set = Reflect.set;

firebase.initializeApp(firebaseConfig)

interface Credentials {
  email: string
  password: string
  nickname?: string
  id?: string
}

export default class Firebase {
  chatsArray: null | string[] = null
  myUserDatabaseID: null | string = null
  usersByChat: Record<never, string> | {
    [key:string]: any
  } = {}

  public async observable(): Promise<{
    nickname: string,
    email: string
    token: string
  } | Record<never, string> | Promise<never>> {
    let userData = {}
    await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user) {
          const token = await user.getIdToken()
          const databaseUser = await this.getUserDataAndChatListFromDatabase(user.uid)
          resolve(userData = {token, ...databaseUser})
        }
        if (!user) {
          reject(console.warn('User doesn\'t defined'))
        }
      })
    })
    return userData
  }

  public async login({email, password}: Credentials): Promise<undefined | {
    user: firebase.database.DataSnapshot,
    token: void | {
      expiredIn: string,
      token: string
    }
  }> {
    try {
      if (!(email.length && password.length)) {
        throw new Error('All fields must be filled up')
      }
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
      const {user} = await this.__authenticateByEmail({
        email,
        password
      })
      if (!user) return
      const databaseUser = await this.getUserDataAndChatListFromDatabase(user.uid)
      const token = await this.__getToken()
      return {
        user: databaseUser,
        token
      }
    } catch (error) {
      return error
    }
  }

  public async register({email, password, nickname, id}: Credentials): Promise<{ state: boolean }> {
    try {
      if (!(email?.length && password?.length && nickname?.length && id?.length)) {
        throw new Error('All fields must be filled up')
      }
      await this.__createNewUser({
        email,
        password,
        nickname,
        id
      })
      return {
        state: true
      }
    } catch (error) {
      return error
    }
  }

  public async getUserDataAndChatListFromDatabase(uid: string) {
    const user = await this.__getUserFromDatabase(uid, true)
    await this.__getUserChats(uid)
    const lastMessages = await this.getAllLastMessagesOrExactChatMessages('lastMessage')
    return {...user, lastMessages}
  }

  public async getAllLastMessagesOrExactChatMessages(value: string, exactChat?: string): Promise<any> {
    const response = await this.__getMessagesByValue({
      chats: this.chatsArray,
      value,
      exactChat
    })
    console.log({response})
    return response
  }

  private async __getUser(): Promise<firebase.User | null> {
    return firebase.auth().currentUser
  }

  private __authenticateByEmail = async({email, password}: Credentials): Promise<firebase.auth.UserCredential> => {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
  }

  private __getUserFromDatabase = async(uid: string, isMyUser = false): Promise<firebase.database.DataSnapshot> => {
    const response = await firebase.database().ref().child('users').child(uid).child('userData').get()
    if (isMyUser) {
      this.myUserDatabaseID = response.val().id
    }
    return response.val()
  }

  private __getUserChats = async(uid: string): Promise<void> => {
    const response = await firebase.database().ref().child('users').child(uid).child('chatList').get()
    this.chatsArray = response.val()
  }

  private __getMessagesByValue = async({chats, value, exactChat}: {
    chats: string[] | null
    value: string
    exactChat?: string
  }) => {
    if (chats && value) {
      switch (value) {
        case 'lastMessage':
          return await this.__fetchDataInLoopHelper({array: chats, callback: this.__fetchLastMessagesByChatId})
        case 'messages':
          return await this.__fetchMessagesByChatId(exactChat!)
      }
    }
    return null
  }

  private __fetchLastMessagesByChatId = async(chat: string) => {
    const response = await firebase.database().ref().child('messages').child(chat).child('lastMessage').get()
    const users = await this.__fetchUsersByChat(chat)

    const separateUser = users.find((userID: string) => userID !== this.myUserDatabaseID)
    const userKey = separateUser ? await this.__decodeUserByDatabaseId(separateUser) : 'self'

    if (userKey !== 'self') {
      const userData = await this.__getUserFromDatabase(userKey)
      return {...response.val(), chatUser: userData}
    }

    return {...response.val(), chatUser: 'self', databaseID: this.myUserDatabaseID}
  }

  private async __fetchMessagesByChatId(chat: string) {
    const response = await firebase.database().ref().child('messages').child(chat).child('messages').get()
    return response.val()
  }

  private async __fetchUsersByChat(chat: string) {
    const users = await firebase.database().ref().child('messages').child(chat).child('users').get()
    this.usersByChat = {...this.usersByChat, [chat]: users.val()}
    return users.val()
  }

  private __fetchDataInLoopHelper = async({array, callback}: {
    array: string[]
    callback: (payload?: any) => any
  }) => {
    return Promise.all(array.map(async(el: any) => {
      return callback(el)
    }))
  }

  private async __decodeUserByDatabaseId(databaseId: string) {
    const uid = await firebase.database().ref().child('keys').child(databaseId).get()
    return uid.val()
  }

  private __getToken = async(): Promise<undefined | { expiredIn: string, token: string }> => {
    const result = await firebase.auth().currentUser?.getIdTokenResult()
    if (!result) {
      return
    }
    return {
      expiredIn: result.expirationTime,
      token: result.token
    }
  }

  private __createNewUser = async({nickname, password, email, id}: Credentials): Promise<void> => {
    const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
    if (response?.user?.uid) {
      await this.__writeNewUserToDatabase({
        email,
        nickname: nickname!,
        uid: response.user.uid,
        id: id!
      })
    }
  }

  private __writeNewUserToDatabase = async({uid, email, nickname, id}: {
    [key: string]: string
  }): Promise<void> => {
    const futureNewChatId = randomId()
    await firebase.database().ref('/users/' + uid).set({
      userData: {
        email,
        nickname,
        uid,
        id,
        listOfChats: null
      },
      chatList: [futureNewChatId]
    })
    await firebase.database().ref('/keys/' + [id]).set(uid)
    await firebase.database().ref('/messages/' + [futureNewChatId]).set({
      lastMessage: false,
      users: [id]
    })
  }
}
