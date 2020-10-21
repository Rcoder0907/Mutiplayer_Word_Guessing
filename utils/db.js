const mongoose = require('mongoose')
const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI || 'mongodb://localhost:27017/mp_guess'

mongoose.connect(MONGO_CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
