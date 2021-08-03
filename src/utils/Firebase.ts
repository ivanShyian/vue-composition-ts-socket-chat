import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../firebase-config'
import {randomId} from '@/utils/randomIdGenerator'
import {axiosBase, setAuthToken} from '@/axios/request'

firebase.initializeApp(firebaseConfig)

interface Credentials {
  email: string
  password: string
  nickname?: string
  id?: string
}

interface FirebaseInterface {
  chatsArray: null | string[]
  chatsCollection: {[key: string]: string}
  myUserDatabaseID: null | string
  usersByChat: {[key: string]: any}
}

interface FirebaseLoginInterface {
  user: {
    [key: string]: any
  }
  token: string
}

type ObservableType = Promise<{
  nickname: string,
  email: string
  token: string
} | Record<never, string> | Promise<never>>

export default class Firebase implements FirebaseInterface {
  chatsArray: null | string[] = null
  chatsCollection: {[key: string]: string} = {}
  myUserDatabaseID: null | string = null
  usersByChat: {[key: string]: any} = {}

  private static _instance: Firebase

  constructor() {
    if (!Firebase._instance) {
      Firebase._instance = this
    }
    return Firebase._instance
  }

  public async observable(): ObservableType {
    let userData = {}
    await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user) {
          const token = await this.__getTokenAndSetHeaders(user)
          const databaseUser = await this.getUserData(user.uid)
          resolve(userData = {token, ...databaseUser})
        }
        if (!user) {
          reject(console.warn('User doesn\'t defined'))
        }
      })
    })
    return userData
  }

  public async login({email, password}: Credentials): Promise<undefined | FirebaseLoginInterface> {
    try {
      if (!(email.length && password.length)) {
        throw new Error('All fields must be filled up')
      }
      await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      const {user} = await this.__authenticateByEmail({email, password})

      if (user) {
        const token = await this.__getTokenAndSetHeaders(user)
        const databaseUser = await this.getUserData(user.uid)
        return {token, user: databaseUser}
      }
    } catch (error) {
      console.error(error.message | error)
    }
  }

  // @TODO Register through backend
  // public async register({email, password, nickname, id}: Credentials): Promise<{state: boolean}> {
  //   try {
  //     if (!(email?.length && password?.length && nickname?.length && id?.length)) {
  //       throw new Error('All fields must be filled up')
  //     }
  //     await this.__createNewUser({
  //       email,
  //       password,
  //       nickname,
  //       id
  //     })
  //     return {
  //       state: true
  //     }
  //   } catch (error) {
  //     return error
  //   }
  // }

  public async getUserData(uid: string) {
    try {
      const {data} = await axiosBase.post('/user/me', JSON.stringify({uid}))
      this.myUserDatabaseID = data.id
      return data
    } catch (e) {
      console.error(e.message || e)
    }
  }

  // @TODO Send through backend
  public async sendMessage(content: any, chatID: string) {
    await this.__sendMessageToDatabase(content, chatID)
  }

  // @TODO Send through backend2
  private async __sendMessageToDatabase(content: any, chatID: string) {
    await firebase.database().ref().child('messages').child(chatID).child('messages').push(content)
    delete content.databaseID
    await firebase.database().ref().child('messages').child(chatID).child('lastMessage').set(content)
  }

  private __authenticateByEmail = async({email, password}: Credentials): Promise<firebase.auth.UserCredential> => {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
  }

  private __getTokenAndSetHeaders = async(user: any): Promise<string> => {
    const token = await user.getIdToken()
    await setAuthToken(token)
    return token
  }
}
