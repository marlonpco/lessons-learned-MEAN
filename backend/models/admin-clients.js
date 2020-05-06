const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
  name: {type: String, require: true },
  description: {type: String, require: true }
});

module.exports = mongoose.model("Client", clientSchema);
