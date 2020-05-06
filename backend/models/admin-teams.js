const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true }
});

module.exports = mongoose.model("Team", teamSchema);
