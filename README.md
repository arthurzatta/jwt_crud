# JSON Web Token CRUD

A simple CRUD with JWT authentication.

Midleware for authentication, the ideia is validate the token when a route needs to be access, so the midleware intercept the route and verify the token. If it is a valid token information will be passed away.

``` javascript
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
```

This is how the token is generated.

```javascript
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
}
```