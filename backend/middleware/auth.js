const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

/** Blocks the request unless a valid session cookie is present. */
function requireAuth(req, res, next) {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: 'Please log in to continue.' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }
}

/** Attaches req.user if a valid session cookie is present, but never blocks the request. */
function optionalAuth(req, _res, next) {
  const token = req.cookies?.token;
  if (token) {
    try {
      req.user = jwt.verify(token, JWT_SECRET);
    } catch {
      req.user = null;
    }
  }
  next();
}

module.exports = { requireAuth, optionalAuth, JWT_SECRET };
