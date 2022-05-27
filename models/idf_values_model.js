const mongoose = require('mongoose');

const idfSchema = new mongoose.Schema({
    idf_values: String, 

  }, {timestamp: true});
  
  const idf = mongoose.model('idf', idfSchema);

  module.exports = idf;

