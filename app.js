const express = require('express');

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const auth = require('./controllers/auth');

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieParser());

app.post('/register', auth.register);

app.post('/login', auth.login);

app.use(auth.verify);

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/secret', (req, res) => {
  res.send('I really need a haircut...');
});


app.listen(port, () => console.log(`Now listening on port ${port}...`));
