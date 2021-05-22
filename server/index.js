const express = require('express')
const app = express()
const firebase = require('firebase')
const config = require('../firebaseConfig')

const cors = require('cors')

firebase.initializeApp(config)
app.use(cors({
  origin: ['http://localhost:8080', 'http://192.168.1.70:8080']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const userToken = {}

app.post('/login', async(req, res) => {
  try {
    const response = await authenticateByEmail(req.body.email, req.body.password)
    const user = await getUserFromDatabase(response.user.uid)
    const token = await getToken()
    res.status(200).send({
      user,
      token
    })
  } catch (error) {
    res.status(400).send({ error })
  }
})

app.post('/register', async(req, res) => {
  try {
    await createNewUser(req.body.email, req.body.password, req.body.nickname)
    res.status(200).send({ state: true })
  } catch (error) {
    res.status(400).send({ error })
  }
})

const authenticateByEmail = async(email, password) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password)
}

const createNewUser = async(email, password, nickname) => {
  const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
  if (response.user && response.user.uid) {
    await writeNewUserToDatabase({
      email,
      nickname,
      uid: response.user.uid
    })
  }
}
const writeNewUserToDatabase = async(user) => {
  const { uid, email, nickname } = user
  await firebase.database().ref('/users/' + uid).set({
    userData: {
      email,
      nickname,
      listOfChats: null
    },
    userChats: null
  })
}

const getUserFromDatabase = async(uid) => {
  return await firebase.database().ref(`/users/${uid}/userData`).get()
}

const getToken = async() => {
  const result = await firebase.auth().currentUser.getIdTokenResult()
  return {
    expiredIn: result.expirationTime,
    token: result.token
  }
}

module.exports = app
