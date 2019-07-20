const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');
// const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name, 
      company 
    } = req.body;

    Reviewer
      .create({ name, company })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .select({ __v: false })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Reviewer.findById(req.params.id),
      Review.find({ reviewer: req.params.id })
        .select({ updatedAt: false, createdAt: false, __v: false, reviewer: false, })
        .populate('film', { title: true })

    ])
      .then(([reviewer, reviews]) => res.send({ ...reviewer.toJSON(), reviews }))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const {
      name, 
      company
    } = req.body;

    Reviewer 
      .findByIdAndUpdate(req.params.id, { name, company }, { new: true })
      .then(reviewer => res.send(reviewer))
      .catch(next);
  });


