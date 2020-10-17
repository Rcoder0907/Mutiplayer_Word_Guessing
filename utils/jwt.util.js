const jwt = require('jsonwebtoken')
const secret = 'SECRET'

const sign = ({ payload }) => {
  return jwt.sign(payload, secret)
}

const verify = ({ token }) => {
  return jwt.verify(token, secret)
}

module.exports = {
  sign, verify
}
