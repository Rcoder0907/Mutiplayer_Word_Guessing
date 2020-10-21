const { UserModel } = require('../models')
const { decrypt } = require('../utils/encryption')
const { sign } = require('../utils/jwt.util')

const addUser = async ({ userPayload }) => {
  const user = new UserModel(userPayload)

  await user.save()
  return user
}

const login = async ({ loginPayload }) => {
  const user = await UserModel.findOne({
    email: loginPayload.email
  }).lean()
  if (!user) {
    throw new Error('Account not found')
  }
  const match = await decrypt({ hashed: user.password, plain: loginPayload.password })
  if (!match) {
    throw new Error('Password didn\'t match')
  }
  return sign({
    payload: {
      name: user.name,
      _id: user._id,
      email: user.email
    }
  })
}

module.exports = {
  addUser,
  login
}
