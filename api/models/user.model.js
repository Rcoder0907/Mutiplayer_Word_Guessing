const mongoose = require('mongoose')
const { encrypt } = require('../utils/encryption')

const userSchema = mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Name must be more than 2 characters'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  this.password = await encrypt({ input: this.password })
  return next()
})

userSchema.path('email').validate(async (email) => {
  const emailCount = await mongoose.models.User.countDocuments({ email })
  return !emailCount
}, 'Email already exists')

module.exports = mongoose.model('User', userSchema)
