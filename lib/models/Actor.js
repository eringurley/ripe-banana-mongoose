const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  dob: {
    type: String
  },
  pob: {
    type: String, 
  },
});

module.exports = mongoose.model('Actor', actorSchema);
