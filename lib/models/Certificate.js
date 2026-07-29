const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certId:  { type: String, required: true, unique: true, index: true },
  userId:  { type: String, required: true, index: true }, // Clerk user id
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  correct: { type: Number, required: true },
  total:   { type: Number, required: true },
  percent: { type: Number, required: true },
  passed:  { type: Boolean, required: true },
  date:    { type: Date, default: Date.now }
});

module.exports = mongoose.models.Certificate || mongoose.model('Certificate', certificateSchema);
