/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const AuthenticationsTableTestHelper = {
  async addToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await pool.query(query);
  },

  async findToken(token) {
    const query = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await pool.query(query);

    return result.rows;
  },

  async cleanTable() {
    await pool.query('DELETE FROM authentications WHERE 1=1');
  },

  async createToken(server) {
    await server.inject({
      method: 'POST',
      url: '/users',
      payload: {
        username: 'furqon',
        fullname: 'Furqon August Seventeenth',
        password: 'secret',
      }
    })
    const responseLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: 'furqon',
        password: 'secret',
      }
    })
    const { data: { accessToken } } = JSON.parse(responseLogin.payload);
    return accessToken;
  }
};

module.exports = AuthenticationsTableTestHelper;
