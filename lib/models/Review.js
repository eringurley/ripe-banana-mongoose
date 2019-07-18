const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
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
    type: Number, 
    required: true, 
    ref: 'Review', 
    length: 140
  }
}, 
{ timestamps: true }
);

module.exports = mongoose.model('Review', filmSchema);
