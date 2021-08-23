const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: '611d7afbe69470409173334a',
  };

  next();
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use(auth);

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

app.listen(PORT);
