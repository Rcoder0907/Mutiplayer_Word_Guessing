require('./utils/db')
const express = require('express')
const { port } = require('./utils/constants')
const app = express()
const authController = require('./controllers/auth.controller')

app.use(express.json())

app.use('/', authController)

app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})
