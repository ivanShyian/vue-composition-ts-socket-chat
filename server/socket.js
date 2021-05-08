const server = require('./server')

const io = require('socket.io')(server, {
  cors: {
    origin: ['http://localhost:8080', 'http://192.168.1.70:8080'],
    methods: ['POST', 'GET']
  }
})

io.on('connection', (socket) => {
  console.log(`<= User: ${socket.id} connected =>`)

  socket.on('sendMessage', (message) => {
    const newMessage = { [socket.id]: [message] }
    io.emit('receive', newMessage)
    console.log({ newMessage })
  })

  socket.on('disconnect', (reason) => {
    console.log(`<= User: ${socket.id} disconnected - ${reason} =>`)
  })
})
