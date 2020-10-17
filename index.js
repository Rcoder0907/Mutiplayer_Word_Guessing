require('./utils/db')
const express = require('express')
const { port } = require('./utils/constants')
const app = express()
const authController = require('./controllers/auth.controller')
const { errorHandler } = require('./middlewares/errorHandler.middleware')

app.use(express.json())

app.use('/', authController)

app.use(errorHandler)
app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})
