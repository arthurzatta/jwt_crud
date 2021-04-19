const express = require('express');
const User = require('./controllers/UserController');
const { authMidleware, login } = require('./auth');
const knex = require('./connection');

const routes = express();
routes.post('/create', User.create);
routes.get('/login', login);
//Every route after the payload, can only be accessible if the token is used
routes.use(authMidleware);
routes.get('/list', User.list);
routes.delete('/delete/:id', User.delete);
routes.put('/update/:id', User.update);


routes.listen(3333)

module.exports = {routes};