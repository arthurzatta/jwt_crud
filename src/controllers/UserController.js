const knex = require('../connection');

class User{
    async create(req, res){
        const { name, email, password } = req.body;
        const user = await knex('users').insert({
            name,
            email,
            password
        });
        return {id: user[0], name, email};
    }

    async list(req,res){
        const query = await knex('users').select();
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

module.exports = new User;