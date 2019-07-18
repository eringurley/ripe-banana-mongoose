const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  name: {
    type: String, 
    required: true,
  },
  address: {
    city: {
      type: String
    },
    state: {
      type: String
    },
    country: {
      type: String
    }
  },
  films: {
    type: mongoose.SchemaType.Types.ObjectId, 
    ref: 'film', 
    required: true
  }
});

module.exports = mongoose.model('Studio', studioSchema);

