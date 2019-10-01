const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5, 
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Reviewer', 
    required: true
  },
  review: {
    type: String, 
    required: true, 
    ref: 'Review', 
    maxlengthlength: 140
  },
  film: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Film',
    required: true
  }
},
{ timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);
