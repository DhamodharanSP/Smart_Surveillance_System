const mongoose = require('mongoose');

const CriminalSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  alias: { type: String },
  gender: { type: String, required: true },
  estimatedAge: { type: String, required: true },
  height: { type: String, required: true },
  weight: { type: String, required: true },
  bodyType: { type: String },
  skinTone: { type: String },
  hair: { type: String },
  facialHair: { type: String },
  eyeColor: { type: String },
  scarsTattoos: { type: [String] },
  photo: { type: String, required: true },
});

module.exports = mongoose.model('Criminal', CriminalSchema);