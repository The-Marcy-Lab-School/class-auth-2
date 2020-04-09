const { Pool } = require('pg');

const pool = new Pool({
  user: 'reubenogbonna',
  host: 'localhost',
  database: 'fake_app',
  port: 5432,
});

module.exports = {
  query: (queryText, params) => pool.query(queryText, params),
};
