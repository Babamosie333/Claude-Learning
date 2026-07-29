const mongoose = require('mongoose');

// Serverless functions can be invoked many times per minute, each in a fresh
// or reused execution context. Caching the connection on `global` avoids
// exhausting MongoDB Atlas connection limits by reconnecting on every call.
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = connectDB;
