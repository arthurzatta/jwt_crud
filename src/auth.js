const jwt = require('jsonwebtoken');
const knex = require('./connection');

//MD5 hash
const SECRET = '11f40ac44d7aef49e94d7462578e1104';

//Payload = informations
//Return the token
const sign = payload => jwt.sign(payload,SECRET,{ algorithm: 'HS256', expiresIn: 86400});

//Return the payload decoded
const verify = token => jwt.verify(token,SECRET);


//The token is decripted to provide access and some personals datas,
//but it is keep in use, because the middleware interceptation
async function authMidleware(req, res, next) {
    
    const authHeader = req.headers.authorization;
    
    if(!authHeader) {
        return res.status(401).json({ error: 'Token no provided' });
    }
    
    const [, token] = authHeader.split(' ');
    
    try {
        const payload = verify(token);

        req.id = payload.id;

        return next();

    } catch (error) {
        return res.status(401).json({ error: 'Invalid Token' });
    }
}

//Token is generated here and can be used for other authentications necessities
async function login (req, res) {
    const [, hash]  = req.headers.authorization.split(' ');
    const [ email, password ] = Buffer.from(hash, 'base64')
        .toString()
        .split(':');
    const pass = password;
    try {
        const [{ password, ...user }] = await knex('users').select().where('email', email);

        if(!user) {
            return res.status(401).json({ error: 'Invalid email'});
        }

        if(password !== pass){
            return res.status(401).json({ error: 'Invalid password'});
        }

        const token = await sign({ user: user.id });

        res.json({ user, token});
    } catch (error) {
        res.status(401).json(error);
    }
};

module.exports = { authMidleware, login };

