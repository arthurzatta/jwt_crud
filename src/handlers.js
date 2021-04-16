const jwt = require('jsonwebtoken')
const jwtKey = "my_secret_key"
const jwtExpirySeconds = 300

const users = {
    user1: "password1",
    user2: "password2"
}

const signIn = (req, res) => {
    const { username, password } = req.body
    if(!username || !password || users[username] !== password){
        return res.status(401).end()
    }

    const token = jwt.sign({ username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds
    })

    console.log('token:', token)

    res.cookie('token', token, { maxAfe: jwtExpirySeconds*1000})
    res.end()
}

const welcome = (req, res) => {
    const token = req.cookies.token
    if(!token){
        return res.status(401).end()
    }

    let payload
    try {
        payload = jwt.verify(token, jwtKey)
    } catch(e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }

    res.send(`Welcome ${payload.username}`)
}

const refresh = (req, res) => {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).end()
    }

    let payload
    try {
        payload = jwt.verify(token, jwtKey)
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return res.status(401).end()
        }
        return res.status(400).end()
    }

    const nowUnixSeconds = Math.round(Number(new Date()) / 1000)
    if (payload.exp - nowUnixSeconds > 30) {
        return res.status(400).end()
    }

    const newToken = jwt.sign({ username: payload.username }, jwtKey, {
        algorithm: "HS256",
        expiresIn: jwtExpirySeconds,
    })

    res.cookie("token", newToken, { maxAge: jwtExpirySeconds*1000})
    res.end()
}

module.exports = { signIn, welcome, refresh}