const jwt = require('jsonwebtoken')
const config = require('config')
const generateToken = (id) => {
  return jwt.sign({ id }, config.get('jwtPrivateKey') , {
    expiresIn: '30d',
  })
}

exports.generateToken = generateToken;