const mongoose = require('mongoose');

// One document per logged-in person, keyed by their unique Clerk user id.
// email is stored too, since you asked for email to be the uniqueness anchor
// visible in the dashboard, but clerkId is the actual unique index Clerk guarantees.
const userSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true, index: true },
  email:   { type: String, required: true, unique: true, index: true },
  name:    { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
