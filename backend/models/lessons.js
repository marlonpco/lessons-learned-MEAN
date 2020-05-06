const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "Auth", required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  type: { type: mongoose.Schema.Types.ObjectId, ref: "LOV", required: true },
  classification: { type: mongoose.Schema.Types.ObjectId, ref: "LOV", required: true },
  severity: { type: mongoose.Schema.Types.ObjectId, ref: "LOV", required: true },
  case: {type: String, require: true},
  impact: {type: String, require: true},
  remidiation: {type: String, require: true},
  lesson: {type: String, require: true},
  creationDate: {type: String, require: true}
});

module.exports = mongoose.model("Lesson", lessonSchema);
