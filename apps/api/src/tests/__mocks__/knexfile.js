export const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: ':memory:',
  },
};

export default knexConfig;
