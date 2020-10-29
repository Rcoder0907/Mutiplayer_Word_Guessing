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
const crypto = require('crypto')

app.use(cors())
app.use(express.json())
app.use(express.static('public'))
app.use('/', authController)
app.use(errorHandler)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/index.html'))
})

const onlineUsers = []
const liveGuesses = []
const allSockets = {}

io.on('connection', (socket) => {
  // This basically triggers auth events
  socket.emit('unauthorized', 0)

  // When a user leaves
  socket.on('disconnect', () => {
    console.log('Disconnect')
    const index = onlineUsers.findIndex(u => `${u.id}` === `${socket.id}`)

    const userDetails = onlineUsers[index]
    if (userDetails) {
      console.log(`${userDetails.name} have left`)
      onlineUsers.splice(index, 1)
      io.emit('users updated', onlineUsers)
      io.emit('user left', `${userDetails.name} left`)
      delete allSockets[`${socket.id}`]
    }
  })

  // Second step in auth, trigger by unauthorized event
  socket.on('token', (token) => {
    console.log('Token')
    const result = verify({ token })
    socket._id = result._id
    socket.name = result.name

    onlineUsers.push({
      id: `${socket.id}`,
      _id: `${result._id}`,
      name: result.name
    })
    io.emit('users updated', onlineUsers)
    io.emit('user joined', `${result.name} joined`)
    allSockets[`${socket.id}`] = socket
  })

  // When a new guess is asked
  socket.on('new', (payload) => {
    const { player, answer } = payload
    const personWhoInvited = onlineUsers.find(u => `${u.id}` === `${socket.id}`)
    const invitedPerson = onlineUsers.find(u => `${u.id}` === `${player}`)

    // Create a new guess object, this holds everything
    const guess = {
      quizId: crypto.randomBytes(8).toString('hex'),
      owner: personWhoInvited,
      player: invitedPerson,
      questionsAsked: 0,
      correctAnswer: answer
    }
    liveGuesses.push(guess)

    allSockets[`${invitedPerson.id}`].emit('new guess', guess)
    socket.emit('new guess', guess)
  })

  // When a questoin is asked by player
  socket.on('ask question', payload => {
    const { question, quizId } = payload
    const quiz = liveGuesses.find(q => q.quizId === quizId)
    const ownerSocket = allSockets[`${quiz.owner.id}`]
    ownerSocket.emit('question asked', {
      quizId,
      question
    })
  })

  // When a question is replied by owner
  socket.on('quiz reply', payload => {
    const { quizId, value } = payload
    const quiz = liveGuesses.find(q => q.quizId === quizId)
    const playerSocket = allSockets[`${quiz.player.id}`]
    playerSocket.emit('quiz replied', {
      quizId,
      value
    })
  })

  // When player submits final answer
  socket.on('submit answer', payload => {
    const { quizId, answer } = payload
    const quiz = liveGuesses.find(q => q.quizId === quizId)
    const ownerSocket = allSockets[`${quiz.owner.id}`]
    if (answer === quiz.correctAnswer) {
      ownerSocket.emit('correct guess', {
        quizId
      })
      socket.emit('correct guess', {
        quizId
      })
    } else {
      ownerSocket.emit('incorrect guess', {
        quizId
      })
      socket.emit('incorrect guess', {
        quizId
      })
    }
  })
})

http.listen(port, () => {
  console.log(`Server is running at ${port}`)
})
