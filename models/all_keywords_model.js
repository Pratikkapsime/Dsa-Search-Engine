
const mongoose = require('mongoose');

const all_keywordsSchema = new mongoose.Schema({
    keyword_values: String, 

  }, {timestamp: true});
  
  const Db_keyword = mongoose.model('Db_keyword', all_keywordsSchema);

  module.exports = Db_keyword;


