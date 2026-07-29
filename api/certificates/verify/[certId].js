const connectDB = require('../../../lib/db');
const Certificate = require('../../../lib/models/Certificate');

module.exports = async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    const { certId } = req.query;
    const cert = await Certificate.findOne({ certId: String(certId).toUpperCase() });
    if (!cert) return res.status(404).json({ valid: false });
    res.status(200).json({ valid: true, certificate: cert });
  } catch (err) {
    console.error('verify error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
};
