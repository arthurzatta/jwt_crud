import knex from '../connection';

class User{
    async create(req,res){
        const { name, hashPassword } = req.body;
        await knex('users').insert({
            name,
            hashPassword
        });

        return res.status(400).end();
    }

    async list(req,res){
        const query = await knex().select().table('users');
        return res.json(query);
    }

}