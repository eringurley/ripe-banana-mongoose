const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name, 
      address 
    } = req.body;

    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({ __v: false, address: false })
      .then(studios => res.send(studios))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Studio.findById(req.params.id),
      Film.find({ studio: req.params.id })
    ])
      .then(([studio, films]) => res.send({ ...studio.toJSON(), films }))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Film
      .find({ studio: req.params.id })
      .then(films => {
        if(films.length === 0) {
          Studio.findByIdAndDelete(req.params.id)
            .then(studio => res.send(studio))
            .catch(next);
        } else {
          res.send({
            message: 'Can not delete studio'
          });
        }
      })
      .catch(next);
  });


