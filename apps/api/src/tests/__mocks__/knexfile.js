const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
  useNullAsDefault: true,
};

module.exports = { knexConfig };
