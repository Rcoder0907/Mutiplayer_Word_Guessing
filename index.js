require('./utils/db')
const express = require('express')
const { port } = require('./utils/constants')
const cors = require('cors')
const app = express()
const authController = require('./controllers/auth.controller')
const { errorHandler } = require('./middlewares/errorHandler.middleware')
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const path = require('path')
const { verify } = require('./utils/jwt.util')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/', authController)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

const onlineUsers = []

io.on('connection', (socket) => {
  socket.emit('unauthorized', 0)

  socket.on('disconnect', () => {
    console.log('Disconnect')
    const index = onlineUsers.findIndex(u => `${u.id}` === `${socket.id}`)

    const userDetails = onlineUsers[index]
    if (userDetails) {
      console.log(`${userDetails.name} have left`)
      onlineUsers.splice(index, 1)
      io.emit('users updated', onlineUsers)
      io.emit('user left', `${userDetails.name} left`)
    }
  })

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg)
  })

  socket.on('token', (token) => {
    console.log('Token')
    const result = verify({ token })
    socket._id = result._id
    socket.name = result.name

    onlineUsers.push({
      id: socket.id,
      _id: result._id,
      name: result.name
    })
    io.emit('users updated', onlineUsers)
    io.emit('user joined', `${result.name} joined`)
  })
})

http.listen(port, () => {
  console.log(`Server is running at ${port}`)
})
