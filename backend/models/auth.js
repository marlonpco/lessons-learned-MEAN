const mongoose = require('mongoose');

const authSchema = mongoose.Schema({
  user: {type: String, require: true, unique: true },
  pwd: {type: String, require: true },
  // email: {type: String, require: false, unique: true },
  // empId: {type: String, require: false, unique: true },
  email: {type: String, require: false },
  empId: {type: String, require: false },
  name: {type: String, require: false },
  role: {type: String, require: true}
});

module.exports = mongoose.model("Auth", authSchema);
