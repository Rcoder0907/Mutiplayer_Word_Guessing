const mongoose = require('mongoose')
const { mongoUri } = require('./constants')

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
