const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');
const cardsRoute = require('./routes/cards');

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

app.use('/*', (req, res) => {
  res.status(404).send({ message: 'Ресурс не найден' });
});

app.use('/users', usersRoute);
app.use('/cards', cardsRoute);

app.listen(PORT);
