const { UserModel } = require('../models')

const addUser = async ({ userPayload }) => {
  const user = new UserModel(userPayload)

  await user.save()
  return user
}

module.exports = {
  addUser
}
