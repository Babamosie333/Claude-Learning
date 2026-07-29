const crypto = require('crypto');
const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const connectDB = require('../../lib/db');
const User = require('../../lib/models/User');
const Certificate = require('../../lib/models/Certificate');

const requireAuth = ClerkExpressRequireAuth();

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

function generateCertId() {
  return 'CL-WD-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await runMiddleware(req, res, requireAuth);
    await connectDB();

    const { userId } = req.auth;
    const { correct, total, percent, passed } = req.body || {};

    const user = await User.findOne({ clerkId: userId });
    if (!user) return res.status(404).json({ error: 'User not found. Call /api/auth/sync first.' });

    if (!passed) {
      return res.status(200).json({ passed: false, correct, total, percent });
    }

    const certId = generateCertId();
    const cert = await Certificate.create({
      certId, userId, name: user.name || user.email, email: user.email,
      correct, total, percent, passed: true
    });

    res.status(200).json({ passed: true, certificate: cert });
  } catch (err) {
    console.error('certificates create error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to save certificate' });
  }
};
