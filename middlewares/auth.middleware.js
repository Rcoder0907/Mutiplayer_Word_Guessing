const { verify } = require('../utils/jwt.util')

const checkAuth = (req, res, next) => {
  try {
    const payload = req.headers.authorization
    const [, token] = payload.split(' ')
    const user = verify({ token })
    req.user = user
    return next()
  } catch (e) {
    return res.send(401).json({
      message: 'Unable to login'
    })
  }
}

module.exports = {
  checkAuth
}
