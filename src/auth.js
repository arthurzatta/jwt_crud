const jwt = require('jsonwebtoken')

//MD5 hash
const secret = '11f40ac44d7aef49e94d7462578e1104'

//Payload = informations
//Return the token
export const sign = payload => jwt.sign(payload,secret,{ algorithm: 'HS256', expiresIn: 86400})

//Return the payload decoded
export const verify = token => jwt.verify(token,secret)