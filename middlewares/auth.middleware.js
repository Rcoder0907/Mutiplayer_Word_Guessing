const { verify } = require('../utils/jwt.util')

const checkAuth = (req, res, next) => {
  try {
    const payload = req.headers.authorization
    debugger
    const [, token] = payload.split(' ')
    debugger
    const user = verify({ token })
    debugger
    req.user = user
    debugger
    return next()
  } catch (e) {
    debugger
    return res.send(401).json({
      message: 'Unable to login',
      debug: e
    })
  }
}

module.exports = {
  checkAuth
}
