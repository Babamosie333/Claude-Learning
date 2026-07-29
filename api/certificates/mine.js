const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const connectDB = require('../../lib/db');
const Certificate = require('../../lib/models/Certificate');

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

    const certs = await Certificate.find({ userId: req.auth.userId }).sort({ date: -1 });
    res.status(200).json({ certificates: certs });
  } catch (err) {
    console.error('certificates/mine error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Failed to load certificates' });
  }
};
