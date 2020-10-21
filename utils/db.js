const mongoose = require('mongoose')
const MONGO_CONNECTION_URI = process.env.MONGO_CONNECTION_URI

mongoose.connect(MONGO_CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
