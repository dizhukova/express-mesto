const Card = require('../models/card');

const ERROR_CODE_400 = 400;
const ERROR_CODE_404 = 404;
const ERROR_CODE_500 = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка: ${err.message}` }));
};

module.exports.createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;

  Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }
      res.status(ERROR_CODE_500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные.' });
      }
      res.status(ERROR_CODE_500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => { // почему здесь нужно обрабатывать ошибку 404?
      // eslint-disable-next-line max-len
      // по заданию видела только 400 — Переданы некорректные данные для постановки/снятии лайка и  500 — Ошибка по умолчанию.
      if (card === null) {
        res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для постановки лайка.' });
      }
      res.status(ERROR_CODE_500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (card === null) {
        res.status(ERROR_CODE_404).send({ message: 'Карточка с указанным _id не найдена.' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные для снятия лайка.' });
      }
      res.status(ERROR_CODE_500).send({ message: `Произошла ошибка: ${err.message}` });
    });
};
