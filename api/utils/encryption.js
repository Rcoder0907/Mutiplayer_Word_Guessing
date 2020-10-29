const bcrypt = require('bcryptjs')
const salt = 10

const encrypt = async ({ input }) => {
  const hashed = await bcrypt.hash(input, salt)
  return hashed
}

const decrypt = async ({ hashed, plain }) => {
  return await bcrypt.compare(plain, hashed)
}

module.exports = {
  encrypt, decrypt
}
