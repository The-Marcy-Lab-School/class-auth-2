const db = require('../db');

class User {
  static create(username, password) {
    const queryText = 'INSERT INTO users (username, password) VALUES ($1, $2)';
    return db.query(queryText, [username, password]);
  }

  static getByUsername(username) {
    const queryText = 'SELECT * FROM users WHERE username = $1;';
    return db.query(queryText, [username])
      .then((data) => data.rows[0]);
  }
}

User.getByUsername('ROgbonna1');
module.exports = User;
