const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      reviewer, 
      review, 
      rating, 
      film
    } = req.body;

    Review
      .create({ reviewer, review, rating, film })
      .then(review => res.send(review))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Review
      .find()
      .then(reviews => res.send(reviews))
      .catch(next);
  });
