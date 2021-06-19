import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import firebaseConfig from '../../firebase-config'

firebase.initializeApp(firebaseConfig)

interface Credentials {
  email: string,
  password: string,
  nickname?: string
}

export default class Firebase {
  async observable(): Promise<{
    nickname: string,
    email: string
    token: string
  } | Record<never, string> | Promise<never>> {
    let userData = {}
    await new Promise((resolve, reject) => {
      firebase.auth().onAuthStateChanged(async(user) => {
        if (user) {
          const token = await user.getIdToken()
          const databaseUser = await this.getUserFromDatabase(user.uid)
          resolve(userData = { token, ...databaseUser })
        }
        if (!user) {
          reject(console.warn('User doesn\'t defined'))
        }
      })
    })
    return userData
  }

  async login({ email, password }: Credentials): Promise<undefined | {
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
      const { user } = await this.authenticateByEmail({
        email,
        password
      })
      if (!user) return
      const databaseUser = await this.getUserFromDatabase(user.uid)
      console.log(databaseUser)
      const token = await this.getToken()
      return {
        user: databaseUser,
        token
      }
    } catch (error) {
      return error
    }
  }

  async register({ email, password, nickname }: Credentials): Promise<{ state: boolean }> {
    try {
      if (!(email?.length && password?.length && nickname?.length)) {
        throw new Error('All fields must be filled up')
      }
      await this.createNewUser({
        email,
        password,
        nickname
      })
      return {
        state: true
      }
    } catch (error) {
      return error
    }
  }

  async getUser(): Promise<firebase.User | null> {
    return firebase.auth().currentUser
  }

  authenticateByEmail = async({ email, password }: Credentials): Promise<firebase.auth.UserCredential> => {
    return await firebase.auth().signInWithEmailAndPassword(email, password)
  }

  getUserFromDatabase = async(uid: string): Promise<firebase.database.DataSnapshot> => {
    const response = await firebase.database().ref().child('users').child(uid).child('userData').get()
    return response.val()
  }

  getToken = async(): Promise<undefined | { expiredIn: string, token: string }> => {
    const result = await firebase.auth().currentUser?.getIdTokenResult()
    if (!result) {
      return
    }
    return {
      expiredIn: result.expirationTime,
      token: result.token
    }
  }

  createNewUser = async({ nickname, password, email }: Credentials): Promise<void> => {
    const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
    if (response?.user?.uid) {
      await this.writeNewUserToDatabase({
        email,
        nickname: nickname!,
        uid: response.user.uid
      })
    }
  }

  writeNewUserToDatabase = async({ uid, email, nickname }: {
    [key: string]: string
  }): Promise<void> => {
    await firebase.database().ref('/users/' + uid).set({
      userData: {
        email,
        nickname,
        listOfChats: null
      },
      userChats: null
    })
  }
}
