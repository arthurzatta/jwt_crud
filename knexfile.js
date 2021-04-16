// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/jwtCrud.sqlite'
    },
    migrations: {
      directory: './src/migrations'
    },
    useNullAsDefault: true,
  },
};
