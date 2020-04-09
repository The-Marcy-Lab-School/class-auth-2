const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const register = (req, res) => {
  // 1. Hash the password
  // 2. Store the user data in our database.
  const { username, password } = req.body;

  const saltRounds = 8;
  bcrypt.hash(password, saltRounds)
    .then((hashedPassword) => User.create(username, hashedPassword))
    .then(() => res.send('User successfully created...'))
    .catch((err) => res.status(500).send(err));
};

const login = async (req, res) => {
  // 1. Check if username and password are in our database
  // 2. If they are, give them a cookie and send them on their way
  // 3. If not, deny them and send them back to the login page
  const { username, password } = req.body;

  try {
    const user = await User.getByUsername(username);

    // Check to see if user is in database
    if (!user) {
      return res.send('User not found.');
    }

    // Compare body password with hashed password in database
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.send('Incorrect password.');
    }

    const payload = { username, hashedPassword: user.password };
    jwt.sign(payload, 'secret', (err, hashedPayload) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      }

      console.log('JWT: ', hashedPayload);
      res.cookie('fakeAppToken', hashedPayload).send('Logged in!');
    });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
};

const verify = async (req, res, next) => {
  console.log('veryify middleware is running...');
  // 1. Check if they have fakeAppToken
  // 2. Verify that their fake app token username and password match
  // 3. If so, next()
  // 4. If not, denied

  if (!req.cookies.fakeAppToken) {
    return res.status(401).send('Cookie not present.');
  }

  try {
    const user = jwt.verify(req.cookies.fakeAppToken, 'secret');

    const { username, hashedPassword } = user;

    const searchedUser = await User.getByUsername(username);

    if (!searchedUser) {
      return res.status(401).send('Unauthorized user.');
    }

    if (hashedPassword === searchedUser.password) {
      return next();
    }

    return res.status(401).send('Unauthorized user.');
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

module.exports = {
  register,
  login,
  verify,
};
