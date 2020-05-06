const mongoose = require('mongoose');

const projectSchema = mongoose.Schema({
  name: { type: String, require: true },
  areaId: { type: mongoose.Schema.Types.ObjectId, ref: "LOV", required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client", require: true },
  phaseId: { type: mongoose.Schema.Types.ObjectId, ref: "LOV", require: true },
});

module.exports = mongoose.model("Project", projectSchema);
