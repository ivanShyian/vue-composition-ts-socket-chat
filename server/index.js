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
    const token = await getToken()
    res.send({
      email: response.user.email,
      uid: response.user.uid,
      token
    })
  } catch (e) {
    console.log(e.message)
  }
})

app.post('/register', async(req, res) => {
  try {
    await createNewUser(req.body.email, req.body.password)
    await res.send({
      token: await getToken()
    })
  } catch (e) {
    console.warn(e.message)
  }
})

const authenticateByEmail = async(email, password) => {
  return await firebase.auth().signInWithEmailAndPassword(email, password)
}

const createNewUser = async(email, password) => {
  return await firebase.auth().createUserWithEmailAndPassword(email, password)
}

const getToken = async() => {
  const result = await firebase.auth().currentUser.getIdTokenResult()
  return {
    expiredIn: result.expirationTime,
    token: result.token
  }
}

module.exports = app
