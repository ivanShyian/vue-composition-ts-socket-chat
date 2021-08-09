import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../firebase-config'
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
}

interface FirebaseUser {
  email: string
  id: string
  nickname: string
  uid: string
}

interface FirebaseLoginInterface {
  user: FirebaseUser
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
        const databaseUser = await this.getUserData(user.uid) as FirebaseUser
        return {token, user: databaseUser}
      }
    } catch (error) {
      console.error(error.message | error)
    }
  }

  public async getUserData(uid: string): Promise<FirebaseUser | undefined> {
    try {
      const {data} = await axiosBase.post('/user/me', JSON.stringify({uid}))
      if (data) {
        this.myUserDatabaseID = data.id
        return data
      }
    } catch (e) {
      console.error(e.message || e)
    }
  }

  private __getTokenAndSetHeaders = async(user: any): Promise<string> => {
    const token = await user.getIdToken()
    await setAuthToken(token)
    return token
  }

  private __authenticateByEmail = async({email, password}: Credentials): Promise<firebase.auth.UserCredential> => {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  }
}
