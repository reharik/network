const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
};

module.exports = { knexConfig };
