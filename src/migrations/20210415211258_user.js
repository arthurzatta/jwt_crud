
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name',10);
    table.string('email',255);
    table.string('password',255);
    table.unique('email');
  });
};

exports.down = function(knex) {
  knex.schema.dropTable('users');
};
