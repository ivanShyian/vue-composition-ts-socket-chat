const express = require('express')
const app = express()

const cors = require('cors')

app.use(cors({
  origin: ['http://localhost:8080', 'http://192.168.1.70:8080']
}))

module.exports = app
