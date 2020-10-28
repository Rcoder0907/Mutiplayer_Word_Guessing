const express = require('express')
const router = express.Router()
const { addUser, login } = require('../services/auth.service')
const { checkAuth } = require('../middlewares/auth.middleware')

router.post('/register', async (req, res, next) => {
  try {
    const userInput = req.body
    const result = await addUser({
      userPayload: {
        name: userInput.name,
        email: userInput.email,
        password: userInput.password
      }
    })
    return res.status(201).json(result)
  } catch (e) {
    next(e)
  }
})

router.post('/login', async (req, res, next) => {
  try {
    const loginPayload = req.body
    const result = await login({
      loginPayload: {
        email: loginPayload.email,
        password: loginPayload.password
      }
    })
    return res.status(200).json(result)
  } catch (e) {
    next(e)
  }
})

router.get('/me', checkAuth, (req, res) => {
  return res.json(req.user)
})

module.exports = router
