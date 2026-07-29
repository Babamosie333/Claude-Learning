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
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await runMiddleware(req, res, requireAuth);
    await connectDB();

    const user = await User.findOne({ clerkId: req.auth.userId });
    if (!user) return res.status(404).json({ error: 'User not found. Call /api/auth/sync first.' });

    res.status(200).json({ user });
  } catch (err) {
    console.error('auth/me error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to load profile' });
  }
};
