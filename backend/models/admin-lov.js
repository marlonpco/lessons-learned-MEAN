const mongoose = require('mongoose');

const lovSchema = mongoose.Schema({
  code: {type: String, require: true },
  description: {type: String, require: true }
});

module.exports = mongoose.model("LOV", lovSchema);
