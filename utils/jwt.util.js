const jwt = require('jsonwebtoken')
const { jwtSecret } = require('./constants')

const sign = ({ payload }) => {
  return jwt.sign(payload, jwtSecret)
}

const verify = ({ token }) => {
  return jwt.verify(token, jwtSecret)
}

module.exports = {
  sign, verify
}
