
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name',10);
    table.string('hashPassword',255);
  });
};

exports.down = function(knex) {
  knex.schema.dropTable('users');
};
