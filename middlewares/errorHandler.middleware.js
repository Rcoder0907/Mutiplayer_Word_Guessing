const errorHandler = (err, req, res, next) => {
  console.error(err.stack)
  return res.status(500).send(err.message || 'Something broke!')
}

module.exports = {
  errorHandler
}
