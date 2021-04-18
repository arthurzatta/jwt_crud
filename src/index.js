const express = require('express');
const User = require('./controllers/UserController');
const jwt = require('./auth');
const knex = require('./connection');

//Establish connection https
const app = express();
app.use(express.json());

async function authMidleware(req,res, next) {
    const [, token] = req.headers.authorization.split(' ');
    try {
        const payload = await jwt.verify(token);
        const user = await knex('users').select().where('id',payload.user);

        if(!user) {
            return res.status(401);
        }

        req.auth = user;
        next();
    } catch (error) {
        return res.status(401);
    }
}

app.post('/signup', async (req, res) => {
    try {
        const user = await User.create(req, res);
        const token = jwt.sign({ user: user.id });

        res.json({ user, token});   
    } catch (error) {
        res.status(400).json(error);
    }
})

app.get('/login', async (req, res) => {
    const [, hash]  = req.headers.authorization.split(' ');
    const [ email, password ] = Buffer.from(hash, 'base64')
        .toString()
        .split(':');

    try {
        const user = await knex('users').select().where('email', email);

        if(!user) {
            return res.status(401);
        }

        const token = jwt.sign({ user: user.id });

        res.json({ user, token});
    } catch (error) {
        res.status(400).send(error);
    }
});

//Every route after the payload, can only be accessible if the token is used
app.use(authMidleware);

app.get('/list', User.list);
app.delete('/delete/:id', User.delete);
app.put('/update/:id', User.update);


app.listen(3333)