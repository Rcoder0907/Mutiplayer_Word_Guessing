const express = require('express')
const router = express.Router()
const { addUser } = require('../services/auth.service')

router.post('/register', async (req, res) => {
  const userInput = req.body
  const result = await addUser({
    userPayload: {
      name: userInput.name,
      email: userInput.email,
      password: userInput.password
    }
  })
  return res.status(201).json(result)
})

router.post('/login', (req, res) => {

})

module.exports = router
