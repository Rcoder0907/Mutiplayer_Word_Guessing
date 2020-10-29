const port = parseInt(process.env.PORT) || 3000
const jwtSecret = process.env.JWT_SECRET || '09ccf4f584621094'
const mongoUri = process.env.MONGO_CONNECTION_URI || 'mongodb://localhost:27017/mp_guess'
const saltLength = parseInt(process.env.SALT_LENTH) || 10

module.exports = {
  jwtSecret,
  mongoUri,
  port,
  saltLength
}
