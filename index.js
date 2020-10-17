require('./utils/db')
const express = require('express')
const { port } = require('./utils/constants')
const cors = require('cors')
const app = express()
const authController = require('./controllers/auth.controller')
const { errorHandler } = require('./middlewares/errorHandler.middleware')
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.json())

app.use('/', authController)
app.use(cors())

app.use(errorHandler)

io.on('connection', (socket) => {
  console.log('a user connected')
})

http.listen(port, () => {
  console.log(`Server is running at ${port}`)
})
