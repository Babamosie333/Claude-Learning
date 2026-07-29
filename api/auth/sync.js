const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const connectDB = require('../../lib/db');
const User = require('../../lib/models/User');

const requireAuth = ClerkExpressRequireAuth();

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => (result instanceof Error ? reject(result) : resolve(result)));
  });
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await runMiddleware(req, res, requireAuth);
    await connectDB();

    const { userId } = req.auth;
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email is required' });

    const user = await User.findOneAndUpdate(
      { clerkId: userId },
      { clerkId: userId, email, name: name || '' },
      { upsert: true, new: true }
    );

    res.status(200).json({ user });
  } catch (err) {
    console.error('auth/sync error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to sync user' });
  }
};
