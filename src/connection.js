const { development } = require('../knexfile');
const knex = require('knex')(development);

export default knex;