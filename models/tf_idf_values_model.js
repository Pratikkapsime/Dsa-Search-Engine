const mongoose = require('mongoose');

const tf_idfSchema = new mongoose.Schema({
    tf_idf_values: String, 

  }, {timestamp: true});
  
  const tf_idf = mongoose.model('tf_idf', tf_idfSchema);

  module.exports = tf_idf;

