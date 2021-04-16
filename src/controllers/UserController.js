import knex from '../connection';

class User{
    async create(req,res){
        const { name, hashPassword } = req.body;
        await knex('users').insert({
            name,
            hashPassword
        });

        return res.status(200).end();
    }

    async list(req,res){
        const query = await knex().select().table('users');
        return res.json(query);
    }

    async delete(req, res){
        const { id } = req.params;
        await knex('users').where('id',id).del();
        return res.status(200).end();
    }

    //Update needs to be done in the user section
    //users doesn't need to pass your ids to update your datas
    //so this why JWT is usefull
    async update(req, res){
        const { id } = req.params;
        const { name } = req.body;

        if(!name) {
            return res.status(400).end();
        }

        await knex('users').where("id", id).update({ name });
        
        return res.status(200).end()
    }

}