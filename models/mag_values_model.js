const mongoose = require('mongoose');

const magnitudeSchema = new mongoose.Schema({
    mag_values: String, 

  }, {timestamp: true});
  
  const Db_mag = mongoose.model('Db_mag', magnitudeSchema);

  module.exports = Db_mag;

